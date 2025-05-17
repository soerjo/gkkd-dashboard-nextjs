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
    Row,
    useReactTable,
} from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
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
import { useLazyGetAllQuery } from "@/store/services/cermon";
import { ICermon } from "@/interfaces/cermon.interface";
import { getErroMessage } from "../../../../lib/rtk-error-validation";
import { toast } from "react-toastify";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
  Button,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import { PaginationFooter } from "@/components/pagination-footer";
import { EditIcon, TrashIcon } from "lucide-react";
import { UpdateFormDrawer } from "./form-update-member";
import { ModalDanger } from "./modal-delete";


const UpdateDrawerButton = ({ row }: { row: Row<ICermon> }) => {
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onOpenChange: onOpenChangeUpdate,
  } = useDisclosure({ id: "update-data" });

    const {
      isOpen: isOpenDelete,
      onOpen: onOpenDelete, 
      onOpenChange: onOpenChangeDelete
    } = useDisclosure({ id: "delete-data" });


  return (
    <div className="flex flex-row gap-2">
      <Tooltip content="Edit data">
        <Button
          isIconOnly
          size="sm"
          startContent={<EditIcon className="text-success-300" />}
          variant="light"
          onPress={onOpenUpdate}
        />
      </Tooltip>
      <Tooltip content="Delete data">
        <Button
          isIconOnly
          size="sm"
          startContent={<TrashIcon className="text-danger-300" />}
          variant="light"
          onPress={onOpenDelete}
        />
      </Tooltip>

      <ModalDanger
        id={row.original.id}
        data={row.original}
        isOpen={isOpenDelete}
        onOpenChange={onOpenChangeDelete}
      />

      <UpdateFormDrawer
        id={row.original.id}
        data={row.original}
        isOpen={isOpenUpdate}
        onOpenChange={onOpenChangeUpdate}
      />
    </div>
  );
};

export const columns: ColumnDef<ICermon>[] = [
    // {
    //     accessorKey: "unique_id",
    //     header: "ID",
    //     cell: ({ row }) => <div className="text-nowrap">{row.getValue("unique_id")}</div>,
    // },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div className="text-nowrap">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "time",
        header: "Time",
        cell: ({ row }) => <div className="capitalize text-nowrap">{`${row.original.day}, ${row.original.time}`}</div>,
    },
    {
        accessorKey: "segment",
        header: "Segment",
        cell: ({ row }) => <div className="text-nowrap">{row.getValue("segment")}</div>,
    },
    // {
    //     accessorKey: "description",
    //     header: "Description",
    //     cell: ({ row }) => <div className="text-nowrap">{row.getValue("description")}</div>,
    // },
    // {
    //     accessorKey: "region_name",
    //     header: "Region",
    //     cell: ({ row }) => <div className="text-nowrap">{row.getValue("region_name")}</div>,
    // },
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => <UpdateDrawerButton row={row} />,
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
            isHeaderSticky
            shadow="none"
            className="overflow-auto"
            selectionBehavior="replace"
            selectionMode="single"
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
