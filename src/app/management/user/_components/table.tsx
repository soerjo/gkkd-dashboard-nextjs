import * as React from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/custom/button";
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
import { useLazyGetAllUserQuery } from "@/store/services/user";
import { Spinner } from "@/components/ui/spinner";
import useQueryParams from "@/hooks/user-query-params";
import { GetUserResponse } from "@/interfaces/userResponse";
import { getErroMessage } from "../../../../lib/rtk-error-validation";
import { toast } from "react-toastify";
import { CircleCheck, CircleMinus } from "lucide-react";

export const columns: ColumnDef<GetUserResponse>[] = [
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => <div className="text-nowrap">{row.getValue("username")}</div>,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div className="text-nowrap capitalize">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div className="text-nowrap">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="">{row.original?.status ? "active" : "non active"}</div>
        ),
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (<>
            {row.getValue("phone") ?
                (
                    <div className="flex flex-row justify-start items-center">
                        {row.original.isphonevalid ? <CircleCheck className="size-4 mr-1 text-green-800" /> : <CircleMinus className="size-4 mr-1 text-red-800" />}

                        {row.getValue("phone")}
                    </div>
                ) : (
                    <div className="flex flex-row justify-center items-center">
                        {"-"}
                    </div>
                )}
        </>

        ),
    },

    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <div className="uppercase">{row.getValue("role")}</div>
        ),
    },
    {
        accessorKey: "region",
        header: "Region",
        cell: ({ row }) => (
            <div className="uppercase text-nowrap">{row.original?.region?.name || "-"}</div>
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

export type FetchTable = {
    page?: string,
    take?: string,
    search?: string,
    church?: string,
    dateFrom?: string,
    dateTo?: string
    role?: string,
}

export function DataTable() {
    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });

    useQueryParams({ key: 'page', value: pagination.pageIndex + 1 })
    useQueryParams({ key: 'take', value: pagination.pageSize })

    const pageSizeOptions = [5, 10, 20, 30, 50]
    const searchParams = useSearchParams();

    const [fetchData, { data, isLoading }] = useLazyGetAllUserQuery()
    const fetchMember = async (props: FetchTable) => {
        try {
            const params = {
                page: props.page ? Number(props.page) : undefined,
                take: props.take ? Number(props.take) : undefined,
                region_id: props.church ? Number(props.church) : undefined,
                role: props.role,
                search: props.search,
            }
            await fetchData(params, false)
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    }

    React.useEffect(() => {
        const params = Object.fromEntries(searchParams.entries())
        fetchMember(params)
    }, [searchParams])

    const table = useReactTable({
        data: data?.data?.entities || [],
        columns: columns,
        pageCount: data?.data?.meta?.pageCount ?? -1,
        onPaginationChange: setPagination,
        state: { pagination },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    })

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
