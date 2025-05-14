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
  Checkbox,
} from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import useQueryParams from "@/hooks/user-query-params";
import { useLazyGetAllQuery, useCreateMutation, useDeleteMutation } from "@/store/services/hospitality-report";
// import { getErroMessage } from "../../../../lib/rtk-error-validation";
import { toast } from "react-toastify";
import { PaginationFooter } from "@/components/pagination-footer";
import { ICreateHospitalityReport, IResponseHospitalityReport } from "@/interfaces/hospitalityReport.interface";
import { getErroMessage } from "@/lib/rtk-error-validation";
// import { UpdateFormDrawer } from "./form-update-member";

export const columns: ColumnDef<IResponseHospitalityReport>[] = [
  {
    accessorKey: "checkbox",
    header: "Checkbox",
    cell: ({row}) => <Checkbox isDisabled isSelected={row.original.is_present} size="lg" color="primary"></Checkbox>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div>
        <div className="text-nowrap text-base capitalize">{row.getValue("name")}</div>
        <div className="text-nowrap text-primary-900 text-opacity-70">
          {row.original.alias || "-"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <div className="capitalize text-nowrap">{`${row.original.gender}`}</div>,
  },
  {
    accessorKey: "segment_name",
    header: "Segment",
    cell: ({ row }) => <div className="text-nowrap uppercase">{row.getValue("segment_name")}</div>,
  },
  {
    accessorKey: "blesscomn_name",
    header: "Blesscomn",
    cell: ({ row }) => (
      <div className="text-nowrap uppercase">{row.getValue("blesscomn_name")}</div>
    ),
  },
  // {
  //     accessorKey: "action",
  //     header: "Action",
  //     cell: ({ row }) => {
  //       const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate } = useDisclosure({id: "update-data"});

  //       return (
  //       <>
  //         <Button isIconOnly startContent={< EditIcon className="text-success-300" /> } variant="light" onPress={onOpenUpdate}/>
  //         <UpdateFormDrawer
  //           id={row.original.id}
  //           data={row.original}
  //           isOpen={isOpenUpdate}
  //           onOpenChange={onOpenChangeUpdate}
  //         />
  //       </>
  //       )
  //     },
  // },
];

export type FetchMemberProps = {
  page?: string;
  take?: string;
  search?: string;
  segment?: string;
  blesscomn?: string;
  date?: string;
  sunday_service?: string;
};

export function DataTable() {
  const [pageIndex, setPageIndex] = useQueryParams({ key: "page", value: 0 });
  const [pageSize, setPageSize] = useQueryParams({ key: "take", value: 100 });

  const searchParams = useSearchParams();

  const [createData] = useCreateMutation();
  const [deleteData] = useDeleteMutation()
  const [fetchData, { data, isFetching: isLoading }] = useLazyGetAllQuery();
  const [localData, setLocalData] = React.useState<any[]>([]);

  // Sync API data to local state
  React.useEffect(() => {
    setLocalData(data?.data?.entities ?? []);
  }, [data]);

  const createReport = async (props: ICreateHospitalityReport) => {
    try {
        await createData(props);
        toast.success('update data success!')
    } catch (error) {
        const errorMessage = getErroMessage(error);
        toast.error(JSON.stringify(errorMessage));
    }
  }

  const deleteReport = async (id: number) => {
    try {
        await deleteData({id});
        toast.success('update data success!')
    } catch (error) {
        const errorMessage = getErroMessage(error);
        toast.error(JSON.stringify(errorMessage));
    }
  }

  const updateReport = async (props: IResponseHospitalityReport) => {
    const sunday_service = Number(searchParams.get("sunday_service"));
    const date = searchParams.get("date");
    if(!sunday_service || !date) return;

    try {
      if(props.is_present) {
        await deleteReport(props.report_id);
      } else {
        await createReport({
          date: date,
          sunday_service_id: sunday_service,
          hospitality_data_id: props.id,
        });
      }

      setLocalData((prevData) =>
        prevData.map((item) =>
          item.id === props.id ? { ...item, is_present: !item.is_present } : item
        )
      );
    } catch (error) {
        const errorMessage = getErroMessage(error);
        toast.error(JSON.stringify(errorMessage));
    }


  }

  const fetchMember = async (props: FetchMemberProps) => {
    if(!props.sunday_service || !props.date) return;

    try {
      const params = {
        page: props.page ? Number(props.page) + 1 : undefined,
        take: props.take ? Number(props.take) : undefined,
        date: props.date,
        sunday_service_id: Number(props.sunday_service),
        segment_id: props.segment ? Number(props.segment) : undefined,
        blesscomn_id: props.blesscomn ? Number(props.blesscomn) : undefined,
        name: props.search,
      };
      fetchData(params).unwrap();
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
    data: localData,
    columns: columns,
    pageCount: data?.data?.meta?.pageCount,
    onPaginationChange: (updater) => {
      if (typeof updater != "function") return;
      const newState = updater({ pageIndex: pageIndex, pageSize: pageSize });
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    state: {
      pagination: {
        pageIndex: Number(pageIndex ?? 0),
        pageSize: Number(pageSize ?? 10),
      },
    },
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
        selectionMode="multiple"
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
            <TableRow
              key={row.original.id}
              onDoubleClick={() => updateReport(row.original)}
            >
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
