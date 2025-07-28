import { useState, useEffect } from 'react'
import { Table } from '@tanstack/react-table'
import { Check, PlusCircle } from 'lucide-react'
import { cn } from '@/libs/shadcn-ui'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

interface TableDataFilterProps<TData, TValue> {
    table: Table<TData>
    rootColumn: string
    filterColumn: string
    title?: string
    options: {
        label: string
        value: string | number | boolean
        icon?: React.ComponentType<{ className?: string }>
    }[]
    filterFn: (rowValue: TValue, option: string | number | boolean) => boolean
}

const TableDataFilter = <TData, TValue>({
    table,
    rootColumn,
    filterColumn,
    title,
    options,
    filterFn
}: TableDataFilterProps<TData, TValue>) => {
    const tableRows = table.getCoreRowModel().rows
    const rootTableColumn = table.getColumn(rootColumn)
    const [selectedValues, setSelectedValues] = useState<Set<string | number | boolean>>(new Set())

    const handleSelect = (optionValue: string | number | boolean) => {
        if (!filterColumn || !rootTableColumn) return

        setSelectedValues(prev => {
            const newSet = new Set(prev)
            if (newSet.has(optionValue)) {
                newSet.delete(optionValue)
            } else {
                newSet.add(optionValue)
            }

            return newSet
        })
    }

    const handleClear = () => {
        rootTableColumn?.setFilterValue(undefined)
        setSelectedValues(new Set())
    }

    useEffect(() => {
        if (!rootTableColumn) return

        if (selectedValues.size === 0) {
            rootTableColumn.setFilterValue(undefined)
            return
        }

        const newValues = tableRows
            .filter(row => Array.from(selectedValues).some(value => filterFn(row.getValue(filterColumn), value)))
            .map(row => row.getValue(rootColumn))

        rootTableColumn?.setFilterValue(newValues)
    }, [selectedValues])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {title}
                    {selectedValues.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                        {selectedValues.size} được chọn
                                    </Badge>
                                ) : (
                                    options
                                        .filter(option => selectedValues.has(option.value))
                                        .map(option => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value.toString()}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                        <CommandGroup>
                            {options.map(option => {
                                const isSelected = selectedValues.has(option.value)
                                return (
                                    <CommandItem
                                        key={option.value.toString()}
                                        onSelect={() => handleSelect(option.value)}
                                    >
                                        <div
                                            className={cn(
                                                'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50 [&_svg]:invisible'
                                            )}
                                        >
                                            <Check className="h-4 w-4" />
                                        </div>
                                        {option.icon && <option.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                                        <span>{option.label}</span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>

                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem onSelect={handleClear} className="justify-center text-center">
                                        Xóa bộ lọc
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default TableDataFilter
