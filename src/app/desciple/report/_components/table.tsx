import * as React from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
    DownloadIcon,
} from "@radix-ui/react-icons";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    PaginationState
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MyDrawer } from "./my-drawer";
import { PlusIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DropdownAction } from "./drop-down-action";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetAllChurchQuery } from "@/store/services/church";
import { GetChurchResponse } from "@/interfaces/churchResponse";
import { useToast } from "@/components/ui/use-toast";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { Spinner } from "@/components/ui/spinner";
import useDebounce from "@/hooks/use-debounce";

export const columns: ColumnDef<GetChurchResponse>[] = [
    // {
    //     accessorKey: "No",
    //     header: "No",
    //     cell: ({ row }) => <div className="capitalize">{row.index + 1}</div>,
    // },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "alt_name",
        header: "Alternative Name",
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },

    {
        accessorKey: "parent",
        header: "Parent",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("parent")}</div>
        ),
    },

    {
        id: "actions",
        enableHiding: true,
        accessorKey: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <DropdownAction row={row} />,
    },
];

export function DataTable() {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const pageSizeOptions = [5, 10, 20, 30, 50]

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams();

    // search params
    const page = Number(searchParams?.get("page") ?? "1") // default is page: 1
    const take = Number(searchParams?.get("take") ?? "5") // default 5 record per page
    const search = searchParams?.get("search") ?? "" // default 5 record per page

    const { toast } = useToast();
    const { data, error, isLoading } = useGetAllChurchQuery({
        page: page,
        take: take,
        search: search
    });

    useEffect(() => {
        if (error) {
            const errorMessage = getErroMessage(error);
            toast({
                className:
                    "fixed top-5 z-[100] flex max-h-screen w-full flex-col-reverse p-4  sm:right-5 sm:flex-col w-fit",
                variant: "destructive",
                description: errorMessage,
            });
        }
    }, [error]);



    // create query string
    const createQueryString = React.useCallback(
        (params: Record<string, string | number | null>) => {
            const newSearchParams = new URLSearchParams(searchParams?.toString())

            for (const [key, value] of Object.entries(params)) {
                if (value === null) {
                    newSearchParams.delete(key)
                } else {
                    newSearchParams.set(key, String(value))
                }
            }

            return newSearchParams.toString()
        },
        [searchParams]
    )

    // handle server-side pagination
    const [{ pageIndex, pageSize }, setPagination] =
        React.useState<PaginationState>({
            pageIndex: Number(page) - 1,
            pageSize: Number(take),
        })

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    React.useEffect(() => {
        setPagination({
            pageIndex: Number(page) - 1,
            pageSize: Number(take),
        })
    }, [page, take])

    // changed the route as well
    React.useEffect(() => {
        router.push(
            `${pathname}?${createQueryString({
                page: pageIndex + 1,
                take: pageSize,
                search: debouncedSearchTerm,
            })}`
        )
    }, [pageIndex, pageSize, debouncedSearchTerm])

    const table = useReactTable({
        data: data?.data.entities || [],
        columns,
        pageCount: data?.data.meta.pageCount ?? -1,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    })

    return (
        <div className="w-full">
            <div className="flex items-center pb-4 justify-between">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search..."
                        className="max-w-xs"
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <MyDrawer>
                        <Button variant="outline" size="sm" className="flex gap-2">
                            <PlusIcon className="size-4" aria-hidden="true" />
                            {isDesktop && "New Church"}
                        </Button>
                    </MyDrawer>
                    <Button variant="outline" size="sm" className="flex gap-2">
                        <DownloadIcon className="size-4" aria-hidden="true" />
                        {isDesktop && "Export"}
                    </Button>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {!isLoading &&
                            table.getRowModel().rows?.length > 0 &&
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        {!isLoading && !table.getRowModel().rows?.length && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                        {isLoading && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <div className="w-full flex justify-center items-center">
                                        <Spinner size="medium" className="m-auto">
                                            <span>Loading ...</span>
                                        </Spinner>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex w-full flex-col-reverse items-center justify-end gap-4 overflow-auto pt-4 sm:flex-row sm:gap-8">
                <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                    <div className="flex items-center space-x-2">
                        <p className="whitespace-nowrap text-sm font-medium">
                            Rows per page
                        </p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={value => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[4.5rem]">
                                <SelectValue
                                    placeholder={table.getState().pagination.pageSize}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {pageSizeOptions.map(pageSize => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            aria-label="Go to first page"
                            variant="outline"
                            className="hidden size-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <DoubleArrowLeftIcon className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                            aria-label="Go to previous page"
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeftIcon className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                            aria-label="Go to next page"
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRightIcon className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                            aria-label="Go to last page"
                            variant="outline"
                            size="icon"
                            className="hidden size-8 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <DoubleArrowRightIcon className="size-4" aria-hidden="true" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
