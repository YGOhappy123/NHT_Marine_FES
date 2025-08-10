import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BADGE_COLORS } from '@/configs/constants'
import { AddImportData, formSteps } from '@/pages/DashboardImport/AddImportPage'
import { Separator } from '@/components/ui/separator'
import formatCurrency from '@/utils/formatCurrency'
import dayjs from '@/libs/dayjs'

type FinalStepFormProps = {
    data: AddImportData
    suppliers: ISupplier[]
    onConfirm: (values: AddImportData) => Promise<void>
    onPrev: () => void
    isLoading: boolean
}

const FinalStepForm = ({ data, suppliers, onConfirm, onPrev, isLoading }: FinalStepFormProps) => {
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
                        <div className="flex flex-1 flex-col gap-4 p-4">
                            <div className="text-justify">
                                <span className="text-card-foreground font-medium">1.1. Nhà cung cấp: </span>
                                {suppliers.find(supplier => supplier.supplierId === data.supplierId)?.name}
                            </div>
                            <div className="text-justify">
                                <span className="text-card-foreground font-medium">1.2. Mã hóa đơn: </span>
                                {data.invoiceNumber}
                            </div>
                            <div>
                                <span className="text-card-foreground font-medium">1.3. Ngày nhập hàng: </span>
                                {dayjs(data.importDate).format('DD/MM/YYYY')}
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
                        {/* <div className="flex flex-col gap-2 p-4">
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
                        </div> */}
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
                    {isLoading ? 'Đang tải...' : 'Tạo đơn nhập hàng'}
                </Button>
            </div>
        </div>
    )
}

export default FinalStepForm
