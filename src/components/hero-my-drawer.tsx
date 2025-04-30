import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { Search, PlusIcon, Plus } from "lucide-react";

export type MyDrawerProps = {
  DrawerForm: React.FC<{ onOpenChange: React.Dispatch<React.SetStateAction<boolean>> }>;
  title?: string;
};

export function HeroMyDrawer({ DrawerForm, title }: MyDrawerProps) {
  // const [open, setOpen] = React.useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure({ id: "drawer-hero" });
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    // return (
    //     <Sheet open={open} onOpenChange={setOpen}>
    //         <SheetTrigger asChild>
    //             {children}
    //         </SheetTrigger>
    //         <SheetContent className="">
    //             <DrawerForm onOpenChange={setOpen} />
    //         </SheetContent>
    //     </Sheet>
    // );
  }

  return (
    // <Drawer open={open} onOpenChange={setOpen}>
    //     <DrawerTrigger asChild>
    // {children}
    //     </DrawerTrigger>
    //     <DrawerContent>
    //         {/* <div className="h-[90vh]"> */}
    //         <DrawerForm onOpenChange={setOpen} />
    //         {/* </div> */}
    //     </DrawerContent>
    // </Drawer>

    <>
      <Button
        isIconOnly={!isDesktop}
        onPress={onOpen}
        variant="solid"
        color="primary"
        startContent={<Plus />}
      >
        {isDesktop && title}
      </Button>

      <Drawer 
      placement={!isDesktop ? "bottom":"right"}
      size={isDesktop ? "xl":"full"}
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Log in</DrawerHeader>
              <DrawerBody>
                <DrawerForm onOpenChange={onOpenChange} />
              </DrawerBody>
              {/* <DrawerFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Sign in
                </Button>
              </DrawerFooter> */}
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
