import { Client } from 'pg';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const imageSources = {
  classifiedPlaceholder: 'https://qgcedi3w89.ufs.sh/f/JB97hIuSLQkXYHxZ8UwZM0rzqmnLCeHBa42p38tdogPbwFWk',
};

async function main() {
  try {
    await client.connect();
    console.log('✅ Connected to the database');

    // Get all classified IDs
    const { rows: classifieds } = await client.query('SELECT id FROM classifieds');

    for (const classified of classifieds) {
      const numberOfImages = faker.number.int({ min: 1, max: 3 });

      for (let i = 0; i < numberOfImages; i++) {
        const src = imageSources.classifiedPlaceholder;
        const alt = faker.lorem.words(2);
        const blurhash = faker.string.alphanumeric(10); // You can use a real blurhash generator here

        const query = `
          INSERT INTO images (src, alt, blurhash, classified_id, created_at, updated_at)
          VALUES ($1, $2, $3, $4, NOW(), NOW())
        `;

        const values = [src, alt, blurhash, classified.id];
        await client.query(query, values);

        console.log(`✅ Inserted image for classified ID ${classified.id}`);
      }
    }
  } catch (error) {
    console.error('❌ Error inserting images:', error);
  } finally {
    await client.end();
    console.log('🛑 Connection closed');
  }
}

main();
