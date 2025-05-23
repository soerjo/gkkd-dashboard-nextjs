import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { toast } from "react-toastify";
import { useCreateMutation } from "@/store/services/hospitality-data";
import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import { useGetAllMapQuery as useGetAllBCQuery } from "@/store/services/fellowship";
import { useGetAllQuery as useGetAllSegQuery } from "@/store/services/segment";

import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/react";
import { ICreateHospitalityData } from "@/interfaces/hospitalityData.interface";
import debounce from "lodash.debounce";

const FormSchema = z.object({
  name: z.string().min(1, { message: "required" }).max(100),
  alias: z.string({ message: "" }).optional(),
  gender: z.string({ message: "is required" }).min(1, { message: "required" }).max(100),
  segment_id: z
    .number()
    .min(1, { message: "required" })
    .transform((val) => Number(val)),
  blesscomn_id: z
    .number()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
});

type FormCreateDataProps = {
  onClose: () => void
}
const FormCreateData = ({onClose}: FormCreateDataProps) => {
  const [searchBlesscomn, setSearchBlesscomn] = useState<string>("");
  const { data: dataBc = [], isFetching: isFetchingBc } = useGetAllBCQuery({
    search: searchBlesscomn,
  });

  const [searchSegment, setSearchSegment] = useState<string>("");
  const { data: dataSeg = [], isFetching: isFetchingSeg } = useGetAllSegQuery({
    name: searchSegment,
  });

  const form = useForm<ICreateHospitalityData>({ resolver: zodResolver(FormSchema) });
  const { formState: { isSubmitting, errors } } = form;

  const [createData] = useCreateMutation();

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await createData(values).unwrap();
      form.reset();
      onClose();

      toast.success("create data success!");
    } catch (error) {
      const errorMessage = getErroMessage(error);
      toast.error(JSON.stringify(errorMessage));
    }
  };

  return (
    <>
      <DrawerHeader className="flex flex-col gap-1">Input New Data</DrawerHeader>
      <DrawerBody>
        <form
          id="new-hospital-data"
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Input
            isRequired
            variant="faded"
            label="Name"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            {...form.register("name")}
          />
          <Input
            variant="faded"
            label="Alias"
            isInvalid={!!errors.alias}
            errorMessage={errors.alias?.message}
            {...form.register("alias")}
          />
          <Autocomplete
            isRequired
            label="Gender"
            variant="faded"
            inputMode="search"
            isInvalid={!!errors.gender}
            errorMessage={errors.gender?.message}
            onSelectionChange={(value) => {
              form.setValue("gender", value as any, { shouldValidate: true });
            }}
          >
            <AutocompleteItem key={"laki-laki"}>{"Laki-laki"}</AutocompleteItem>
            <AutocompleteItem key={"perempuan"}>{"Perempuan"}</AutocompleteItem>
          </Autocomplete>
          <Autocomplete
            isRequired
            label="Segment"
            variant="faded"
            inputMode="search"
            isLoading={isFetchingSeg}
            defaultItems={dataSeg}
            isInvalid={!!errors.segment_id}
            errorMessage={errors.segment_id?.message}
            onInputChange={debounce(setSearchSegment, 500)}
            onSelectionChange={(value) => {
              form.setValue("segment_id", Number(value), { shouldValidate: true });
            }}
          >
            {(item) => <AutocompleteItem key={item?.id}>{item?.label}</AutocompleteItem>}
          </Autocomplete>
          <Autocomplete
            label="Blesscomn"
            variant="faded"
            inputMode="search"
            isLoading={isFetchingBc}
            defaultItems={dataBc}
            isInvalid={!!errors.blesscomn_id}
            errorMessage={errors.blesscomn_id?.message}
            onInputChange={debounce(setSearchBlesscomn, 500)}
            onSelectionChange={(value) => {
              form.setValue("blesscomn_id", Number(value), { shouldValidate: true });
            }}
          >
            {(item) => <AutocompleteItem key={item?.id}>{item?.name}</AutocompleteItem>}
          </Autocomplete>
        </form>
      </DrawerBody>
      <DrawerFooter className="flex flex-col gap-2 w-full">
        <Button
          color="primary"
          isLoading={isSubmitting}
          variant="solid"
          type="submit"
          form="new-hospital-data"
        >
          Submit
        </Button>
      </DrawerFooter>
    </>
  );
}

export type CreateFormProps = React.ComponentProps<"form"> & {
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

export const CreateFormDrawer = ({ onOpenChange, isOpen }: CreateFormProps) => {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <DrawerContent>
        {(onClose) => (<FormCreateData onClose={onClose}/>)}
        
      </DrawerContent>
    </Drawer>
  );
};
