"use client";

import { DataTable } from "./_components/table";
import { useLazyGetAllTableChurchQuery } from "@/store/services/church";
// import CustomSelect from '@/components/select';
// import CustomSearchInput from '@/components/search';
// import { Button } from '@/components/custom/button';
import { Card, CardBody, DatePicker, CardHeader, Divider, Button } from "@heroui/react";
import { Plus, Search } from "lucide-react";
// import { useMediaQuery } from '@/hooks/use-media-query';
// import { MyDrawer } from '@/components/my-drawer';
import { CreateForm } from "./_components/form-create-member";
import MyBreadcrum from "@/components/my-breadcrum";
import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { HeroMyDrawer } from "@/components/hero-my-drawer";
import { CustomAutoComplete } from "@/components/custom-auto-complete";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useMediaQuery } from "@/hooks/use-media-query";

const animals = [
  { key: "youth", label: "youth" },
  { key: "witness", label: "witness" },
  { key: "arrow", label: "arrow" },
  { key: "family", label: "family" },
];

const sundayServiceList = [
  { key: "umum", label: "umum" },
  { key: "way-ex", label: "way-ex" },
  { key: "arrow", label: "arrow" },
];

export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [lazy] = useLazyGetAllTableChurchQuery();
  const fetch = async (query: string) => {
    try {
      const res = await lazy({ page: 1, search: query }).unwrap();
      return res.data.entities.map((data) => ({ label: data.name, value: data }));
    } catch (error) {
      return [];
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Hospitality</h1>
        <MyBreadcrum currentPath="list" />
      </div>

      {!isDesktop && (
        <Card>
          <CardBody className="flex flex-row gap-4 justify-between items-center p-4">
            <div className="flex flex-col gap-2w-fit justify-center items-center">
              <p className="font-bold">Family</p>
              <p>{33}</p>
            </div>
            <div className="flex flex-col gap-2w-fit justify-center items-center">
              <p className="font-bold">Arrow</p>
              <p>{44}</p>
            </div>
            <div className="flex flex-col gap-2w-fit justify-center items-center">
              <p className="font-bold">Youth</p>
              <p>{13}</p>
            </div>
            <div className="flex flex-col gap-2w-fit justify-center items-center">
              <p className="font-bold">Witness</p>
              <p>{21}</p>
            </div>
            <div className="flex flex-col gap-2w-fit justify-center items-center">
              <p className="font-bold">Excelent</p>
              <p>{39}</p>
            </div>
          </CardBody>
        </Card>
      )}

      {isDesktop && (
        <div className="flex flex-row gap-4">
          <Card className="w-full" shadow="sm">
            <CardBody className="flex flex-col gap-2 p-4">
              <div className="font-bold">Family</div>
              <p className="text-3xl">{10}</p>
            </CardBody>
          </Card>
          <Card className="w-full" shadow="sm">
            <CardBody className="flex flex-col gap-2 p-4">
              <div className="font-bold">Arrow</div>
              <p className="text-3xl">{50}</p>
            </CardBody>
          </Card>
          <Card className="w-full" shadow="sm">
            <CardBody className="flex flex-col gap-2 p-4">
              <div className="font-bold">Youth</div>
              <p className="text-3xl">{15}</p>
            </CardBody>
          </Card>
          <Card className="w-full" shadow="sm">
            <CardBody className="flex flex-col gap-2 p-4">
              <div className="font-bold">Witness</div>
              <p className="text-3xl">{23}</p>
            </CardBody>
          </Card>
          <Card className="w-full" shadow="sm">
            <CardBody className="flex flex-col gap-2 p-4">
              <div className="font-bold">Excelent</div>
              <p className="text-3xl">{22}</p>
            </CardBody>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-end gap-4">
        <Autocomplete
          className="sm:max-w-xs w-full"
          defaultItems={sundayServiceList}
          placeholder="Sunday Service..."
          variant="flat"
          isClearable
        >
          {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
        </Autocomplete>

        <DatePicker
          hideTimeZone
          defaultValue={today(getLocalTimeZone())}
          className="sm:max-w-xs w-full"
        />
      </div>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <div className="flex lg:flex-row flex-col-reverse justify-end items-end gap-4">
            <CustomAutoComplete />
            <div className="flex gap-4 flex-row w-full md:w-3/5">
              <Autocomplete
                className="w-full"
                defaultItems={animals}
                placeholder="Segment..."
                variant="flat"
              >
                {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
              </Autocomplete>
              <Button
                isIconOnly
                startContent={<Plus />}
                variant="flat"
                color="primary"
                title="add new"
              />
            </div>
          </div>

          <DataTable />
        </CardBody>
      </Card>
    </div>
  );
}
