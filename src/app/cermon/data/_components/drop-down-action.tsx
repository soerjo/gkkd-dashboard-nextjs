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
} from "@/components/ui/alert-dialog";
import { Row } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { IconTrash, IconEye, IconEdit } from "@tabler/icons-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { UpdateFormInput } from "./form-update-member";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { useDeleteMutation, useLazyGetAllQuery } from "@/store/services/cermon";
import { toast } from "react-toastify";
import { ICermon } from "@/interfaces/cermon.interface";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  cn,
} from "@heroui/react";

export const DropdownAction = ({ row }: { row: Row<ICermon> }) => {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1");
    const take = parseInt(searchParams.get("take") || "10");
    const search = searchParams.get("search") || "";

    const [deleteData] = useDeleteMutation();

    const setParams = async () => {
        try {
            setOpen(true);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    };

    const handleDeleteData = async () => {
        try {
            await deleteData({ id: row.original.id }).unwrap();
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    };

    React.useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (!open) {
            newSearchParams.delete("id");
            router.replace(`${pathname}?${newSearchParams.toString()}`, {
                scroll: false,
            });
        }
    }, [open]);

    // if (isDesktop)
    //     return (
    //         <div className="flex items-center justify-center">
    //             <Sheet open={open} onOpenChange={setOpen}>
    //                 <DropdownMenu modal={false}>
    //                     <DropdownMenuTrigger asChild>
    //                         <Button variant="ghost" className="h-8 w-8 p-0">
    //                             <span className="sr-only">Open menu</span>
    //                             <DotsHorizontalIcon className="h-4 w-4" />
    //                         </Button>
    //                     </DropdownMenuTrigger>
    //                     <DropdownMenuContent align="end">
    //                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                         <DropdownMenuSeparator />
    //                         <DropdownMenuItem className="flex gap-2 w-full cursor-pointer" onClick={setParams}>
    //                             <IconEye size={18} />
    //                             View
    //                         </DropdownMenuItem>
    //                         <DropdownMenuItem className="flex gap-2 w-full cursor-pointer" onClick={setParams}>
    //                             <IconEdit size={18} />
    //                             Update
    //                         </DropdownMenuItem>
    //                         <DropdownMenuItem onSelect={e => e.preventDefault()}>
    //                             <AlertDialog>
    //                                 <AlertDialogTrigger className="flex gap-2 w-full">
    //                                     <IconTrash size={18} />
    //                                     Delete
    //                                 </AlertDialogTrigger>
    //                                 <AlertDialogContent>
    //                                     <AlertDialogHeader>
    //                                         <AlertDialogTitle>
    //                                             Are you sure delete: {row.original.id}?
    //                                         </AlertDialogTitle>
    //                                         <AlertDialogDescription>
    //                                             This action cannot be undone. This will permanently
    //                                             delete and remove your data from servers.
    //                                         </AlertDialogDescription>
    //                                     </AlertDialogHeader>
    //                                     <AlertDialogFooter>
    //                                         <AlertDialogCancel>Cancel</AlertDialogCancel>
    //                                         <AlertDialogAction onClick={handleDeleteData}>
    //                                             Continue
    //                                         </AlertDialogAction>
    //                                     </AlertDialogFooter>
    //                                 </AlertDialogContent>
    //                             </AlertDialog>{" "}
    //                         </DropdownMenuItem>
    //                     </DropdownMenuContent>
    //                 </DropdownMenu>
    //                 <SheetContent className="">
    //                     <UpdateFormInput onOpenChange={setOpen} data={row.original.id} />
    //                 </SheetContent>
    //             </Sheet>
    //         </div>
    //     );

    return (
        <Drawer open={open} onOpenChange={setOpen} >
            {/* <AlertDialog> */}
                 <Dropdown>
                      <DropdownTrigger>
                        <Button variant="flat" className="h-8 w-8 p-0" isIconOnly >
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Dropdown menu with description" variant="faded">
                        {/* <DropdownSection showDivider title="Actions">Actions</DropdownSection> */}
                        {/* <DropdownMenuSeparator /> */}
                        {/* <DropdownSection showDivider title="Actions"> */}
                            {/* <DropdownItem 
                                key="new"
                                description="Create a new file"
                                shortcut="⌘N"
                                className="flex flew-row justify-center items-center"
                                startContent={<IconEye size={32} />}
                            >
                                
                                View
                            </DropdownItem> */}
                            <DropdownItem
                                key="copy"
                                description="Copy the file link"
                                // shortcut="⌘C"
                                className="flex flew-row justify-center items-center"
                                startContent={<IconEdit size={32} />}
                            >
                                
                                Update
                            </DropdownItem>
                            <DropdownItem
                                color="danger"
                                key="copy"
                                description="Copy the file link"
                                // shortcut="⌘C"
                                className="flex flew-row justify-center items-center"
                                startContent={<IconTrash size={32} />}
                            >
                                
                                Delete
                            </DropdownItem>
                            {/* <AlertDialogTrigger>
                                <DropdownMenuItem className="flex gap-2">
                                </DropdownMenuItem>
                            </AlertDialogTrigger> */}
                        {/* </DropdownSection> */}
                    </DropdownMenu>
                </Dropdown>
                <DrawerContent>
                    {/* <UpdateFormInput onOpenChange={setOpen} data={row.original.id} /> */}
                </DrawerContent>
                {/* <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete and
                            remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteData}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> */}
        </Drawer>
    );
};
