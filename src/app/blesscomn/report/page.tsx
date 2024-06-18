"use client";

import { ChevronDownIcon, SlashIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "./_components/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <>
      <div className="flex flex-col space-y-2 pb-4">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Blesscomn
        </h1>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer" onClick={() => router.push("/dashboard")}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer" onClick={() => router.push("/dashboard")}>
                Blesscomn
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <DropdownMenu>
                <BreadcrumbPage>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    Report
                    <ChevronDownIcon />
                  </DropdownMenuTrigger>
                </BreadcrumbPage>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push("/blesscomn/data")}
                  >
                    Data
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push("/blesscomn/report")}
                  >
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <DataTable />
    </>
  );
}
