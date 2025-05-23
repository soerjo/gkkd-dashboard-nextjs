'use client'

import { useMediaQuery } from "@/hooks/use-media-query";

import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea"
import { getErroMessage } from "@/lib/rtk-error-validation";
import { Member, UpdateMember } from "@/interfaces/memberResponse";
import { useGetMemberByIdQuery, useUpdateMemberMutation } from "@/store/services/member";
import { CalendarIcon, X } from "lucide-react";
import { CalendarComponent } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/custom/button";
import { toast } from "react-toastify";
import { useLazyGetAllChurchQuery } from "@/store/services/church";
import debounce from "lodash.debounce";
import AsyncSelect from "@/components/react-select";
import { PopoverClose } from "@radix-ui/react-popover";

const defaultCreateMemberForm: UpdateMember & { region: any } = {
    id: 0,
    nij: "",
    full_name: "",
    name: "",
    email: "",
    gender: "",
    place_birthday: "",
    date_birthday: new Date(),
    phone_number: "",
    address: "",
    father_name: "",
    mother_name: "",
    birth_order: 0,
    total_brother_sister: 0,
    marital_status: false,
    husband_wife_name: "",
    wedding_date: new Date(),
    // total_son_daughter: null,
    // son_daughter_name: null,
    // baptism_date: null,
    region_id: 1,
    region: { label: "", value: {} }
}

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const RegionSchema = z.object({
    label: z.string(),
    value: z.any(),
}).nullable().optional()

const FormSchema = z
    .object({
        id: z.number(),
        nij: z.string().min(1, { message: "required" }).max(25),
        full_name: z.string().min(1, { message: "required" }).max(25),
        name: z.string().min(1, { message: "required" }).max(25),
        email: z.string().min(1, { message: "required" }).max(25).email(),
        gender: z.string().min(1, { message: "required" }).max(25),
        place_birthday: z.string().min(1, { message: "required" }).max(25),
        date_birthday: z.coerce.date(),
        phone_number: z.string().regex(phoneRegex, 'Invalid Number!'),
        address: z.string().max(250).optional(),
        father_name: z.string().max(25).optional(),
        mother_name: z.string().max(25).optional(),
        birth_order: z.number().nullable().optional(),
        total_brother_sister: z.number().nullable().optional(),
        marital_status: z.boolean().optional(),
        husband_wife_name: z.string().max(25).optional(),
        wedding_date: z.coerce.date().optional(),
        // total_son_daughter: z.number().min(0).optional(),
        // son_daughter_name: z.string().max(25).optional(),
        // baptism_date: z.date().optional(),
        region_id: z.number().min(0).optional(),
        region: RegionSchema
    })

export type UpdateFormInputProps = React.ComponentProps<"form"> & { onOpenChange: React.Dispatch<React.SetStateAction<boolean>>, data: Member }

