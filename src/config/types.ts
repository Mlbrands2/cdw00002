import { Prisma } from "../../prisma/src/generated/prisma";

type Params = {
    [x: string]: string | string[];}

export type PageProps = {
    params?: Promise<Params>;
    searchParams?: Promise<[x: string] | string | string[] | undefined>;
}

export type AwaitedPageProps = {
    params?: Awaited<PageProps["params"]>;
    searchParams?: Awaited<PageProps["searchParams"]>;  
}

export type ClassifiedWithImage = Prisma.ClassifiedGetPayload<{
    include: {
        images: true;
    };
}>