import {fa, faker} from '@faker-js/faker';
import {PrismaClient, Prisma} from '@prisma/client';
import slug from 'slug';
import slugify from 'slugify';
import { BodyType, ClassifiedStatus, Colour, CurrencyCode, FuelType, OdoUnit, Transmission, ULEZCompliance } from '../src/generated/prisma';
/*
export async function seedClassifieds(prisma: PrismaClient) {
    const makes = await prisma.make.findMany({
        include:{
            models: {
                include:{
                    modelVariants: true
                }
            }
        }
    }) as Array<{
        id: string;
        models: Array<{
            id: string;
            modelVariants: Array<{
                id: string;
            }>;
        }>;
    }>;

    //const classifiedsData: Prisma.ClassifiedCreateManyInput[] = [];

    for (let i = 0; i < 25; i++) {
        const make = faker.helpers.arrayElement(makes);
        if(!make.models.length) continue;
        const model = faker.helpers.arrayElement(make.models);

        const variant = model.modelVariants.length
            ? faker.helpers.arrayElement(model.modelVariants)
            : null;

            console.log({make, model, variant})

            const year = faker.date.between({
                from: new Date('2000-01-01'),
                to: new Date(),
            }).getFullYear();

            //const title = [year, make.name, model.name, variant?.name].filter(Boolean).join(' ');

            const vrm = faker.vehicle.vrm();
            const baseSlug = slugify(`$(title)-$(vrm)`); 

            classifiedsData.push({
                year,
                vrm,
                slug: baseSlug,
                makeId: make.id,
                modelId: model.id,
                ...(variant ?.id && { modelVariantId: variant.id } ),
                title,
                price: faker.number.int({ min: 40000, max: 10000000 }),
                odorReading: faker.number.int({ min: 0, max: 2000 }),
                currency: faker.helpers.arrayElement(Object.values(CurrencyCode)),
                OdoUnit: faker.helpers.arrayElement(Object.values(OdoUnit)),
                doors: faker.number.int({ min: 2, max: 8 }),
                seats: faker.number.int({ min: 2, max: 8 }),
                views: faker.number.int({ min: 100, max: 10000 }),
                description: faker.commerce.productDescription(),
                BodyType: faker.helpers.arrayElement(Object.values(BodyType)),
                Transmission: faker.helpers.arrayElement(Object.values(Transmission)),
                FuelType: faker.helpers.arrayElement(Object.values(FuelType)),
                Colour: faker.helpers.arrayElement(Object.values(Colour)),
                ULEZCompliance: faker.helpers.arrayElement(Object.values(ULEZCompliance)),
                status: faker.helpers.arrayElement(Object.values(ClassifiedStatus)),
            })
    }

    const result = await prisma.classified.createMany({
        data: classifiedsData,
        skipDuplicates: true,
    });
    console.log(`Created ${result.count} classifieds`);
} */