export const UpdateFormInput = ({ onOpenChange, data }: UpdateFormInputProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [updateData] = useUpdateMemberMutation();
    const { isLoading, data: payload } = useGetMemberByIdQuery({ nij: data.nij }, { refetchOnMountOrArgChange: true });

    const form = useForm<UpdateMember & { region: any }>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultCreateMemberForm,
    });

    const { formState: { isSubmitting, isDirty }, reset } = form;

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            const createUserBody: UpdateMember = {
                ...values,
                id: data.id,
                region_id: values.region?.value.id,
                total_brother_sister: values.total_brother_sister ?? 0,
                birth_order: values.birth_order ?? 1,

            }
            await updateData(createUserBody).unwrap();

            toast.success('update data success!')
            onOpenChange(val => !val);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    };

    const [lazy] = useLazyGetAllChurchQuery();
    const _loadSuggestions = async (query: string, callback: (...arg: any) => any) => {
        try {
            const res = await lazy({ page: 1, search: query }).unwrap();
            const resp = res.data.entities.map(data => ({ label: data.name, value: data }))
            console.log({ resp })
            return callback(resp)
        } catch (error) {
            return []
        }
    };
    const loadOptions = debounce(_loadSuggestions, 300);


    useEffect(() => {
        reset({
            id: payload?.data.id ?? 0,
            nij: payload?.data?.nij ?? "",
            full_name: payload?.data.full_name ?? "",
            name: payload?.data.name ?? "",
            email: payload?.data.email ?? "",
            gender: payload?.data.gender ?? "",
            place_birthday: payload?.data.place_birthday ?? "",
            date_birthday: payload?.data.date_birthday ?? new Date(),
            phone_number: payload?.data.phone_number ?? "",
            address: payload?.data.phone_number ?? "",
            father_name: payload?.data.father_name ?? "",
            mother_name: payload?.data.mother_name ?? "",
            birth_order: payload?.data.birth_order ?? 1,
            total_brother_sister: payload?.data.total_brother_sister ?? 1,
            marital_status: payload?.data.marital_status ?? false,
            husband_wife_name: payload?.data.email ?? "",
            wedding_date: payload?.data.wedding_date ?? new Date(),
            // total_son_daughter: payload?.data?.total_son_daughter ?? "",
            // son_daughter_name: payload?.data?.son_daughter_name ?? "",
            // baptism_date: payload?.data.email ?? "",
            region_id: payload?.data.region_id ?? 1,
            region: {
                label: payload?.data?.region?.name ?? "",
                value: payload?.data?.region
            }

        })
    }, [payload])

    if (isLoading)
        return (
            <div className={`flex justify-center items-center h-[85vh]`} >
                <Spinner size="large">
                    <span>Loading page...</span>
                </Spinner>
            </div>
        );


    return (
        <div className={`flex flex-col h-[85vh] gap-4`} >
            <div className="flex flex-col w-full h-1/6 gap-3 justify-center items-center">
                <h2 className="text-xl font-semibold tracking-tight md:text-xl">
                    Update Member
                </h2>
                <div className="h-14 w-14">
                    <svg
                        viewBox="0 0 177 180"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-all w-auto`}
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M75.7157 80.5704H49.4655L49.4685 80.5762L0 157.714H12.1155L54.9137 90.9774L63.5368 107.449L31.3026 157.713H43.4181L68.9819 117.85L77.1481 133.449L61.5877 157.713H73.7031L82.5932 143.851L89.8504 157.713H116.101L97.0456 121.314L99.2696 117.846L120.14 157.713H146.39L113.722 95.3103L115.946 91.8422L150.43 157.713H176.68L136.295 80.5704H123.175H111.059H110.045L110.501 81.4409L108.277 84.909L106.006 80.5704H92.8896H80.7741H79.7553L80.2132 81.445L77.9892 84.9131L75.7157 80.5704ZM85.6584 91.8463L93.8245 107.445L91.6004 110.913L83.4343 95.3143L85.6584 91.8463Z"
                            fill="currentColor"
                        />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M109.043 0L109.043 35.604H157.507V73.1864H109.043V76.9236H96.8583V61.25H145.322V47.5403L96.8583 47.5403V11.9363H80.8436L80.8436 47.5403L30.3638 47.5403V61.25H80.8436V76.9236H68.6585V73.1864H18.1787V35.604L68.6585 35.604L68.6585 0H109.043ZM68.6585 161.375L68.6585 180H109.043V161.375H96.8583V168.064H80.8436V161.375H68.6585Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
            </div>
            <div className="z-50">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col mb-6 gap-6"
                    >
                        <ScrollArea className="h-[60vh]">
                            <div className="flex flex-col gap-4" >
                                <FormField
                                    control={form.control}
                                    name={"nij"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"nij".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"nij"}
                                                    placeholder={"nij"}
                                                    disabled
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"full_name"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"full_name".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"full_name"}
                                                    placeholder={"full_name"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"name"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"name".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"name"}
                                                    placeholder={"name"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"email"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"email".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    id={"email"}
                                                    placeholder={"email"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"gender"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"gender".replaceAll("_", " ")}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={payload?.data.gender}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={"gender"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="laki-laki">laki-laki</SelectItem>
                                                    <SelectItem value="perempuan">perempuan</SelectItem>
                                                </SelectContent>
                                            </Select>{" "}
                                            <FormMessage />
                                        </FormItem>
                                    )
                                    }
                                />

                                <FormField
                                    control={form.control}
                                    name={"place_birthday"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"place_birthday".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"place_birthday"}
                                                    placeholder={"place_birthday"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"date_birthday"}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="capitalize">{"date_birthday".replaceAll("_", " ")}</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')} variant="outline">
                                                            {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-auto p-2">
                                                    <div className="flex m-1">
                                                        <div className="flex-1"></div>
                                                        <PopoverClose className="mb-2">
                                                            <X size={24} className="text-primary/60 hover:text-destructive" />
                                                        </PopoverClose>
                                                    </div>
                                                    <CalendarComponent initialFocus mode="single" selected={field.value ?? undefined} translate="en" onSelect={field.onChange} />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"phone_number"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"phone_number".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"phone_number"}
                                                    placeholder={"phone_number"}
                                                    pattern="[0-9]*"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"address"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"address".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us a little bit about yourself"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"father_name"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"father_name".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"father_name"}
                                                    placeholder={"father_name"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"mother_name"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"mother_name".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"mother_name"}
                                                    placeholder={"mother_name"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name={"birth_order"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"birth_order".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"birth_order"}
                                                    placeholder={"birth_order"}
                                                    pattern="[0-9]*"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name={"total_brother_sister"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"total_brother_sister".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"total_brother_sister"}
                                                    pattern="[0-9]*"

                                                    placeholder={"total_brother_sister"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />



                                <FormField
                                    control={form.control}
                                    name={"marital_status"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"marital_status".replaceAll("_", " ")}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field?.value ? "true" : "false"}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a verified email to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={"true"}>sudah menikah</SelectItem>
                                                    <SelectItem value={"false"}>belum menikah</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"husband_wife_name"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"husband_wife_name".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"husband_wife_name"}
                                                    placeholder={"husband_wife_name"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name={"wedding_date"}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="capitalize">{"wedding_date".replaceAll("_", " ")}</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')} variant="outline">
                                                            {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-auto p-2">
                                                    <div className="flex m-1">
                                                        <div className="flex-1"></div>
                                                        <PopoverClose className="mb-2">
                                                            <X size={24} className="text-primary/60 hover:text-destructive" />
                                                        </PopoverClose>
                                                    </div>
                                                    <CalendarComponent initialFocus mode="single" selected={field.value ?? undefined} translate="en" onSelect={field.onChange} />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name="region"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"region".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <AsyncSelect
                                                    id="region"
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={loadOptions}
                                                    // defaultValue={field.value}
                                                    value={field.value}
                                                    onChange={(e: any) => field.onChange(e)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>


                        </ScrollArea>
                        {isDirty && (
                            <Button
                                type="submit"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                                className={`flex mx-4`}
                            >
                                Save changes
                            </Button>
                        )}
                    </form>
                </Form>
            </div>

        </div>
    );
};
