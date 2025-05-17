'use client'

import { DataTable } from './_components/table'
import { useLazyGetAllTableChurchQuery } from '@/store/services/church'
import { CreateFormDrawer } from './_components/form-create-member';
import MyBreadcrum from '@/components/my-breadcrum';
import { Input, useDisclosure } from "@heroui/react";
import { Button, Card, CardBody } from "@heroui/react";
import { Search, PlusIcon } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import useQueryParams from '@/hooks/user-query-params';
import debounce from 'lodash.debounce';

export default function Dashboard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure({id: "create-data"});
  const [lazy] = useLazyGetAllTableChurchQuery();
  // const fetch = async (query: string) => {
  //   try {
  //     const res = await lazy({ page: 1, search: query }).unwrap();
  //     return res.data.entities.map(data => ({ label: data.name, value: data }))
  //   } catch (error) {
  //     return []
  //   }
  // }

  const searchParams = useSearchParams();
  const [_, setSearchName] = useQueryParams({ key: "search", value: null });
  return (
    <>
      <div className='flex flex-col '>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Cermons
        </h1>
        <MyBreadcrum currentPath='list' />
      </div>

      <div className="flex items-center gap-2 justify-end">
        <Button onPress={onOpen} startContent={<PlusIcon />} variant="solid" color="primary">
          New Data
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