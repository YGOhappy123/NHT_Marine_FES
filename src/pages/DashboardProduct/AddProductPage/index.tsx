import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { RootState } from '@/store'
import { Check } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import FirstStepForm, { FirstStepData } from '@/pages/DashboardProduct/AddProductPage/FirstStepForm'
import SecondStepForm, { SecondStepData } from '@/pages/DashboardProduct/AddProductPage/SecondStepForm'
import ThirdStepForm, { ThirdStepData } from '@/pages/DashboardProduct/AddProductPage/ThirdStepForm'
import FinalStepForm from '@/pages/DashboardProduct/AddProductPage/FinalStepForm'
import useAxiosIns from '@/hooks/useAxiosIns'
import productService from '@/services/productService'
import { data } from 'react-router-dom'
import fileService from '@/services/fileService'

export type AddProductData = FirstStepData & SecondStepData & ThirdStepData

export const formSteps = [
    {
        title: 'Thông tin cơ bản',
        description: 'Định nghĩa các thông tin cơ bản cho sản phẩm.'
    },
    {
        title: 'Nhóm phân loại',
        description: 'Định nghĩa các nhóm phân loại cho sản phẩm.'
    },
    {
        title: 'Giá cả',
        description: 'Định nghĩa giá tiền và quy cách đóng gói cho từng chi tiết sản phẩm.'
    },
    {
        title: 'Kiểm tra',
        description: 'Tổng hợp thông tin trước khi tiến hành tạo sản phẩm.'
    }
]

const AddProductPage = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const axios = useAxiosIns()
    const [step, setStep] = useState(0)
    const [firstStepData, setFirstStepData] = useState<FirstStepData | null>(null)
    const [secondStepData, setSecondStepData] = useState<SecondStepData | null>(null)
    const [thirdStepData, setThirdStepData] = useState<ThirdStepData | null>(null)

    const { uploadBase64Mutation } = fileService()
    const { addNewProductMutation } = productService({ enableFetching: false })

    const handleSubmit = async (values: AddProductData) => {
        const resBanner = await uploadBase64Mutation.mutateAsync({
            base64: values.imageUrl,
            folder: 'products'
        })
        const bannerImg = resBanner.data.data?.imageUrl

        const productItems = await Promise.all(
            values.productItems.map(async item => {
                const resImage = await uploadBase64Mutation.mutateAsync({
                    base64: item.imageUrl,
                    folder: 'products'
                })
                const newImageUrl = resImage.data.data?.imageUrl

                return {
                    attributes: item.attributes,
                    imageUrl: newImageUrl,
                    price: item.price,
                    packingGuide: item.packingGuide
                }
            })
        )

        await addNewProductMutation.mutateAsync({
            name: values.name,
            description: values.description,
            imageUrl: bannerImg,
            categoryId: values.categoryId,
            variants: values.variants,
            productItems: productItems
        })

        setFirstStepData(null)
        setSecondStepData(null)
        setThirdStepData(null)
        setStep(0)
    }

    const getCategoriesQuery = useQuery({
        queryKey: ['categories-all'],
        queryFn: () => axios.get<IResponseData<ICategory[]>>('/products/categories'),
        enabled: true,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data
    })

    const categories = getCategoriesQuery.data?.data ?? []

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user!.fullName}!</h2>
                    <p className="text-muted-foreground">
                        Đây là các bước cần thiết để tạo một sản phẩm mới trên hệ thống NHT Marine.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Avatar className="size-12 rounded-full">
                        <AvatarImage src={user!.avatar} alt={user!.fullName} />
                    </Avatar>
                </div>
            </div>
            <div className="flex flex-col items-center gap-6">
                <ol className="flex w-full max-w-4xl items-center rounded-xl border-2">
                    {formSteps.map((item, index) => (
                        <li
                            key={index}
                            className="group relative flex flex-1 cursor-pointer items-center gap-4 px-6 py-4"
                        >
                            <div
                                className={twMerge(
                                    'flex aspect-square w-10 items-center justify-center rounded-full border-2',
                                    step > index
                                        ? 'border-primary bg-primary'
                                        : step === index
                                          ? 'border-primary'
                                          : 'border-muted-foreground group-hover:border-foreground'
                                )}
                            >
                                {step > index ? (
                                    <Check />
                                ) : (
                                    <span
                                        className={twMerge(
                                            'font-medium',
                                            step === index
                                                ? 'text-primary'
                                                : 'text-muted-foreground group-hover:text-foreground'
                                        )}
                                    >
                                        {(index + 1).toString().padStart(2, '0')}
                                    </span>
                                )}
                            </div>
                            <span
                                className={twMerge(
                                    'hidden font-medium text-balance lg:inline-block',
                                    step >= index ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                                )}
                            >
                                {item.title}
                            </span>

                            {index < formSteps.length - 1 && (
                                <div className="absolute top-0 right-0 h-full w-5">
                                    <svg
                                        viewBox="0 0 22 80"
                                        fill="none"
                                        preserveAspectRatio="none"
                                        className="text-border h-full w-full"
                                    >
                                        <path
                                            d="M0 -2L20 40L0 82"
                                            stroke="currentcolor"
                                            strokeWidth={2}
                                            vectorEffect="non-scaling-stroke"
                                            strokeLinejoin="round"
                                        ></path>
                                    </svg>
                                </div>
                            )}
                        </li>
                    ))}
                </ol>

                <Card className="w-full max-w-4xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Tạo sản phẩm mới</CardTitle>
                        <CardDescription>{formSteps[step].description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 0 && (
                            <FirstStepForm
                                defaultValues={firstStepData}
                                categories={categories}
                                onNext={values => {
                                    setFirstStepData(values)
                                    setStep(1)
                                }}
                            />
                        )}
                        {step === 1 && (
                            <SecondStepForm
                                defaultValues={secondStepData}
                                onNext={values => {
                                    setSecondStepData(values)
                                    setStep(2)
                                }}
                                onPrev={() => setStep(0)}
                            />
                        )}
                        {step === 2 && secondStepData != null && (
                            <ThirdStepForm
                                secondStepData={secondStepData}
                                defaultValues={thirdStepData}
                                onNext={values => {
                                    setThirdStepData(values)
                                    setStep(3)
                                }}
                                onPrev={() => setStep(1)}
                            />
                        )}
                        {step === 3 && firstStepData != null && secondStepData != null && thirdStepData != null && (
                            <FinalStepForm
                                data={{ ...firstStepData, ...secondStepData, ...thirdStepData }}
                                categories={categories}
                                onConfirm={async values => handleSubmit(values)}
                                onPrev={() => setStep(2)}
                                isLoading={false}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AddProductPage
