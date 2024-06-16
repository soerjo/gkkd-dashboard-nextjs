import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { PlusIcon } from "@radix-ui/react-icons";

export function MyDrawer({ children }: Readonly<{ children: React.ReactNode }>) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                        <PlusIcon className="mr-2 size-4" aria-hidden="true" />
                        New Church
                    </Button>
                </SheetTrigger>
                <SheetContent className="">
                    {children}
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusIcon className="mr-2 size-4" aria-hidden="true" />
                    New Church
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="h-[70vh]">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
