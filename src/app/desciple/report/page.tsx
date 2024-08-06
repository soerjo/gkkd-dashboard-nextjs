'use client'

import { DataTable } from './_components/table'
import CustomSelect from '@/components/select';
import CustomSearchInput from '@/components/search';
import { Button } from '@/components/custom/button';
import { DownloadIcon, PlusIcon, UploadIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MyDrawer } from '@/components/my-drawer';
import { CreateForm } from './_components/form-create-member';
import MyBreadcrum from '@/components/my-breadcrum';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useLazyGetAllTableChurchQuery } from '@/store/services/church'
import { useLazyGetAllListQuery } from '@/store/services/disciples';
import { useLazyGetExportQuery } from '../../../store/services/disciples-report';
import React from 'react';
import { toast } from "react-toastify";
import { getErroMessage } from '../../../lib/rtk-error-validation';


export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [lazyRegion] = useLazyGetAllTableChurchQuery();
  const fetchRegion = async (query: string) => {
    try {
      const res = await lazyRegion({ page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }

  const [lazyParent,] = useLazyGetAllListQuery();
  const fetchParent = async (query: string) => {
    try {
      const res = await lazyParent({ page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data.nim }))
    } catch (error) {
      return []
    }
  }

  const [fetchExport] = useLazyGetExportQuery()
  const handleExport = async () => {
    try {
      const data = await fetchExport({}).unwrap()
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.xlsx');  // Set the desired file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      const errorMessage = getErroMessage(error);
      toast.error(JSON.stringify(errorMessage));
    }
  }

  return (
    <>
      <div className='flex flex-col '>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Discipleship Reports
        </h1>
        <MyBreadcrum currentPath='data' />
      </div>

      <div className="flex items-center gap-2 justify-end">
        <MyDrawer DrawerForm={CreateForm}>
          <Button variant="outline" size="sm" className="flex gap-2">
            <PlusIcon className="size-4" aria-hidden="true" />
            {isDesktop && "New Report"}
          </Button>
        </MyDrawer>

        <Button variant="outline" size="sm" className="flex gap-2" onClick={handleExport}>
          <DownloadIcon className="size-4" aria-hidden="true" />
          {isDesktop && "Export"}
        </Button>

        <Button variant="outline" size="sm" className="flex gap-2">
          <UploadIcon className="size-4" aria-hidden="true" />
          {isDesktop && "Import"}
        </Button>

      </div>
      <CustomSearchInput />
      <div className='flex lg:flex-row flex-col gap-4'>
        <CustomSelect compName={'pembimbing'} fetchQuery={fetchParent} />
        <CustomSelect compName={'church'} fetchQuery={fetchRegion} />
        <DateRangePicker />
      </div>
      <DataTable />

    </>
  )
}