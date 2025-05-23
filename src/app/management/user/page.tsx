'use client'

import { DataTable } from './_components/table'
import { useLazyGetAllTableChurchQuery } from '@/store/services/church'
import CustomSelect from '@/components/select';
import CustomSearchInput from '@/components/search';
import { Button } from '@/components/custom/button';
import { DownloadIcon, PlusIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MyDrawer } from '@/components/my-drawer';
import { CreateForm } from './_components/form-create-member';
import MyBreadcrum from '@/components/my-breadcrum';
import { UserRole } from '../../../interfaces/auth.interface';
import { useLazyGetParamsQuery } from '../../../store/services/params';
import { getErroMessage } from '../../../lib/rtk-error-validation';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [fetchChurch] = useLazyGetAllTableChurchQuery();

  const fetch = async (query: string) => {
    try {
      const res = await fetchChurch({ take: 100, page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }


  const fetchRole = async (query: string) => {
    try {
      const res = {
        data: {
          entities: Object.entries(UserRole).map(data => ({ name: data[1], id: data[1] }))
        }
      }
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }

  const [getParams] = useLazyGetParamsQuery();
  const promiseRoleOptions = async (inputValue: string) => {
    try {
      const listRole = await getParams({ param: "role" }).unwrap();
      return listRole.data.map(val => ({ value: val.name, label: val.name }));
    } catch (error) {
      const errorMessage = getErroMessage(error);
      toast.error(JSON.stringify(errorMessage));
      return [];
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col '>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          User
        </h1>
        <MyBreadcrum currentPath='list' />
      </div>

      <div className="flex items-center gap-2 justify-end">
        <MyDrawer DrawerForm={CreateForm}>
          <Button variant="outline" size="sm" className="flex gap-2">
            <PlusIcon className="size-4" aria-hidden="true" />
            {isDesktop && "New User"}
          </Button>
        </MyDrawer>

        <Button variant="outline" size="sm" className="flex gap-2">
          <DownloadIcon className="size-4" aria-hidden="true" />
          {isDesktop && "Export"}
        </Button>
      </div>
      <div className='flex lg:flex-row flex-col gap-4'>
        <CustomSearchInput />
        <CustomSelect compName={'church'} fetchQuery={fetch} />
        <CustomSelect compName={'role'} fetchQuery={promiseRoleOptions} />
        {/* <DateRangePicker /> */}
      </div>
      <DataTable />

    </div>
  )
}