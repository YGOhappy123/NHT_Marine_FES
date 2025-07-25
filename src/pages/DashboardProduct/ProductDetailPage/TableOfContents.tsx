import { useIsMobile } from '@/hooks/useMobile'
import { twMerge } from 'tailwind-merge'

export const sections = {
    information: { id: 'information', title: 'Thông tin cơ bản' },
    variants: { id: 'variants', title: 'Phân loại và giá cả' },
    promotions: { id: 'promotions', title: 'Thông tin khuyến mãi' }
}

const TableOfContents = () => {
    const isMobile = useIsMobile()

    return (
        <div className={twMerge(isMobile ? 'hidden' : 'sticky top-16 w-[200px] xl:w-[250px]')}>
            <h3 className="mb-4 text-2xl font-bold">Mục lục</h3>
            <ul className="flex flex-col gap-2">
                {Object.values(sections).map(section => (
                    <li
                        key={section.id}
                        className="text-muted-foreground hover:text-primary-foreground origin-left hover:scale-105"
                    >
                        <a href={`#${section.id}`}>{section.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TableOfContents
