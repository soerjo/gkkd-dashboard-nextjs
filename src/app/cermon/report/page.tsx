'use client'

import { DataTable } from './_components/table'
import { DownloadIcon, FolderSync, PlusIcon, Search } from 'lucide-react';
import MyBreadcrum from '@/components/my-breadcrum';
import { Card, CardBody, Button,Autocomplete, AutocompleteItem, Input, DateRangePicker, useDisclosure } from "@heroui/react";
import { useLazyGetAllQuery, useGetAllMapQuery as useGetAllSsQuery } from '@/store/services/cermon';
import { useLazyGetExportQuery, useSyncAllMutation } from '../../../store/services/cermon-report';
import { saveAs } from 'file-saver'
import { getErroMessage } from '../../../lib/rtk-error-validation';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import useQueryParams, { useQueryRangeParams } from '@/hooks/user-query-params';
import debounce from 'lodash.debounce';
import { useState } from 'react';
import { getLocalTimeZone, parseAbsoluteToLocal, today } from '@internationalized/date';
import { CreateFormDrawer } from './_components/form-create-member';

export default function Dashboard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure({id: "create-data"});

  // const [lazy] = useLazyGetAllChurchQuery();
  // const fetch = async (query: string) => {
  //   try {
  //     const res = await lazy({ page: 1, search: query }).unwrap();
  //     return res.data.entities.map(data => ({ label: data.name, value: data }))
  //   } catch (error) {
  //     return []
  //   }
  // }

  // const [fetchReminder] = useLazyGetReminderQuery()
  // const handleFetchReminder = async () => {
  //   try {
  //     await fetchReminder({}).unwrap()
  //     toast.success('reminder has been sended')
  //   } catch (error) {
  //     console.log({ error })
  //     const errorMessage = getErroMessage(error);
  //     toast.error(JSON.stringify(errorMessage));
  //   }
  // }

  const [fetchCermon] = useLazyGetAllQuery()
  // const fetchCermonList = async (query: string) => {
  //   try {
  //     const res = await fetchCermon({ page: 1, search: query }).unwrap();
  //     return res.data.entities.map(data => ({ label: data.name, value: data }))
  //   } catch (error) {
  //     return []
  //   }
  // }

  const [fetchExport] = useLazyGetExportQuery()
  const handleExport = async () => {
    try {
      const data = await fetchExport({}).unwrap()
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = 'report.xlsx';
      saveAs(blob, fileName);

    } catch (error) {
      console.log({ error })
      const errorMessage = getErroMessage(error);
      toast.error(JSON.stringify(errorMessage));
    }
  }

  const [fetchSync, {isLoading: isSyncLoading}] = useSyncAllMutation();
  const handleSync = async () => {
    try {
      await fetchSync({}).unwrap()
      toast.success('reminder has been sended')
    } catch (error) {
      const errorMessage = getErroMessage(error);
      toast.error(JSON.stringify(errorMessage));
    }
  }

  const [searchSsId, setSearchSsId] = useQueryParams({ key: "sunday_service", value: null });
  const [searchSs] = useState<string>("");
  const { data: dataSs = [], isFetching: isFetchingSs } = useGetAllSsQuery({ search: searchSs });

  const searchParams = useSearchParams();
  const [_, setSearchName] = useQueryParams({ key: "search", value: null });

  const [dateRange, setDateRange] = useQueryRangeParams({ key: ["date_from", "date_to"], value: {
    date_from: today(getLocalTimeZone()).toString(),
    date_to: today(getLocalTimeZone()).toString(),
  } });
  // const [dateTo, setdateTo] = useQueryParams({ key: "date_to", value: null });


  return (
    <>
      <div className='flex flex-col '>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Cermon Reports
        </h1>
        <MyBreadcrum currentPath='data' />
      </div>

      <div className="flex items-center gap-2 justify-end">
        <Button 
          onPress={onOpen} 
          variant="solid" 
          color="primary"
          startContent={<PlusIcon />} 
        >
          New Data
        </Button>

        <Button 
          onPress={handleExport}
          startContent={<DownloadIcon/>}
          variant="solid" 
          color="primary"
        > 
          {"Export"}
        </Button>

        <Button 
          disabled={isSyncLoading} 
          onPress={handleSync}
          startContent={<FolderSync/>}
          variant="solid" 
          color="primary"
        >
          {"Sync"}
        </Button>

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

            <DateRangePicker 
              labelPlacement='outside'
              className="lg:max-w-xs w-full"
              granularity="day"
              value={{
                start: parseAbsoluteToLocal(dateRange.date_from ? new Date(dateRange.date_from).toISOString() : new Date().toISOString()),
                end: parseAbsoluteToLocal(dateRange.date_to ? new Date(dateRange.date_to).toISOString() : new Date().toISOString()),
              }}
              onChange={value=> {
                setDateRange({
                  date_from: value?.start?.toString().split('T')[0] ?? "",
                  date_to: value?.end?.toString().split('T')[0] ?? ""
                });
              }}
            />
          </div>
          <DataTable />
        </CardBody>
      </Card>

      <CreateFormDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />

    </>
  )
}