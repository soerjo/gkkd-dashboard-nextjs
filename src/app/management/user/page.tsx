"use client";

import { SlashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { DataTable } from "./_components/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Dashboard() {
  const router = useRouter();


  return (
    <>
      <div className="flex flex-col space-y-2 pb-4">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Users
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
            <BreadcrumbPage>
              <BreadcrumbItem>
                Users
              </BreadcrumbItem>
            </BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <DataTable />
    </>
  );
}
