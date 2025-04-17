import { ClassifiedCard } from "@/components/inventory/classified-card";
import { ClassifiedsList } from "@/components/inventory/classified-list";
import { PageProps, AwaitedPageProps } from "@/config/types";
import { prisma } from "@/lib/prisma";

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
    return await prisma.classified.findMany({
        include: { images: true },
    })
};

export default async function InventoryPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const classifieds = await getInventory(searchParams);
    const count = await prisma.classified.count();
    return (

        <div>
            <ClassifiedsList classifieds={classifieds} />
            
        </div>

    );
}