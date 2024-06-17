"use client";

import * as React from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DotsHorizontalIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
    DownloadIcon,
} from "@radix-ui/react-icons";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { MyDrawer } from "./my-drawer";
import { PlusIcon } from "lucide-react";
import { IconTrash, IconEye, IconEdit } from "@tabler/icons-react";
import { Payment, data } from "@/data/dummy-table";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { UpdateFormInput } from "./update-form";

export const DropdownAction = ({ row }: { row: Row<Payment> }) => {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const setParams = () => {
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set("id", row.getValue("id"))
        router.replace(`${pathname}?${newSearchParams.toString()}`, {
            scroll: false,
        })
        // do redux query to fetch the data detail
        setOpen(true)
    }

    const deleteData = () => {
        console.log("delete data: " + row.getValue("id"))
        // do redux query to delete the data
    }

    React.useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams)
        if (!open) {
            newSearchParams.delete("id")
            router.replace(`${pathname}?${newSearchParams.toString()}`, {
                scroll: false,
            })
        }

    }, [open])



    if (isDesktop)
        return (
            <div className="flex items-center justify-center">
                <Sheet open={open} onOpenChange={setOpen}>
                    <AlertDialog>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <DotsHorizontalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="flex gap-2"
                                    onClick={setParams}
                                >
                                    <IconEye size={18} />
                                    View

                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="flex gap-2"
                                    onClick={setParams}
                                >
                                    <IconEdit size={18} />
                                    Update
                                </DropdownMenuItem>
                                <AlertDialogTrigger>
                                    <DropdownMenuItem
                                        className="flex gap-2"
                                    >
                                        <IconTrash size={18} />
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <SheetContent className="">
                            <UpdateFormInput onOpenChange={setOpen} />
                        </SheetContent>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={deleteData}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </Sheet>
            </div>
        );

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <AlertDialog>

                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="flex gap-2"
                            onClick={setParams}
                        >
                            <IconEye size={18} />
                            View

                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="flex gap-2"
                            onClick={setParams}
                        >
                            <IconEdit size={18} />
                            Update
                        </DropdownMenuItem>
                        <AlertDialogTrigger>
                            <DropdownMenuItem
                                className="flex gap-2"
                            >
                                <IconTrash size={18} />
                                Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DrawerContent>
                    <div className="h-[70vh]">
                        <UpdateFormInput onOpenChange={setOpen} />
                    </div>
                </DrawerContent>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteData}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Drawer>
    )
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "No",
        header: "No",
        cell: ({ row }) => <div className="capitalize">{row.index + 1}</div>,
    },
    {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "name",
        header: "Name",
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
        accessorKey: "createdAt",
        header: () => <div className="text-center">Created At</div>,
        cell: ({ row }) => (
            <div className="capitalize text-center">
                {new Date(row.getValue("createdAt")).toLocaleDateString()}
            </div>
        ),
    },

    {
        id: "actions",
        enableHiding: true,
        accessorKey: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (<DropdownAction row={row} />)
    },
];

export function DataTable() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const pageSizeOptions = [10, 20, 30, 40, 50];

    return (
        <div className="w-full">
            <div className="flex items-center pb-4 justify-between">
                <div className="flex items-center gap-2">
                    <Input placeholder="Search..." className="max-w-xs" />
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
                        {table.getRowModel().rows?.length ? (
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
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex w-full flex-col-reverse items-center justify-end gap-4 overflow-auto pt-4 sm:flex-row sm:gap-8">
                {/* <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div> */}
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
                        {/* <Button
                            aria-label="Go to first page"
                            variant="outline"
                            className="hidden size-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <DoubleArrowLeftIcon className="size-4" aria-hidden="true" />
                        </Button> */}
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
                        {/* <Button
                            aria-label="Go to last page"
                            variant="outline"
                            size="icon"
                            className="hidden size-8 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <DoubleArrowRightIcon className="size-4" aria-hidden="true" />
                        </Button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
