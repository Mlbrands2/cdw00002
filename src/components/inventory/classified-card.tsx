import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';
import { Classified, Colour, FuelType, OdoUnit, Prisma, Transmission } from '../../../prisma/src/generated/prisma';
import { ClassifiedWithImage } from '@/config/types';
import { HTMLParser } from '../shared/html-parser';
import { Cog, Fuel, FuelIcon, GaugeCircle, Paintbrush2 } from 'lucide-react';
import { options } from 'sanitize-html';
import { Button } from '../ui/button';

interface ClassifiedCardProps {
    classified: ClassifiedWithImage;
}

function formatNumber(num: number | null, options?: Intl.NumberFormatOptions) {
    if (!num) return "0";

    return new Intl.NumberFormat('en-GB', options).format(num);


}

function formatOdometerUnit(unit: OdoUnit) {
    return unit === OdoUnit.MILES ? "mi" : "km";
}

function formatTransmission(transmission: Transmission) {
    return transmission === Transmission.AUTOMATIC ? "Auto" : "Manual";
}

function formatFuelType(fuelType: FuelType) {
    switch (fuelType) {
        case FuelType.PETROL:
            return "Petrol";
        case FuelType.DIESEL:
            return "Diesel";
        case FuelType.ELECTRIC:
            return "Electric";
        case FuelType.HYBRID:
            return "Hybrid";
        default:
            return "Unknown";
    }
}

function formatColour(colour: Colour) {
    switch (colour) {
        case Colour.BLACK:
            return 'Black';
        case Colour.WHITE:
            return 'White';
        case Colour.RED:
            return 'Red';
        case Colour.BLUE:
            return 'Blue';
        case Colour.SILVER:
            return 'Silver';
        case Colour.GREY:
            return 'Grey';
        default:
            return 'Unknown';

    }
}

const getKeyClassifiedInfo = (classified: ClassifiedWithImage) => {
    return [{
        id: "odoReading",
        icon: <GaugeCircle className='w-4 h-4' />,
        value: `${formatNumber(classified.odoReading)} ${formatOdometerUnit(classified.odoUnit)}`,

    },
    {
        id: "transmission",
        icon: <Cog className='w-4 h-4' />,
        value: classified?.transmission ? formatTransmission(classified?.transmission) : null,

    },
    {
        id: "fuelType",
        icon: <FuelIcon className='w-4 h-4' />,
        value: classified?.colour ? formatFuelType(classified?.fuelType) : null,
    },
    {
        id: "colour",
        icon: <Paintbrush2 className='w-4 h-4' />,
        value: classified?.colour ? formatColour(classified?.colour) : null, //format colour
    }
    ]
}

export const ClassifiedCard = (props: ClassifiedCardProps) => {

    const { classified } = props;

    return <div className='bg-white relative rounded-md shadow-md overflow-hidden flex flex-col'>
        <div className='aspect-3/2 relative'>
            <Link href={routes.singleClassified(classified.slug)} className='relative block w-full h-full'>
                <Image placeholder='blur'
                    blurDataURL={classified.images[0]?.blurhash}
                    src={classified.images[0]?.src}
                    alt={classified.images[0]?.alt}
                    fill={true}
                    className='object-cover'
                    quality={25}
                />
            </Link>
            <div className='absolute top-2.5 right-3.5 bg-primary text-slate-50 font-bold px-2 py-1 rounded'>
                <p className='text-xs lg:text-base xl:text-lg font-semibold'>{classified.price}</p>
            </div>
        </div>
        <div className='p-4 flex flex-col space-y-3'>
            <div>
                <Link href={routes.singleClassified(classified.slug)} className='text-slate-800 font-semibold text-lg lg:text-xl xl:text-2xl hover:text-blue-300 transition-colors duration-200'>
                    {classified.title}
                </Link>
                {classified?.description && (
                    <div className='text-xs mdtext-sm md:text-sm xl:text-base text-slate-600 line-clamp-2'>
                        <HTMLParser html={classified.description} />
                        &nbsp;
                    </div>
                )}
                <ul className='text-xs md:text-sm text-gray-600 xl:flex grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-4 items-center justify-between w-full'>
                    {getKeyClassifiedInfo(classified).filter((v) => v.value).map(({ id, icon, value }) => (
                        <li key={id} className='font-semibold flex xl:flex-col items-center gap-x-1.5'>
                            {icon} {value}
                        </li>
                    ))}
                </ul>
            </div>
            <div className='mt-4 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:gap-x-2 w-full'>
                <Button className='flex-1 transition-colors hover:border-white hover:bg-primary hover:text-white py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base font-semibold border-2 border-primary text-primary rounded-md'
                asChild
                variant='outline'
                size='sm'>
                    <Link href={routes}>
                    Reserve
                    </Link>
                </Button>
                <Button className='flex-1 py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base font-semibold border-2 border-slate-300 text-slate-800 rounded-md bg-white hover:bg-slate-100 transition-colors duration-200'
                asChild
                size='sm'>
                    <Link href={routes.singleClassified(classified.slug)}>
                    View Details
                    </Link>
                </Button>
            </div>
        </div>
    </div>
}