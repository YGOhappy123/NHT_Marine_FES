import { Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

type CustomPaginationProps = {
    page: number
    maxPage: number
    limit: number
    setPage: (value: number) => void
    setLimit: (value: number) => void
}

const CustomPagination = ({ page, maxPage, limit, setPage, setLimit }: CustomPaginationProps) => {
    return (
        <div className="flex items-center justify-between px-2">
            <div></div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Số dòng mỗi trang</p>
                    <Select
                        value={limit.toString()}
                        onValueChange={value => {
                            setLimit(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={limit.toString()} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map(pageSize => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Trang {page} trên {maxPage}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                    >
                        <span className="sr-only">Về trang đầu</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        <span className="sr-only">Về trang trước</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPage(page + 1)}
                        disabled={page === maxPage}
                    >
                        <span className="sr-only">Đến trang sau</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => setPage(maxPage)}
                        disabled={page === maxPage}
                    >
                        <span className="sr-only">Đến trang cuối</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CustomPagination
