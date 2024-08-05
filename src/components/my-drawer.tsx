import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
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

export type MyDrawerProps = {
    children: React.ReactNode,
    DrawerForm: React.FC<{ onOpenChange: React.Dispatch<React.SetStateAction<boolean>> }>
}

export function MyDrawer({ children, DrawerForm }: MyDrawerProps) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    {children}
                </SheetTrigger>
                <SheetContent className="">
                    <DrawerForm onOpenChange={setOpen} />
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
                {/* <div className="h-[90vh]"> */}
                <DrawerForm onOpenChange={setOpen} />
                {/* </div> */}
            </DrawerContent>
        </Drawer>
    );
}
