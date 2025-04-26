'use client'

import { DataTable } from './_components/table'
import { useLazyGetAllChurchQuery } from '@/store/services/church'
import CustomSelect from '@/components/select';
import CustomSearchInput from '@/components/search';
import { Button } from '@/components/custom/button';
import { DownloadIcon, PlusIcon, UploadIcon, MessageCircleWarning, FolderSync } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MyDrawer } from '@/components/my-drawer';
import { CreateForm } from './_components/form-create-member';
import MyBreadcrum from '@/components/my-breadcrum';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { UploadWrapper } from './_components/upload';
import { useLazyGetAllQuery } from '../../../store/services/cermon';
import { useLazyGetExportQuery, useLazyGetReminderQuery, useGetSyncAllMutation } from '../../../store/services/cermon-report';
import { saveAs } from 'file-saver'
import { getErroMessage } from '../../../lib/rtk-error-validation';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [lazy] = useLazyGetAllChurchQuery();
  const fetch = async (query: string) => {
    try {
      const res = await lazy({ page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }

  const [fetchReminder] = useLazyGetReminderQuery()
  const handleFetchReminder = async () => {
    try {
      await fetchReminder({}).unwrap()
      toast.success('reminder has been sended')
    } catch (error) {
      console.log({ error })
      const errorMessage = getErroMessage(error);
      toast.error(JSON.stringify(errorMessage));
    }
  }

  const [fetchCermon] = useLazyGetAllQuery()
  const fetchCermonList = async (query: string) => {
    try {
      const res = await fetchCermon({ page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }

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

  const [fetchSync, {isLoading: isSyncLoading}] = useGetSyncAllMutation();
  const handleSync = async () => {
    try {
      await fetchSync({}).unwrap()
      toast.success('reminder has been sended')
    } catch (error) {
      console.log({ error })
      const errorMessage = getErroMessage(error);
      toast.error(JSON.stringify(errorMessage));
    }
  }



  return (
    <>
      <div className='flex flex-col '>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Cermon Reports
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

        <UploadWrapper>
          <Button variant="outline" size="sm" className="flex gap-2">
            <UploadIcon className="size-4" aria-hidden="true" />
            {isDesktop && "Import"}
          </Button>
        </UploadWrapper>

        <Button variant="outline" size="sm" className="flex gap-2" onClick={handleFetchReminder}>
          <MessageCircleWarning className="size-4" aria-hidden="true" />
          {isDesktop && "Reminder"}
        </Button>

        <Button disabled={isSyncLoading} variant="outline" size="sm" className="flex gap-2" onClick={handleSync}>
          <FolderSync className="size-4" aria-hidden="true" />
          {isDesktop && "Sync"}
        </Button>


      </div>
      <CustomSearchInput />
      <div className='flex lg:flex-row flex-col gap-4'>
        <CustomSelect compName={'church'} fetchQuery={fetch} />
        <CustomSelect compName={'cermon'} fetchQuery={fetchCermonList} />
        <DateRangePicker />
      </div>
      <DataTable />

    </>
  )
}