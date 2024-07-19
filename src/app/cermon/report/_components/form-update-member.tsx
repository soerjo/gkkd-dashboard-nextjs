import React from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { CalendarIcon } from "lucide-react";
import { CalendarComponent } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/custom/button";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import AsyncSelect from "@/components/react-select";
import { CreateCermonReport } from "@/interfaces/cermon-report.interface";
import { useGetByIdQuery, useLazyGetByIdQuery, useUpdateMutation } from "@/store/services/cermon-report";
import { useLazyGetAllQuery } from "@/store/services/cermon";

type dropDown = { label: string, value: string | number }
type UpdateBaptismForm = Omit<CreateCermonReport, "region_id" | "cermon_id"> & { cermon: dropDown }

const defaultCreateMemberForm: UpdateBaptismForm = {
    date: new Date(),
    total_male: 0,
    total_female: 0,
    total_new_male: 0,
    total_new_female: 0,
    cermon: {
        label: "",
        value: "",

    }
};

const dropDownSchema = z.object({
    label: z.string(),
    value: z.any(),
});

const FormSchema = z.object({
    date: z.coerce.date(),
    total_male: z.coerce.number().min(0),
    total_female: z.coerce.number().min(0),
    total_new_male: z.coerce.number().min(0),
    total_new_female: z.coerce.number().min(0),
    cermon: dropDownSchema,
});

export type UpdateFormInputProps = React.ComponentProps<"form"> & {
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    data: number;
};

export const UpdateFormInput = ({
    onOpenChange,
    data: id,
}: UpdateFormInputProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [updateData] = useUpdateMutation();
    const [fetchCermon] = useLazyGetAllQuery();

    const [fetchById] = useLazyGetByIdQuery()
    const { isLoading, data: payload } = useGetByIdQuery(
        { id: id },
        { refetchOnMountOrArgChange: true }
    );

    const form = useForm<UpdateBaptismForm>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultCreateMemberForm,
    });

    const {
        formState: { isSubmitting, isDirty },
        reset,
    } = form;

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            await updateData({
                id: id,
                ...values,
                cermon_id: values.cermon.value,
            }).unwrap();
            onOpenChange(val => !val);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    };

    const _loadSuggestionsCermon = async (query: string, callback: (...arg: any) => any) => {
        try {
            const res = await fetchCermon({
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
    };
    const loadOptionsCermon = debounce(_loadSuggestionsCermon, 300);



    React.useEffect(() => {
        if (!payload) return
        const fetch = async () => {
            const res = await fetchById({ id: id }).unwrap()


            reset({
                date: new Date(res.data.date),
                total_male: res.data.total_male,
                total_female: res.data.total_female,
                total_new_male: res.data.total_new_male,
                total_new_female: res.data.total_new_female,
                cermon: {
                    label: res.data.cermon_name,
                    value: res.data.cermon_id,

                }
            });
        }

        fetch()
    }, [payload]);

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-full gap-3">
                <Spinner size="large">
                    <span>Loading page...</span>
                </Spinner>
            </div>
        );

    return (
        <div
            className={`flex flex-col justify-center items-center gap-4 h-full ${isDesktop ? "" : "h-[70vh]"
                }`}
        >
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
            <div
                className={`w-full h-5/6 flex flex-col gap-4  ${isDesktop ? "px-0" : "px-2"
                    }`}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full">
                        <ScrollArea>
                            <div className="flex flex-col gap-4">

                                <FormField
                                    control={form.control}
                                    name="cermon"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"cermon".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <AsyncSelect
                                                    id="cermon"
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={loadOptionsCermon}
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
                                    name={"date"}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="capitalize">{"date".replaceAll("_", " ")}</FormLabel>
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
                                                    <CalendarComponent initialFocus mode="single" selected={field.value ?? undefined} translate="en" onSelect={field.onChange} />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"total_male"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"total_male".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    id={"total_male"}
                                                    placeholder={"total_male"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name={"total_new_male"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"total_new_male".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    id={"total_new_male"}
                                                    placeholder={"total_new_male"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"total_female"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"total_female".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    id={"total_female"}
                                                    placeholder={"total_female"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"total_new_female"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"total_new_female".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    id={"total_new_female"}
                                                    placeholder={"total_new_female"}
                                                    {...field}
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
                                disabled={isSubmitting}
                                className={`flex left-2 right-2 bottom-4 fixed gap-2 ${isDesktop && "absolute"
                                    }`}
                                loading={isSubmitting}
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
