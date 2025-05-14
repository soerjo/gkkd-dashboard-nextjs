"use client";

import { DataTable } from "./_components/table";
import { Button, Card, CardBody } from "@heroui/react";
import { Search, HeartPulse, PlusIcon } from "lucide-react";
import { CreateFormDrawer } from "./_components/form-create-member";
import MyBreadcrum from "@/components/my-breadcrum";
import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { useGetAllQuery } from "@/store/services/segment";
import { useGetAllMapQuery as useGetAllBCQuery } from "@/store/services/fellowship";
import { useState } from "react";
import debounce from "lodash.debounce";
import useQueryParams from "@/hooks/user-query-params";
import { useSearchParams } from "next/navigation";
import { useDisclosure } from "@heroui/react";


export default function Dashboard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure({id: "create-data"});

  const [searchSegmentId, setSearchSegmentId] = useQueryParams({ key: "segment", value: null });
  const [searchSegment, setSearchSegment] = useState<string>("");
  const { data = [], isFetching } = useGetAllQuery({ name: searchSegment });
  
  const [searchBcId, setSearchBcId] = useQueryParams({ key: "blesscomn", value: null });
  const [searchBlesscomn, setSearchBlesscomn] = useState<string>("");
  const { data: dataBc = [], isFetching: isFetchingBc } = useGetAllBCQuery({ search: searchBlesscomn });

  const searchParams = useSearchParams();
  const [_, setSearchName] = useQueryParams({ key: "search", value: null });

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Hospitality Data</h1>
        <MyBreadcrum currentPath="list" />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button onPress={onOpen} startContent={<PlusIcon />} variant="solid" color="primary">
          New Data
        </Button>
        <Button as={'a'} startContent={<HeartPulse />} variant="solid" color="primary" href="/hospitality/report/list">
          Report
        </Button>
      </div>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <div className="flex lg:flex-row flex-col gap-4">
            <Input
              isClearable
              startContent={ <Search className="text-2xl text-default-400 pointer-events-none flex-shrink-0" /> }
              defaultValue={searchParams.get("search") ?? ""}
              onValueChange={debounce(setSearchName, 500)}
              placeholder="search..."
            />
            <Autocomplete
              selectedKey={searchSegmentId}
              isLoading={isFetching}
              defaultItems={data}
              className="lg:max-w-xs w-full"
              placeholder="Segment..."
              variant="flat"
              onInputChange={debounce(setSearchSegment, 500)}
              onSelectionChange={setSearchSegmentId}
            >
              {(item) => <AutocompleteItem key={item?.id}>{item?.label}</AutocompleteItem>}
            </Autocomplete>
            <Autocomplete
              selectedKey={searchBcId}
              isLoading={isFetchingBc}
              defaultItems={dataBc}
              className="lg:max-w-xs w-full"
              placeholder="Blesscomn..."
              variant="flat"
              onInputChange={debounce(setSearchBlesscomn, 500)}
              onSelectionChange={setSearchBcId}
            >
              {(item) => <AutocompleteItem key={item?.id}>{item?.name}</AutocompleteItem>}
            </Autocomplete>
          </div>
          <DataTable />
        </CardBody>
      </Card>

      <CreateFormDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
