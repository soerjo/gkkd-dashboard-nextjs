"use client";

import { DataTable } from "./_components/table";
import { Card, CardBody, DatePicker, Divider, Accordion, AccordionItem, Button } from "@heroui/react";
import { Search } from "lucide-react";
import MyBreadcrum from "@/components/my-breadcrum";
import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import useQueryParams from "@/hooks/user-query-params";
import { useState } from "react";
import { useGetAllQuery } from "@/store/services/segment";
import { useGetAllMapQuery as useGetAllBCQuery } from "@/store/services/fellowship";
import { useGetAllMapQuery as useGetAllSsQuery } from "@/store/services/cermon";
import { useGetReportQuery, useRegenerateMutation } from "@/store/services/hospitality-report";
import { useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";


export default function Dashboard() {
  const [searchSegmentId, setSearchSegmentId] = useQueryParams({ key: "segment", value: null });
  const [searchSegment, setSearchSegment] = useState<string>("");
  const { data = [], isFetching } = useGetAllQuery({ name: searchSegment });

  const [searchBcId, setSearchBcId] = useQueryParams({ key: "blesscomn", value: null });
  const [searchBlesscomn, setSearchBlesscomn] = useState<string>("");
  const { data: dataBc = [], isFetching: isFetchingBc } = useGetAllBCQuery({
    search: searchBlesscomn,
  });

  const [searchSsId, setSearchSsId] = useQueryParams({ key: "sunday_service", value: null });
  const [searchSs] = useState<string>("");
  const { data: dataSs = [], isFetching: isFetchingSs } = useGetAllSsQuery({ search: searchSs });

  const searchParams = useSearchParams();
  const [_, setSearchName] = useQueryParams({ key: "search", value: null });
  const [DateSs, setDateSs] = useQueryParams({
    key: "date",
    value: today(getLocalTimeZone()).toString(),
  });

  const { data: dataReport, isFetching: isFetchingReport } = useGetReportQuery({
    date: DateSs ?? today(getLocalTimeZone()).toString(),
    sunday_service_id: searchSsId,
  });

  const [regenerate, {isLoading: isLoadingRegenereate}] = useRegenerateMutation();
  const handleRegenerate = async () => {
    const sunday_service = Number(searchParams.get("sunday_service"));
    const date = searchParams.get("date");

    if(!sunday_service || !date) return;

    await regenerate({
      date: date,
      cermon_id: sunday_service,
    });
  }

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Hospitality</h1>
        <MyBreadcrum />
      </div>

      <div className="flex items-center justify-end gap-4">
        <Autocomplete
          selectedKey={searchSsId}
          isLoading={isFetchingSs}
          defaultItems={dataSs}
          className="lg:max-w-xs w-full"
          placeholder="Sunday Service..."
          variant="flat"
          // onInputChange={debounce(setSearchSs, 500)}
          onSelectionChange={setSearchSsId}
        >
          {(item) => <AutocompleteItem key={item?.id}>{item?.name}</AutocompleteItem>}
        </Autocomplete>
        <DatePicker
          hideTimeZone
          value={DateSs ? parseDate(DateSs) : today(getLocalTimeZone())}
          onChange={(date) => date && setDateSs(date.toString())}
          className="sm:max-w-xs w-full"
        />
      </div>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <div className="flex lg:flex-row flex-col-reverse justify-end items-end gap-4">
            <Input
              isClearable
              startContent={
                <Search className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              defaultValue={searchParams.get("search") ?? ""}
              onValueChange={debounce(setSearchName, 500)}
              placeholder="search..."
            />
            {/* <Autocomplete
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
            </Autocomplete> */}
          </div>
          <DataTable />
        </CardBody>
      </Card>
      <Button 
        isLoading={isLoadingRegenereate}
        onPress={handleRegenerate}
        fullWidth variant="flat" 
        color="primary"
      >
        Generate Report
      </Button>
      {
        dataReport?.sum && dataReport?.count && (
          <Accordion selectionMode="multiple" variant="shadow" isCompact>
            <AccordionItem key={1} aria-label="segment" title={"Details Segment"}>
              <div className="flex flex-col gap-2">
                <div
                  
                  className="flex flex-col justify-center items-start px-4 py-2 bg-default-100 rounded-lg w-full"
                >
                {dataReport?.sum &&
                  dataReport.sum.map((item) => (
                      <p key={item.id} className=" uppercase text-small">
                        {item.alias} : {item.count}
                      </p>
                  ))}
                  </div>
              </div>
            </AccordionItem>

            <AccordionItem key={2} aria-label="segment" title={"Details Total"}>
              <div className="flex flex-col gap-2">
                {dataReport?.count &&
                  (
                    <div className="flex flex-col justify-center items-start px-4 py-2 bg-default-100 rounded-lg w-full">
                      <p className="text-small"> Total Laki-laki : {dataReport.count.total_male} </p>
                      <p className="text-small"> Total Laki-laki Baru : {dataReport.count.total_new_male} </p>
                      <p className="text-small"> Total Perempuan : {dataReport.count.total_female} </p>
                      <p className="text-small mb-1"> Total Perempuan Baru: {dataReport.count.total_new_female} </p>
                      <Divider />
                      <p className="text-small mt-1"> Total : {dataReport.count.total} </p>
                    </div>
                  )
                }
              </div>
            </AccordionItem>
          </Accordion>
        )
      } 
    </>
  );
}
