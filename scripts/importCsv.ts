import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

type Row = {
  make: string
  model: string
  variant: string | undefined
  yearStart: number
  yearEnd: number
}

const BATCH_SIZE = 100

async function insertInBatches<T>(
  items: T[],
  batchSize: number,
  insertFunction: (batch: T[]) => Promise<void>
) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    await insertFunction(batch)
  }
}

function safeParseYear(value: string | undefined): number {
  const year = parseInt(value ?? '')
  return isNaN(year) ? new Date().getFullYear() : year
}

async function importCSV() {
  try {
    await client.connect()
    console.log('🟢 Connected to Neon DB')

    const csvFilePath = path.join(__dirname, '../data/taxonomy.csv')
    const rows: Row[] = []

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row: { [index: string]: string }) => {
          const yearStart = safeParseYear(row.Year_Start)
          const yearEnd = safeParseYear(row.Year_End)

          rows.push({
            make: row.Make?.trim(),
            model: row.Model?.trim(),
            variant: row.Model_Variant?.trim() || undefined,
            yearStart,
            yearEnd,
          })
        })
        .on('end', () => resolve())
        .on('error', (err) => {
          console.error('🚨 Error reading CSV:', err)
          reject(err)
        })
    })

    console.log(`🧮 Parsed ${rows.length} rows from CSV.`)

    type MakeModelMap = {
      [make: string]: {
        [model: string]: {
          variants: {
            [variant: string]: {
              yearStart: number
              yearEnd: number
            }
          }
        }
      }
    }

    const result: MakeModelMap = {}

    for (const row of rows) {
      if (!result[row.make]) result[row.make] = {}
      if (!result[row.make][row.model]) {
        result[row.make][row.model] = { variants: {} }
      }
      if (row.variant) {
        result[row.make][row.model].variants[row.variant] = {
          yearStart: row.yearStart,
          yearEnd: row.yearEnd,
        }
      }
    }

    console.log('📦 Structured make/model/variant map.')

    const makes = Object.keys(result)
    await insertInBatches(makes, BATCH_SIZE, async (batch) => {
      const insertQueries = batch.map((make) =>
        client.query(
          `
          INSERT INTO makes (name, image, updated_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (name) DO UPDATE SET image = EXCLUDED.image, updated_at = NOW()
          `,
          [
            make,
            `https://vl.imgix.net/img/${make.replace(/\s+/g, '-').toLowerCase()}-logo.png?auto=format,compress`,
          ]
        )
      )
      await Promise.all(insertQueries)
      console.log(`✅ Inserted ${batch.length} makes.`)
    })

    const makeRecords = await client.query('SELECT id, name FROM makes')
    const makeMap: { [name: string]: number } = {}
    for (const make of makeRecords.rows) {
      makeMap[make.name] = make.id
    }

    const modelRows: { name: string; makeId: number }[] = []
    for (const make in result) {
      for (const model in result[make]) {
        modelRows.push({
          name: model,
          makeId: makeMap[make],
        })
      }
    }

    await insertInBatches(modelRows, BATCH_SIZE, async (batch) => {
      const insertQueries = batch.map((m) =>
        client.query(
          `
          INSERT INTO models (name, make_id, updated_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (name, make_id) DO NOTHING
          `,
          [m.name, m.makeId]
        )
      )
      await Promise.all(insertQueries)
      console.log(`✅ Inserted ${batch.length} models.`)
    })

    const modelRecords = await client.query('SELECT id, name, make_id FROM models')
    const modelMap: { [make: string]: { [model: string]: number } } = {}
    for (const row of modelRecords.rows) {
      const makeId = row.make_id
      const makeName = Object.keys(makeMap).find((key) => makeMap[key] === makeId)
      if (makeName) {
        if (!modelMap[makeName]) modelMap[makeName] = {}
        modelMap[makeName][row.name] = row.id
      }
    }

    const variantRows: {
      name: string
      modelId: number
      yearStart: number
      yearEnd: number
    }[] = []

    for (const make in result) {
      for (const model in result[make]) {
        const variants = result[make][model].variants
        for (const [variant, yearRange] of Object.entries(variants)) {
          const validStart = typeof yearRange.yearStart === 'number' && !isNaN(yearRange.yearStart)
          const validEnd = typeof yearRange.yearEnd === 'number' && !isNaN(yearRange.yearEnd)

          if (validStart && validEnd) {
            variantRows.push({
              name: variant,
              modelId: modelMap[make][model],
              yearStart: yearRange.yearStart,
              yearEnd: yearRange.yearEnd,
            })
          } else {
            console.warn(`⚠️ Skipping variant due to invalid years:`, {
              make,
              model,
              variant,
              yearStart: yearRange.yearStart,
              yearEnd: yearRange.yearEnd,
            })
          }
        }
      }
    }

    await insertInBatches(variantRows, BATCH_SIZE, async (batch) => {
      const insertQueries = batch.map((v) =>
        client.query(
          `
          INSERT INTO model_variants (name, model_id, year_start, year_end, updated_at)
          VALUES ($1, $2, $3, $4, NOW())
          ON CONFLICT (name, model_id) DO UPDATE SET
            year_start = EXCLUDED.year_start,
            year_end = EXCLUDED.year_end,
            updated_at = NOW()
          `,
          [v.name, v.modelId, v.yearStart, v.yearEnd]
        )
      )
      await Promise.all(insertQueries)
      console.log(`✅ Inserted ${batch.length} variants.`)
    })

    console.log('🎉 CSV import completed successfully!')
    await client.end()
  } catch (err) {
    console.error('🚨 Error during import:', err)
    await client.end()
  }
}

importCSV()
