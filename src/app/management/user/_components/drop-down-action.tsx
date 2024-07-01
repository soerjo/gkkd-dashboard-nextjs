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
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { IconTrash, IconEye, IconEdit, IconRefresh, IconHistory } from "@tabler/icons-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { UpdateFormInput } from "./update-form";
import { GetUserResponse } from "@/interfaces/userResponse";
import {
    useDeleteUserMutation,
    useLazyGetAllUserQuery,
    useLazyGetUserByIdQuery,
    useResetUserPasswordMutation,
    useRestoreUserMutation,
} from "@/store/services/user";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { useToast } from "@/components/ui/use-toast";

export const DropdownAction = ({ row }: { row: Row<GetUserResponse> }) => {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { toast } = useToast();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1");
    const take = parseInt(searchParams.get("take") || "10");
    const search = searchParams.get("search") || "";

    const [getData] = useLazyGetUserByIdQuery();
    const [getAllData] = useLazyGetAllUserQuery();
    const [deleteData] = useDeleteUserMutation();
    const [resetPassword] = useResetUserPasswordMutation();
    const [restoreUser] = useRestoreUserMutation();

    const setParams = () => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("id", row.original.id + "");
        router.replace(`${pathname}?${newSearchParams.toString()}`, {
            scroll: false,
        });

        getData({ id: row.original.id });
        setOpen(true);
    };

    const handleDeleteData = async () => {
        try {
            await deleteData({ id: row.original.id }).unwrap();
            await getAllData({ page, take, search }).unwrap();
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast({
                className:
                    "fixed top-5 z-[100] flex max-h-screen w-full flex-col-reverse p-4  sm:right-5 sm:flex-col w-fit",
                variant: "destructive",
                description: errorMessage,
            });
        }
    };

    const handleResetPassword = async () => {
        await resetPassword({ id: row.original.id }).unwrap();
    };

    const handleRestoreUser = async () => {
        await restoreUser({ id: row.original.id }).unwrap();
        await getAllData({ page, take, search }).unwrap();
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

    if (isDesktop)
        return (
            <div className="flex items-center justify-center">
                <Sheet open={open} onOpenChange={setOpen}>
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
                            <DropdownMenuItem className="flex gap-2 w-full cursor-pointer" onClick={setParams}>
                                <IconEye size={18} />
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex gap-2 w-full cursor-pointer" onClick={setParams}>
                                <IconEdit size={18} />
                                Update
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                <AlertDialog>
                                    <AlertDialogTrigger className="flex gap-2 w-full">
                                        <IconTrash size={18} />
                                        Delete
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you sure delete user: {row.original.name}?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently
                                                delete and remove your data from servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteData}>
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuItem>
                            {
                                !row.original.status &&
                                <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                    <AlertDialog>
                                        <AlertDialogTrigger className="flex gap-2 w-full">
                                            <IconHistory size={18} />
                                            Restore
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Are you sure restore user: {row.original.name}?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action will restore user status. This will activate the user from servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleRestoreUser}>
                                                    Continue
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </DropdownMenuItem>
                            }
                            <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                <AlertDialog>
                                    <AlertDialogTrigger className="flex gap-2 w-full">
                                        <IconRefresh size={18} />
                                        Reset Password
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you sure reset password user: {row.original.name}?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                                This will change user default password from servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleResetPassword}>
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <SheetContent className="">
                        <UpdateFormInput onOpenChange={setOpen} />
                    </SheetContent>
                </Sheet>
            </div>
        );

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex gap-2" onClick={setParams}>
                            <IconEye size={18} />
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex gap-2" onClick={setParams}>
                            <IconEdit size={18} />
                            Update
                        </DropdownMenuItem>
                        <AlertDialogTrigger>
                            <DropdownMenuItem className="flex gap-2">
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
            </AlertDialog>
        </Drawer>
    );
};
