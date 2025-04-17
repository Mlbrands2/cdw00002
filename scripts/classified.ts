import { faker } from '@faker-js/faker';
import slugify from 'slugify';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const enums = {
  ulez: ['EXEMPT', 'COMPLIANT', 'NON_COMPLIANT'],
  transmission: ['MANUAL', 'AUTOMATIC'],
  colour: ['BLACK', 'WHITE', 'RED', 'BLUE', 'SILVER', 'GREY', 'OTHER'],
  fuel: ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'OTHER'],
  body: ['SEDAN', 'HATCHBACK', 'SUV', 'COUPE', 'CONVERTIBLE', 'WAGON', 'VAN', 'OTHER'],
  odo: ['MILES', 'KILOMETERS'],
  currency: ['GBP', 'EUR', 'USD', 'TZS', 'AUD', 'CAD', 'INR', 'JPY', 'CNY'],
  status: ['DRAFT', 'PUBLISHED', 'SOLD', 'ARCHIVED'],
};

async function main() {
  try {
    await client.connect();
    console.log('✅ Connected to Neon');

    // Get valid foreign keys (assumes you have Make/Model/Variant tables populated)
    const { rows: makeRows } = await client.query(`
      SELECT m.id AS make_id, mo.id AS model_id, v.id AS variant_id
      FROM makes m
      JOIN models mo ON mo.make_id = m.id
      JOIN model_variants v ON v.model_id = mo.id
    `);

    if (!makeRows.length) {
      console.error('❌ No make/model/variant data found');
      return;
    }

    for (let i = 0; i < 150; i++) {  // Change loop to 150
      const ref = faker.helpers.arrayElement(makeRows);
      const year = faker.date.between({ from: '2000-01-01', to: new Date() }).getFullYear();
      const vrm = faker.vehicle.vrm();
      const title = `${year} ${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`;
      const slug = slugify(`${title}-${vrm}`, { lower: true });

      const values = [
        slug,
        vrm,
        title,
        faker.commerce.productDescription(),
        year,
        faker.number.int({ min: 0, max: 200000 }),
        faker.number.int({ min: 2, max: 5 }),
        faker.number.int({ min: 4, max: 8 }),
        faker.number.int({ min: 4000, max: 100000 }),
        ref.make_id,
        ref.model_id,
        ref.variant_id,
        faker.helpers.arrayElement(enums.ulez),
        faker.helpers.arrayElement(enums.transmission),
        faker.helpers.arrayElement(enums.colour),
        faker.helpers.arrayElement(enums.fuel),
        faker.helpers.arrayElement(enums.body),
        faker.helpers.arrayElement(enums.odo),
        faker.helpers.arrayElement(enums.currency),
        faker.helpers.arrayElement(enums.status),
        faker.number.int({ min: 0, max: 5000 }),
      ];

      const query = `
        INSERT INTO classifieds (
          slug, vrm, title, description, year,
          odo_reading, doors, seats, price,
          make_id, model_id, model_variant_id,
          ulez_compliance, transmission, colour, fuel_type, body_type,
          odo_unit, currency, status, views, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12,
          $13, $14, $15, $16, $17,
          $18, $19, $20, $21, NOW(), NOW()
        )
      `;

      await client.query(query, values);
      console.log(`✅ Inserted: ${slug}`);
    }

  } catch (err) {
    console.error('❌ Error inserting data:', err);
  } finally {
    await client.end();
  }
}

main();
