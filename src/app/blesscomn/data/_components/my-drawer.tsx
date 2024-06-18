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
import { CreateForm } from "./create-form";

export function MyDrawer({ children }: Readonly<{ children: React.ReactNode }>) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    {children}
                </SheetTrigger>
                <SheetContent className="">
                    <CreateForm onOpenChange={setOpen} />
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <div className="h-[70vh]">
                    <CreateForm onOpenChange={setOpen} />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
