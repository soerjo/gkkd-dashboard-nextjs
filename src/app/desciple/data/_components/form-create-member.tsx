import React from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { Button } from "@/components/custom/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import AsyncSelect from "@/components/react-select";
import debounce from "lodash.debounce";
import { useLazyGetAllChurchQuery } from "@/store/services/church";
import { CreateDisciples } from "@/interfaces/disciples.interface";
import { useCreateMutation, useLazyGetAllListQuery } from "@/store/services/disciples";
import { useLazyGetAllQuery as useLazyGetAllGroupQuery } from "../../../../store/services/disciples-group";
import { useLazyGetAllMemberQuery } from "../../../../store/services/member";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";

type dropDown = { label: string, value: string | number }
type CreateInputForm = Omit<CreateDisciples, "region_id" | "pembimbing_id" | "group_id" | "jemaat_nij"> & { region?: dropDown, pembimbing?: dropDown, group?: dropDown, jemaat?: dropDown }

const defaultCreateForm: CreateInputForm = {
    name: "",
    book_level: "",
    pembimbing: {
        label: "",
        value: "",
    },
    region: {
        label: "",
        value: "",
    },
    group: {
        label: "",
        value: "",
    },
    jemaat: {
        label: "",
        value: "",
    },
};

const dropDownSchema = z.object({
    label: z.string(),
    value: z.any(),
});

const FormSchema = z.object({
    name: z.string().min(1, { message: 'required' }).max(100),
    book_level: z.string().min(1, { message: 'required' }).max(100),

    region: dropDownSchema.nullable().optional(),
    pembimbing: dropDownSchema.nullable().optional(),
    group: dropDownSchema.nullable().optional(),
    jemaat: dropDownSchema.nullable().optional(),
});

export type CreateFormProps = React.ComponentProps<"form"> & {
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateForm = ({ onOpenChange }: CreateFormProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const form = useForm<CreateInputForm>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultCreateForm,
    });
    const { formState: { isSubmitting, errors }, getValues } = form;

    const [createData] = useCreateMutation();

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            await createData({
                ...values,
                region_id: values?.region?.value || null,
                pembimbing_id: values?.pembimbing?.value || null,
                group_id: values?.group?.value || null,
                jemaat_nij: values?.jemaat?.value || null,
            }).unwrap()

            toast.success('create data success!')
            onOpenChange(val => !val);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    };

    const [fetchChurch] = useLazyGetAllChurchQuery();
    const loadOptionsChurch = debounce(async (query: string, callback: (...arg: any) => any) => {
        try {
            const res = await fetchChurch({
                take: 100,
                page: 1,
                search: query,
            }).unwrap();
            const resp = res.data.entities.map(data => ({
                label: data.name,
                value: data.id,
            }));
            return callback(resp);
        } catch (error) {
            return [];
        }
    }, 300);

    const [fetchDisciples] = useLazyGetAllListQuery();
    const loadOptionsPembimbing = debounce(async (query: string, callback: (...arg: any) => any) => {
        try {
            const res = await fetchDisciples({
                take: 100,
                page: 1,
                search: query,
            }).unwrap();
            const resp = res.data.entities.map(data => ({
                label: data.name,
                value: data.id,
            }));
            return callback(resp);
        } catch (error) {
            return [];
        }
    }, 300);

    const [fetchGroup] = useLazyGetAllGroupQuery();
    const loadOptionsGroup = debounce(async (query: string, callback: (...arg: any) => any) => {
        try {
            const res = await fetchGroup({
                take: 100,
                page: 1,
                search: query,
            }).unwrap();
            const resp = res.data.entities.map(data => ({
                label: data.name,
                value: data.id,
            }));
            return callback(resp);
        } catch (error) {
            return [];
        }
    }, 300);

    const [fetchMember] = useLazyGetAllMemberQuery();
    const loadOptionsJemaat = debounce(async (query: string, callback: (...arg: any) => any) => {
        try {
            const res = await fetchMember({
                take: 100,
                page: 1,
                search: query,
            }).unwrap();
            const resp = res.data.entities.map(data => ({
                label: data.name,
                value: data.id,
            }));
            return callback(resp);
        } catch (error) {
            return [];
        }
    }, 300);

    return (
        <div className={`flex flex-col h-[85vh] gap-4`} >
            <div className="flex flex-col w-full h-1/6 gap-3 justify-center items-center">
                <h2 className="text-xl font-semibold tracking-tight md:text-xl">
                    Input New Disciple
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
                                    name={"name"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"name".replaceAll("_", " ")}
                                            </FormLabel>
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
                                    name={"book_level"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"book_level".replaceAll("_", " ")}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={"book_level"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="4MT">4MT</SelectItem>
                                                    <SelectItem value="SOM">SOM</SelectItem>
                                                    <SelectItem value="SOD1">SOD1</SelectItem>
                                                    <SelectItem value="SOD2">SOD2</SelectItem>
                                                    <SelectItem value="SOD3">SOD3</SelectItem>
                                                    <SelectItem value="DLL">DLL</SelectItem>
                                                </SelectContent>
                                            </Select>{" "}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="group"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"group".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <AsyncSelect
                                                    id="group"
                                                    isClearable
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={loadOptionsGroup}
                                                    value={field.value}
                                                    onChange={(e: any) => field.onChange(e)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pembimbing"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"pembimbing".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <AsyncSelect
                                                    id="pembimbing"
                                                    isClearable
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={loadOptionsPembimbing}
                                                    value={field.value}
                                                    onChange={(e: any) => field.onChange(e)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="jemaat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"jemaat".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <AsyncSelect
                                                    id="jemaat"
                                                    isClearable
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={loadOptionsJemaat}
                                                    value={field.value}
                                                    onChange={(e: any) => field.onChange(e)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="region"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"region".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <AsyncSelect
                                                    id="region"
                                                    isClearable
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={loadOptionsChurch}
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
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className={`flex mx-4`}
                        >
                            Save changes
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};
