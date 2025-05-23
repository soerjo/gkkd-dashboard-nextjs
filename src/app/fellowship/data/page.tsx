'use client'

import { DataTable } from './_components/table'
import { useLazyGetAllChurchQuery } from '@/store/services/church'
import CustomSelect from '@/components/select';
import CustomSearchInput from '@/components/search';
import { Button } from '@/components/custom/button';
import { DownloadIcon, PlusIcon, UploadIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MyDrawer } from '@/components/my-drawer';
import { CreateForm } from './_components/form-create-member';
import MyBreadcrum from '@/components/my-breadcrum';
import { AUTH_PAYLOAD, getAuthCookie } from '../../../lib/cookies';
import { UserPayload, UserRole } from '../../../interfaces/auth.interface';
import { useLazyGetExportQuery } from '../../../store/services/fellowship-report';
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

  const cookiesPayload = getAuthCookie(AUTH_PAYLOAD);
  const userPayload: UserPayload = JSON.parse(cookiesPayload ?? "")

  const [fetchExport] = useLazyGetExportQuery()
  const handleExport = async () => {
    console.log('run export!s')
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
          Fellowship
        </h1>
        <MyBreadcrum currentPath='list' />
      </div>

      <div className="flex items-center gap-2 justify-end">
        {[UserRole.SYSTEMADMIN, UserRole.SUPERADMIN, UserRole.LEADER].includes(userPayload.role as UserRole) &&
          <MyDrawer DrawerForm={CreateForm}>
            <Button variant="outline" size="sm" className="flex gap-2">
              <PlusIcon className="size-4" aria-hidden="true" />
              {isDesktop && "New Community"}
            </Button>
          </MyDrawer>
        }

        {/* <Button variant="outline" size="sm" className="flex gap-2" onClick={handleExport}>
          <DownloadIcon className="size-4" aria-hidden="true" />
          {isDesktop && "Export"}
        </Button>
        <Button variant="outline" size="sm" className="flex gap-2">
          <UploadIcon className="size-4" aria-hidden="true" />
          {isDesktop && "Import"}
        </Button> */}
      </div>
      <div className='flex lg:flex-row flex-col gap-4'>
        <CustomSearchInput />
        {[UserRole.SYSTEMADMIN, UserRole.SUPERADMIN].includes(userPayload.role as UserRole) && (
          <CustomSelect compName={'church'} fetchQuery={fetch} />
        )}

        {/* <DateRangePicker /> */}
      </div>
      <DataTable />

    </>
  )
}