import { useNavigate } from 'react-router-dom'
import { ArrowLeftFromLine } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const sections = {
    information: { id: 'information', title: 'Thông tin cơ bản' },
    variants: { id: 'variants', title: 'Phân loại và giá cả' },
    promotions: { id: 'promotions', title: 'Thông tin khuyến mãi' }
}

const TableOfContents = () => {
    const navigate = useNavigate()

    return (
        <div className="sticky top-16 hidden w-[200px] lg:block xl:w-[250px]">
            <h3 className="mb-4 text-2xl font-bold">Mục lục</h3>
            <ul className="flex flex-col gap-2">
                {Object.values(sections).map(section => (
                    <li
                        key={section.id}
                        className="text-muted-foreground hover:text-primary origin-left hover:scale-105"
                    >
                        <a href={`#${section.id}`}>{section.title}</a>
                    </li>
                ))}
            </ul>
            <Button size="sm" className="mt-4 flex items-center" onClick={() => navigate('/products')}>
                <ArrowLeftFromLine className="hidden xl:block" />
                Xem danh sách sản phẩm
            </Button>
        </div>
    )
}

export default TableOfContents
