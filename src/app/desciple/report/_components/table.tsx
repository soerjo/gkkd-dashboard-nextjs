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
import { IDisciplesReport } from "@/interfaces/disciples-report.interface";
import { useLazyGetAllQuery } from "@/store/services/disciples-report";
import { toast } from "react-toastify";
import { getErroMessage } from "../../../../lib/rtk-error-validation";

export const columns: ColumnDef<IDisciplesReport>[] = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => <div className="lowercase text-nowrap">{new Date(row.getValue("date")).toLocaleDateString('id', { month: 'long', day: "2-digit", year: 'numeric' })}</div>,
    },
    {
        accessorKey: "group",
        header: "Group Name",
        cell: ({ row }) => <div className="capitalize text-nowrap">{row.original.disciple_group?.name}</div>,
    },
    {
        accessorKey: "pembimbing",
        header: "Pembimbing",
        cell: ({ row }) => <div className="text-nowrap capitalize">{`${row.original.disciple_group.pembimbing.name} - ${row.original.disciple_group.pembimbing_nim}`}</div>,
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
    pembimbing?: string;
    group?: string;
    date_from?: string;
    date_to?: string;
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
                ...props,
                page: props.page ? Number(props.page) : undefined,
                take: props.take ? Number(props.take) : undefined,
                region_id: props.church ? Number(props.church) : undefined,
                pembimbing_nim: props.pembimbing ? props.pembimbing : undefined,
                group_id: props.group ? Number(props.group) : undefined,
                search: props.search,
                date_from: props.date_from ? props.date_from : undefined,
                date_to: props.date_to ? props.date_to : undefined,
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
        pageCount: data?.data?.meta?.pageCount ?? -1,
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
