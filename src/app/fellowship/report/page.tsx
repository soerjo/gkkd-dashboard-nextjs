'use client'

import { DataTable } from './_components/table'
import { useLazyGetAllChurchQuery } from '@/store/services/church'
import { useLazyGetAllQuery } from '@/store/services/fellowship'
import CustomSelect from '@/components/select';
import CustomSearchInput from '@/components/search';
import { Button } from '@/components/custom/button';
import { DownloadIcon, MessageCircleWarning, PlusIcon, UploadIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MyDrawer } from '@/components/my-drawer';
import { CreateForm } from './_components/form-create-member';
import MyBreadcrum from '@/components/my-breadcrum';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useLazyGetExportQuery, useLazyGetReminderQuery } from '../../../store/services/fellowship-report';
import { getErroMessage } from '../../../lib/rtk-error-validation';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver'
import { UploadWrapper } from './_components/upload';
import { UserPayload, UserRole } from '../../../interfaces/auth.interface';
import { AUTH_PAYLOAD, getAuthCookie } from '../../../lib/cookies';

export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [lazyFetchChurch] = useLazyGetAllChurchQuery();
  const [lazyFetchCommunity] = useLazyGetAllQuery();

  const cookiesPayload = getAuthCookie(AUTH_PAYLOAD);
  const userPayload: UserPayload = JSON.parse(cookiesPayload ?? "")


  const fetchChurch = async (query: string) => {
    try {
      const res = await lazyFetchChurch({ page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }

  const fetchCommunity = async (query: string) => {
    try {
      const res = await lazyFetchCommunity({ page: 1, search: query }).unwrap();
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



  return (
    <>
      <div className='flex flex-col '>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Fellowship Reports
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


      </div>
      <CustomSearchInput />
      <div className='flex lg:flex-row flex-col gap-4'>
        {[UserRole.SYSTEMADMIN, UserRole.SUPERADMIN].includes(userPayload.role as UserRole) && (
          <CustomSelect compName={'church'} fetchQuery={fetchChurch} />
        )}
        <CustomSelect compName={'community'} fetchQuery={fetchCommunity} />
        <DateRangePicker />
      </div>
      <DataTable />

    </>
  )
}