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
import { ICermonReport } from "@/interfaces/cermon-report.interface";
import { useLazyGetAllQuery, useSyncByIdMutation } from "@/store/services/cermon-report";
import { getErroMessage } from "../../../../lib/rtk-error-validation";
import { toast } from "react-toastify";

export const SyncCell = ({ id, isSync }: { id: number; isSync: boolean }) => {
    const [fetchSync, {isLoading}] = useSyncByIdMutation();
    const handleSync = async (id: number) => {
        try {
            await fetchSync({id}).unwrap()
            toast.success('reminder has been sended')
        } catch (error) {
            console.log({ error })
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    }
    
    return (
        <div className="capitalize text-nowrap text-center">
        {isSync ? 
            <Button variant="outline" size="sm" className="bg-green-500 text-secondary hover:bg-green-500 hover:text-secondary hover:cursor-default">Sync</Button> :
            <Button disabled={isLoading} variant="outline" size="sm" className="bg-blue-500 text-secondary hover:bg-blue-700 hover:text-secondary" onClick={()=> handleSync(id)}>Sync</Button>
        }
        </div>
    )
}

export const columns: ColumnDef<ICermonReport>[] = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => <div className="lowercase text-nowrap">{new Date(row.getValue("date")).toLocaleDateString('id', { month: 'long', day: "2-digit", year: 'numeric' })}</div>,
    },
    {
        accessorKey: "cermon_name",
        header: "Cermon",
        cell: ({ row }) => <div className="capitalize text-nowrap">{row.getValue("cermon_name")}</div>,
    },
    {
        accessorKey: "total_male",
        header: () => <div className="text-center">{"Male"}</div>,
        cell: ({ row }) => <div className="capitalize text-nowrap text-center">{row.getValue("total_male")}</div>,
    },
    {
        accessorKey: "total_female",
        header: () => <div className="text-center">{"Female"}</div>,
        cell: ({ row }) => <div className="capitalize text-nowrap text-center">{row.getValue("total_female")}</div>,
    },
    {
        accessorKey: "total",
        header: () => <div className="text-center">{"Total"}</div>,
        cell: ({ row }) => <div className="capitalize text-nowrap text-center">{row.original.total}</div>,
    },

    {
        accessorKey: "total-new",
        header: () => <div className="text-center">{"Total New"}</div>,
        cell: ({ row }) => <div className="capitalize text-nowrap text-center">{row.original.new}</div>,
    },

    {
        id: "sync",
        enableHiding: true,
        accessorKey: "actions",
        header: () => <div className="text-center">Sync Status</div>,
        cell: ({ row }) => <SyncCell id={row.original.id} isSync={row.original.is_sync} />,
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
    cermon?: string;
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
                ...props,
                page: props.page ? Number(props.page) : undefined,
                take: props.take ? Number(props.take) : undefined,
                region_id: props.church ? Number(props.church) : undefined,
                cermon_id: props.cermon ? Number(props.cermon) : undefined,
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
