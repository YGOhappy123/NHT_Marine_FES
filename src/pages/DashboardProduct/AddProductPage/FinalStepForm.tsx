import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BADGE_COLORS } from '@/configs/constants'
import { AddProductData, formSteps } from '@/pages/DashboardProduct/AddProductPage'
import { Separator } from '@/components/ui/separator'
import formatCurrency from '@/utils/formatCurrency'

type FinalStepFormProps = {
    data: AddProductData
    categories: ICategory[]
    onConfirm: (values: AddProductData) => Promise<void>
    onPrev: () => void
    isLoading: boolean
}

const FinalStepForm = ({ data, categories, onConfirm, onPrev, isLoading }: FinalStepFormProps) => {
    return (
        <div>
            <Accordion type="multiple" className="w-full" defaultValue={['item-1']}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                        <div className="flex flex-col">
                            <h4 className="text-lg font-semibold">1. {formSteps[0].title}</h4>
                            <span className="text-muted-foreground text-sm">{formSteps[0].description}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex gap-12 p-4 lg:gap-24">
                            <div className="border-primary flex w-full max-w-[150px] items-center justify-center rounded-full border-4 p-1">
                                <img
                                    src={data.imageUrl || '/images/upload-icon.jpg'}
                                    className="bg-primary-foreground aspect-square h-full w-full rounded-full object-cover"
                                />
                            </div>

                            <div className="flex flex-1 flex-col gap-4">
                                <div className="text-justify">
                                    <span className="text-card-foreground font-medium">1.1. Tên sản phẩm: </span>
                                    {data.name}
                                </div>
                                <div className="text-justify">
                                    <span className="text-card-foreground font-medium">1.2. Danh mục: </span>
                                    {categories.find(category => category.categoryId === data.categoryId)?.name}
                                </div>
                                <div>
                                    <span className="text-card-foreground font-medium">1.3. Mô tả: </span>
                                    <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                        <div className="flex flex-col">
                            <h4 className="text-lg font-semibold">2. {formSteps[1].title}</h4>
                            <span className="text-muted-foreground text-sm">{formSteps[1].description}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2 p-4">
                            {data.variants!.map((variant, index) => (
                                <div key={variant.name} className="flex gap-2">
                                    <h5 className="font-semibold">
                                        2.{index + 1}. Nhóm phân loại theo "{variant.name}":
                                    </h5>
                                    <ul className="flex items-center gap-2">
                                        {variant.options!.map(option => {
                                            return (
                                                <li key={option}>
                                                    <Badge
                                                        style={{
                                                            backgroundColor: BADGE_COLORS[index % BADGE_COLORS.length]
                                                        }}
                                                    >
                                                        {option}
                                                    </Badge>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger className="hover:bg-muted/50 cursor-pointer items-center px-4">
                        <div className="flex flex-col">
                            <h4 className="text-lg font-semibold">3. {formSteps[2].title}</h4>
                            <span className="text-muted-foreground text-sm">{formSteps[2].description}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        <div className="grid grid-cols-1 gap-6 p-4 xl:grid-cols-2">
                            {data.productItems.map((item, index) => (
                                <div key={index} className="bg-muted/90 w-full rounded-lg border-2 p-3">
                                    <div className="flex gap-2">
                                        <h5 className="font-semibold">Danh sách thuộc tính:</h5>
                                        <ul className="flex items-center gap-2">
                                            {item.attributes.map((optionId, _index) => {
                                                return (
                                                    <li key={_index}>
                                                        <Badge
                                                            style={{
                                                                backgroundColor:
                                                                    BADGE_COLORS[_index % BADGE_COLORS.length]
                                                            }}
                                                        >
                                                            {data.variants[_index].options[optionId]}
                                                        </Badge>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>

                                    <Separator className="my-3 border" />

                                    <div className="flex gap-8">
                                        <div className="border-primary flex w-full max-w-[100px] items-center justify-center rounded-full border-3 p-1">
                                            <img
                                                src={data.imageUrl || '/images/upload-icon.jpg'}
                                                className="bg-primary-foreground aspect-square h-full w-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col gap-4">
                                            <div className="text-justify">
                                                <span className="text-card-foreground font-medium">3.1. Đơn giá: </span>
                                                {formatCurrency(item.price)}
                                            </div>
                                            <div className="text-justify">
                                                <span className="text-card-foreground font-medium">
                                                    3.1. Quy cách đóng gói:{' '}
                                                </span>
                                                {item.packingGuide}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="mt-6 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={onPrev}
                    className="h-12 rounded text-base capitalize"
                >
                    Quay về bước trước
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        if (!isLoading) onConfirm(data)
                    }}
                    className="h-12 rounded text-base capitalize"
                >
                    {isLoading ? 'Đang tải...' : 'Tạo sản phẩm'}
                </Button>
            </div>
        </div>
    )
}

export default FinalStepForm
