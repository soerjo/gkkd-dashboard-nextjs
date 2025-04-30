import { ICermon } from "@/interfaces/cermon.interface"
import { Button } from "@heroui/button"
import { Select, SelectItem } from "@heroui/select"
import { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export interface PaginationFooterProps <T>{
    table: Table<T>
}
export const PaginationFooter = <T,>({table}: PaginationFooterProps<T> ) => {
    const pageSizeOptions = [5, 10, 20, 30, 50];
    
    return (
        <div className="flex flex-row items-center gap-4 justify-end">
        <p className="whitespace-nowrap text-sm font-medium">
            Rows per page
        </p>
    <Select 
        className="w-20"
        onChange={({target}) => table.setPageSize(Number(target.value))}
        defaultSelectedKeys={["10"]}
    >
        {pageSizeOptions.map((pageSize) => (
        <SelectItem key={pageSize}>{`${pageSize}`}</SelectItem>
        ))}
    </Select>
    {/* </div> */}
    <div className="flex items-center justify-center text-sm font-medium">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
    </div>
    <div className="flex items-center space-x-2">
        <Button
            aria-label="Go to first page"
            isIconOnly
            onPress={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
        >
            <ChevronsLeft className="size-4" aria-hidden="true" />
        </Button>
        <Button
            aria-label="Go to previous page"
            isIconOnly
            onPress={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
        >
            <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <Button
            aria-label="Go to next page"
            isIconOnly
            onPress={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
        >
            <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
        <Button
            aria-label="Go to last page"
            isIconOnly
            onPress={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
        >
            <ChevronsRight className="size-4" aria-hidden="true" />
        </Button>
    </div>
</div>
    )
}