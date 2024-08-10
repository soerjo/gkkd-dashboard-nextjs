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
    PaginationState,
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
import { DropdownAction } from "./drop-down-action";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import useQueryParams from "@/hooks/user-query-params";
import { useLazyGetAllQuery } from "@/store/services/baptism";
import { IBaptism } from "@/interfaces/baptism.interface";
import { getErroMessage } from "../../../../lib/rtk-error-validation";
import { toast } from "react-toastify";

export const columns: ColumnDef<IBaptism>[] = [
    {
        accessorKey: "uniq_code",
        header: "No Surat",
        cell: ({ row }) => <div className="lowercase text-nowrap">{row.getValue("uniq_code")}</div>,
    },
    {
        accessorKey: "full_name",
        header: "Full Name",
        cell: ({ row }) => <div className="capitalize text-nowrap">{row.getValue("full_name")}</div>,
    },
    {
        accessorKey: "pastor",
        header: "Pastor",
        cell: ({ row }) => <div className="capitalize text-nowrap">{row.getValue("pastor")}</div>,
    },
    {
        accessorKey: "witness_1",
        header: "Witness 01",
        cell: ({ row }) => <div className="capitalize text-nowrap">{row.getValue("witness_1")}</div>,
    },
    {
        accessorKey: "witness_2",
        header: "Witness 02",
        cell: ({ row }) => <div className="capitalize text-nowrap">{row.getValue("witness_2")}</div>,
    },
    {
        id: "actions",
        enableHiding: true,
        accessorKey: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <DropdownAction row={row} />,
    },
];

export type FetchMemberProps = {
    page?: string;
    take?: string;
    search?: string;
    church?: string;
    dateFrom?: string;
    dateTo?: string;
};

export function DataTable() {
    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });

    useQueryParams({ key: "page", value: pagination.pageIndex + 1 });
    useQueryParams({ key: "take", value: pagination.pageSize });

    const pageSizeOptions = [5, 10, 20, 30, 50];
    const searchParams = useSearchParams();

    const [fetchData, { data, isLoading }] = useLazyGetAllQuery();

    const fetchMember = async (props: FetchMemberProps) => {
        try {
            const params = {
                page: props.page ? Number(props.page) : undefined,
                take: props.take ? Number(props.take) : undefined,
                region_id: props.church ? Number(props.church) : undefined,
                search: props.search,
            };
            await fetchData(params, false);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    };

    React.useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchMember(params);
    }, [searchParams]);

    const table = useReactTable({
        data: data?.data?.entities || [],
        columns: columns,
        pageCount: data?.data?.meta.pageCount ?? -1,
        onPaginationChange: setPagination,
        state: { pagination },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    return (
        <div className="w-full">
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

            <div className="flex w-full flex-col-reverse items-center justify-end gap-4 pt-4 sm:flex-row sm:gap-8">
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
