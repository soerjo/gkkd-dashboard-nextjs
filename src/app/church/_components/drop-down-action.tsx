import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Drawer,
    DrawerContent,
} from "@/components/ui/drawer";
import { IconTrash, IconEye, IconEdit } from "@tabler/icons-react";
import { Payment } from "@/data/dummy-table";
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