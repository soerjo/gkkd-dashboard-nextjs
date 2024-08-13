import React from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { CalendarIcon, X } from "lucide-react";
import { CalendarComponent } from "@/components/ui/date-picker";
import { format, min } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/custom/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import AsyncSelect from "@/components/react-select";
import debounce from "lodash.debounce";
import { useLazyGetAllQuery } from "@/store/services/disciples-group";
import { useCreateMutation } from "@/store/services/disciples-report";
import { CreateDisciplesReport } from "@/interfaces/disciples-report.interface";
import { doSomeDelay } from "../../../../lib/delay";
import { PopoverClose } from "@radix-ui/react-popover";

type dropDown = { label: string, value: string | number }
type CreateBaptismForm = Omit<CreateDisciplesReport, "disciple_group_id"> & { group: dropDown }

const defaultCreateMemberForm: CreateBaptismForm = {
    date: new Date(),
    material: '',
    group: {
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
    material: z.string().min(1, { message: 'required' }).max(100),
    group: dropDownSchema,
});

export type CreateFormProps = React.ComponentProps<"form"> & {
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateForm = ({ onOpenChange }: CreateFormProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const form = useForm<CreateBaptismForm>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultCreateMemberForm,
    });
    const {
        formState: { isSubmitting, errors },
    } = form;

    const [createData] = useCreateMutation();
    const [fetchGroup] = useLazyGetAllQuery();


    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            await createData({
                ...values,
                disciple_group_id: values.group.value,
            }).unwrap();

            doSomeDelay(500)
            toast.success('create data success!')
            onOpenChange(val => !val);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    };

    const _loadSuggestionsGroup = async (query: string, callback: (...arg: any) => any) => {
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
    };
    const loadOptionsGroup = debounce(_loadSuggestionsGroup, 300);


    return (
        <div className={`flex flex-col h-[85vh] gap-4`} >
            <div className="flex flex-col w-full h-1/6 gap-3 justify-center items-center">
                <h2 className="text-xl font-semibold tracking-tight md:text-xl">
                    Input New Report
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
                                    name="group"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"group".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <AsyncSelect
                                                    id="group"
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
                                    name={"material"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"material".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"material"}
                                                    placeholder={"material"}
                                                    {...field}
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
