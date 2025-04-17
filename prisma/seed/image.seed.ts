import { imageSources } from "@/config/constats";
import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
/*
export async function seedImage(prisma: PrismaClient) {
  const classifieds = await prisma.classified.findMany();

  for (const classified of classifieds) {
    // You can generate multiple images per classified if needed
    const numberOfImages = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numberOfImages; i++) {
      const image: Prisma.ImageCreateInput = {
        src: imageSources.classifiedPlaceholder, // Assuming this is a valid URL
        alt: faker.lorem.words(3),
        blurhash: faker.string.alphanumeric(10), // Replace with actual blurhash if available
        classified: {
          connect: { id: classified.id },
        },
      };

      await prisma.image.create({ data: image });
      console.log(`✅ Created image for classified ID: ${classified.id}`);
    }
  }
}
*/