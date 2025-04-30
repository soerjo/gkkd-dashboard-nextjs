import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableColumn,
  } from '@heroui/react';
import { DropdownAction } from "./drop-down-action";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import useQueryParams from "@/hooks/user-query-params";
import { useLazyGetAllQuery } from "@/store/services/cermon";
import { ICermon } from "@/interfaces/cermon.interface";
import { getErroMessage } from "../../../../lib/rtk-error-validation";
import { toast } from "react-toastify";
import { PaginationFooter } from "@/components/pagination-footer";

export const columns: ColumnDef<ICermon>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div>
                <div className="text-nowrap text-base">{row.getValue("name")}</div>
                <div className="text-nowrap text-primary-900 text-opacity-70">{row.getValue("name")}</div>
            </div>
        ),
    },
    {
        accessorKey: "gender",
        header: "Gender",
        cell: () => <p>L</p>
        // cell: ({ row }) => <div className="capitalize text-nowrap">{`${row.original.day}, ${row.original.time}`}</div>,
    },
    {
        accessorKey: "segment",
        header: "Segment",
        cell: ({ row }) => <div className="text-nowrap">{row.getValue("segment")}</div>,
    },
    {
        accessorKey: "region_name",
        header: "Blesscomn",
        cell: ({ row }) => <div className="text-nowrap">{row.getValue("region_name")}</div>,
    },
    // {
    //     id: "actions",
    //     enableHiding: true,
    //     accessorKey: "actions",
    //     header: () => <div className="text-center">Actions</div>,
    //     cell: ({ row }) => <DropdownAction row={row} />,
    // },
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

    const searchParams = useSearchParams();

    const [fetchData, { data, isFetching: isLoading }] = useLazyGetAllQuery();

    const fetchMember = async (props: FetchMemberProps) => {
        try {
            const params = {
                page: props.page ? Number(props.page) : undefined,
                take: props.take ? Number(props.take) : undefined,
                region_id: props.church ? Number(props.church) : undefined,
                search: props.search,
            };
            fetchData(params).unwrap()
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
      <div className="flex-col flex gap-2">
        <Table
          removeWrapper
          aria-label="Example static collection table"
          selectionMode="multiple"
          className="overflow-auto"
        >
          <TableHeader>
            {table.getFlatHeaders().map((header) => (
              <TableColumn key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}{" "}
              </TableColumn>
            ))}
          </TableHeader>

          <TableBody
            emptyContent={"No found."}
            items={!isLoading ? table.getRowModel().rows : []}
            isLoading={isLoading}
            loadingContent={
              <div className="w-full flex justify-center items-center">
                <Spinner size="medium" className="m-auto">
                  <span>Loading ...</span>
                </Spinner>
              </div>
            }
          >
            {(row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <PaginationFooter table={table} />
      </div>
    );
}
