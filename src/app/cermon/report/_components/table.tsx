import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    Row,
    useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
  Tooltip,
  Button,
  useDisclosure,
  Link,
} from "@heroui/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import useQueryParams from "@/hooks/user-query-params";
import { ICermonReport } from "@/interfaces/cermon-report.interface";
import { useLazyGetAllQuery, useSyncByIdMutation } from "@/store/services/cermon-report";
import { getErroMessage } from "../../../../lib/rtk-error-validation";
import { toast } from "react-toastify";
import { PaginationFooter } from "@/components/pagination-footer";
import { EditIcon, TrashIcon, BookTextIcon } from "lucide-react";
import { ModalDanger } from "./modal-delete";
import { UpdateFormDrawer } from "./form-update-member";


const UpdateDrawerButton = ({ row }: { row: Row<ICermonReport> }) => {
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
    <div className="flex flex-row gap-1 justify-center items-center">
      <Tooltip content="Detail report">
        <Button
          isIconOnly
          size="sm"
          startContent={<BookTextIcon className="text-purple-300" />}
          variant="light"
          as={Link}
          href={`/hospitality/report/list?date=${new Date(row.original.date).toISOString().split("T")[0]}&sunday_service=${row.original.cermon_id}`}
        //   onPress={onOpenUpdate}
        />
      </Tooltip>
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

export const SyncCell = ({ id, isSync, isDisabled }: { id: number; isSync: boolean, isDisabled:boolean }) => {
    const [fetchSync, {isLoading}] = useSyncByIdMutation();
    const handleSync = async () => {
        try {
            await fetchSync({id}).unwrap()
            toast.success('reminder has been sended')
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    }
    
    return (
        <div className="capitalize text-nowrap text-center">
            <Button isDisabled={isDisabled} size="sm" color={isSync ? "default" : "primary"} onPress={handleSync} isLoading={isLoading}>Sync</Button>
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
        accessorKey: "total_new_male",
        header: () => <div className="text-center">{"New Male"}</div>,
        cell: ({ row }) => <div className="capitalize text-nowrap text-center">{row.getValue("total_new_male")}</div>,
    },
    {
        accessorKey: "total_new_female",
        header: () => <div className="text-center">{"New Female"}</div>,
        cell: ({ row }) => <div className="capitalize text-nowrap text-center">{row.getValue("total_new_female")}</div>,
    },
    {
        accessorKey: "total",
        header: () => <div className="text-center">{"Total"}</div>,
        cell: ({ row }) => <div className="capitalize text-nowrap text-center">{row.original.total}</div>,
    },
    {
        id: "sync",
        enableHiding: true,
        accessorKey: "actions",
        header: () => <div className="text-center">Sync Status</div>,
        cell: ({ row }) => <SyncCell id={row.original.id} isSync={row.original.is_sync} isDisabled={row.original.is_sync} />,
    },
    {
        id: "actions",
        enableHiding: true,
        accessorKey: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <UpdateDrawerButton row={row} />,
    },
];

export type FetchMemberProps = {
    page?: string;
    take?: string;
    search?: string;
    church?: string;
    sunday_service?: string;
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

    // const pageSizeOptions = [5, 10, 20, 30, 50];
    const searchParams = useSearchParams();

    const [fetchData, { data, isFetching }] = useLazyGetAllQuery();

    const fetchMember = async (props: FetchMemberProps) => {
        try {
            const params = {
                // ...props,
                page: props.page ? Number(props.page) : undefined,
                take: props.take ? Number(props.take) : undefined,
                region_id: props.church ? Number(props.church) : undefined,
                cermon_id: props.sunday_service ? Number(props.sunday_service) : undefined,
                date_from:props.date_from ? props.date_from  : undefined,
                date_to: props.date_to ? props.date_to  : undefined,
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
    <div className="flex-col flex gap-2">
    <div className="max-h-[70vh] overflow-auto">
      <Table
        removeWrapper
        // isVirtualized
        isHeaderSticky
        shadow="none"
        selectionBehavior="replace"
        selectionMode="single"
      >
        <TableHeader className="sticky top-0 z-10">
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
          items={!isFetching ? table.getRowModel().rows : []}
          isLoading={isFetching}
          loadingContent={
            <div className="w-full flex justify-center items-center">
              <Spinner size="medium" className="m-auto">
                <span>Loading ...</span>
              </Spinner>
            </div>
          }
        >
          {(row) => (
            <TableRow key={row.original.id} >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

      <PaginationFooter table={table} />
    </div>
    );
}
