import * as React from 'react'
import { Column } from '@tanstack/react-table'
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

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title?: string
    options: {
        label: string
        value: string | number | boolean
        icon?: React.ComponentType<{ className?: string }>
    }[]
}

export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options
}: DataTableFacetedFilterProps<TData, TValue>) {
    const rawFilterValues = column?.getFilterValue() as (string | number | boolean)[] | undefined
    const selectedStringValues = new Set(rawFilterValues?.map(String))
    const facets = column?.getFacetedUniqueValues()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircle />
                    {title}
                    {selectedStringValues.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                {selectedStringValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedStringValues.size > 2 ? (
                                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                        {selectedStringValues.size} được chọn
                                    </Badge>
                                ) : (
                                    options
                                        .filter(option => selectedStringValues.has(String(option.value)))
                                        .map(option => (
                                            <Badge
                                                variant="secondary"
                                                key={String(option.value)}
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
                                const stringValue = option.value.toString()
                                const isSelected = selectedStringValues.has(stringValue)

                                return (
                                    <CommandItem
                                        key={stringValue}
                                        onSelect={() => {
                                            const currentValues = new Set(
                                                (column?.getFilterValue() as
                                                    | (string | number | boolean)[]
                                                    | undefined) ?? []
                                            )

                                            if (isSelected) {
                                                currentValues.delete(option.value)
                                            } else {
                                                currentValues.add(option.value)
                                            }

                                            const newValues = Array.from(currentValues)
                                            column?.setFilterValue(newValues.length ? newValues : undefined)
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50 [&_svg]:invisible'
                                            )}
                                        >
                                            <Check />
                                        </div>
                                        {option.icon && <option.icon className="text-muted-foreground mr-2 h-4 w-4" />}
                                        <span>{option.label}</span>
                                        {facets?.get(option.value) && (
                                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                                {facets.get(option.value)}
                                            </span>
                                        )}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                        {selectedStringValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => column?.setFilterValue(undefined)}
                                        className="justify-center text-center"
                                    >
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
