'use client'

import { DataTable } from './_components/table'
import { useLazyGetAllTableChurchQuery } from '@/store/services/church'
// import CustomSelect from '@/components/select';
// import CustomSearchInput from '@/components/search';
// import { Button } from '@/components/custom/button';
import { Button, Card, CardBody, DatePicker } from "@heroui/react";
import { Search, HeartPulse } from 'lucide-react';
// import { useMediaQuery } from '@/hooks/use-media-query';
// import { MyDrawer } from '@/components/my-drawer';
import { CreateForm } from './_components/form-create-member';
import MyBreadcrum from '@/components/my-breadcrum';
import { Autocomplete, AutocompleteItem, Input } from '@heroui/react';
import { HeroMyDrawer } from '@/components/hero-my-drawer';
import { useMediaQuery } from '@/hooks/use-media-query';


const animals = [
  {key: "youth", label: "youth"},
  {key: "witness", label: "witness"},
  {key: "arrow", label: "arrow"},
  {key: "family", label: "family"},
];


export default function Dashboard() { 
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [lazy] = useLazyGetAllTableChurchQuery();
  const fetch = async (query: string) => {
    try {
      const res = await lazy({ page: 1, search: query }).unwrap();
      return res.data.entities.map(data => ({ label: data.name, value: data }))
    } catch (error) {
      return []
    }
  }
  return (
    <>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Hospitality
        </h1>
        <MyBreadcrum currentPath='list' />
      </div>
      <div className='flex items-center justify-end gap-2'>
        <HeroMyDrawer DrawerForm={CreateForm} title="New Data"/>
        <Button isIconOnly={!isDesktop} startContent={<HeartPulse/>} variant='solid' color='primary'>{isDesktop && "Report"}</Button>
      </div>
      <Card>
      <CardBody className='flex flex-col gap-4'>
      <div className='flex lg:flex-row flex-col gap-4'>
        <Input
          endContent={ <Search className="text-2xl text-default-400 pointer-events-none flex-shrink-0" /> }
          placeholder="search..."
        />
        <Autocomplete
          className="lg:max-w-xs w-full"
          defaultItems={animals}
          placeholder="Segment..."
          variant='flat'
        >
          {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
        </Autocomplete>
      </div>
      <DataTable />

      </CardBody>
    </Card>


    </>
  )
}