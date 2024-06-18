import { ColourOption, colourOptions } from "@/data/color-data";
import { useMediaQuery } from "@/hooks/use-media-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { Textarea } from "@/components/ui/textarea";
// import AsyncSelect from "@/components/react-select";
import React from "react";
import { Switch } from "@/components/ui/switch";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateChurch, GetChurchResponse } from "@/interfaces/churchResponse";
import {
    useCreateChurchMutation,
    useGetAllChurchQuery,
    useLazyGetAllChurchQuery,
} from "@/store/services/church";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { useLazyGetParamsQuery } from "@/store/services/params";
import {
    useCreateMemberMutation,
    useLazyGetAllMemberQuery,
} from "@/store/services/member";
import { Member } from "@/interfaces/memberResponse";
import AsyncSelect from "@/components/react-select";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"


const FormSchema = z
    .object({
        full_name: z.string().min(1, { message: "required" }).max(25),
        name: z.string().min(1, { message: "required" }).max(25).refine(s => !s.includes(' '), 'No Spaces!'),
        email: z.string().min(1, { message: "required" }).max(25).email(),
        gender: z.string().min(1, { message: "required" }).max(25),
        place_birthday: z.string().min(1, { message: "required" }).max(25),
        date_birthday: z.string(),
        phone_number: z.string().optional(),
        address: z.string().max(255).optional(),
        region: z.object({
            id: z.number(),
            name: z.string(),
        }).optional(),
        father_name: z.string().max(100).optional(),
        mother_name: z.string().max(100).optional(),
        birth_order: z.number().max(100).optional(),
        total_brother_sister: z.number().max(100).optional(),
        marital_status: z.boolean().optional(),
        husband_wife_name: z.string().max(100).optional(),
        wedding_date: z.string().optional(),
    })
// .required({ name: true, email: true, gender: true, region: true });

export const CreateForm = ({
    onOpenChange,
}: React.ComponentProps<"form"> & {
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { toast } = useToast();
    const [createNewMember] = useCreateMemberMutation();

    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1");
    const take = parseInt(searchParams.get("take") || "10");
    const search = searchParams.get('search') || '';

    const [getAllMember] = useLazyGetAllMemberQuery();
    const [getListChurch] = useLazyGetAllChurchQuery();

    const form = useForm<Member & { region: { id: number, name: string, } }>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            full_name: "",
            name: "",
            email: "",
            gender: "",
            place_birthday: "",
            date_birthday: "",
            phone_number: "",
            address: "",
            father_name: "",
            mother_name: "",
            husband_wife_name: "",
            // wedding_date: "",
        },
    });

    const { formState: { isSubmitting } } = form;


    const onSubmit = async ({ region, ...values }: z.infer<typeof FormSchema>) => {
        try {
            await createNewMember({
                ...values,
                phone_number: values.phone_number ?? '',  // Default to empty string if undefined
                address: values.address ?? '',
                father_name: values.father_name ?? '',
                mother_name: values.mother_name ?? '',
                birth_order: values.birth_order,
                total_brother_sister: values.total_brother_sister,
                marital_status: values.marital_status,
                husband_wife_name: values.husband_wife_name ?? '',
                wedding_date: values.wedding_date,
                // region_service: values.region_service ?? '',
                region_id: region?.id
            }).unwrap();
            await getAllMember({ page, take, search }).unwrap();
            onOpenChange(val => !val);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast({
                className:
                    "fixed top-5 z-[100] flex max-h-screen w-full flex-col-reverse p-4  sm:right-5 sm:flex-col w-fit",
                variant: "destructive",
                title: "something error",
                description: errorMessage,
            });
        }
    };

    const promiseRegionOptions = async (inputValue: string) => {
        try {
            const listChurch = await getListChurch({
                take: 20,
                page: 1,
                search: inputValue,
            }).unwrap();
            const data = listChurch.data.entities.map(list => ({
                value: list,
                label: list.name,
            }));
            return data.filter(d =>
                d.label.toLowerCase().includes(inputValue.toLowerCase())
            );
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast({
                className:
                    "fixed top-5 z-[100] flex max-h-screen w-full flex-col-reverse p-4  sm:right-5 sm:flex-col w-fit",
                variant: "destructive",
                title: "something error",
                description: errorMessage,
            });
            return [];
        }
    };

    return (
        <div
            className={`flex flex-col justify-center items-center gap-4 h-full ${isDesktop ? "" : "h-[70vh]"
                }`}
        >
            <h2 className="text-xl font-semibold tracking-tight md:text-xl">
                Input New Member
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
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={`w-full grid h-full relative  ${isDesktop ? "px-0" : "px-2"
                        }`}
                >
                    <ScrollArea className="h-[78vh] w-full rounded-md p-2">
                        <div className="flex flex-col gap-4 px-1 pb-2">

                            <Separator className="" />
                            <h3 className="text-lg tracking-tight md:text-lg">Personal</h3>
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">full_name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                id="full_name"
                                                placeholder="full_name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                id="name"
                                                placeholder="my church name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                id="email"
                                                placeholder="email@mail.co"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">gender</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="gender..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="laki-laki">laki-laki</SelectItem>
                                                    <SelectItem value="perempuan">perempuan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="place_birthday"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">place_birthday</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                id="place_birthday"
                                                placeholder="place_birthday"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date_birthday"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">date_birthday</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "MM/dd/yyyy")
                                                        ) : (
                                                            <span>date_birthday</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    selected={field.value ? new Date(field.value) : new Date()}
                                                    onSelect={(e) => field.onChange(e ? new Date(e).toISOString() : new Date().toISOString())}
                                                    fromYear={new Date().getFullYear() - 100}
                                                    mode="single"
                                                    toDate={new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18)}
                                                    captionLayout="dropdown-buttons"
                                                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                    initialFocus
                                                    fixedWeeks

                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">phone_number</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                id="phone_number"
                                                placeholder="my church phone_number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">address</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                // type="text"
                                                id="address"
                                                placeholder="my address"
                                                {...field}
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
                                        <FormLabel className="capitalize">Region</FormLabel>
                                        <FormControl>
                                            <AsyncSelect
                                                id="region"
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={promiseRegionOptions}
                                                // value={
                                                //     field.value && {
                                                //         value: field.value?.,
                                                //         label: field.value?.,
                                                //     }
                                                // }
                                                onChange={(e: any) => {
                                                    console.log({ data: e?.value });
                                                    field.onChange(e?.value);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator className="mt-8" />
                            <h3 className="text-lg tracking-tight md:text-lg">Family</h3>

                            <FormField
                                control={form.control}
                                name="father_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">father_name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                id="father_name"
                                                placeholder="father_name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mother_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">mother_name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                id="mother_name"
                                                placeholder="mother_name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="birth_order"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">birth_order</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                id="birth_order"
                                                placeholder="birth_order"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="total_brother_sister"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">total_brother_sister</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                id="total_brother_sister"
                                                placeholder="total_brother_sister"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator className="mt-8" />
                            <h3 className="text-lg tracking-tight md:text-lg">Marital</h3>
                            <FormField
                                control={form.control}
                                name="marital_status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">marital_status</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(e => {
                                                console.log({ we: e })
                                                field.onChange(e == "menikah" ? true : false)
                                            })}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="marital status..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={"menikah"}>menikah</SelectItem>
                                                    <SelectItem value={"belum menikah"}>belum menikah</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="husband_wife_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">husband_wife_name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                id="husband_wife_name"
                                                placeholder="husband_wife_name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="wedding_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize">wedding_date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "MM/dd/yyyy")
                                                        ) : (
                                                            <span>wedding_date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    selected={field.value ? new Date(field.value) : new Date()}
                                                    onSelect={(e) => field.onChange(e ? new Date(e).toISOString() : new Date().toISOString())}
                                                    fromYear={new Date().getFullYear() - 100}
                                                    mode="single"
                                                    toDate={new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18)}
                                                    captionLayout="dropdown-buttons"
                                                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                    initialFocus
                                                    fixedWeeks

                                                />
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
                        disabled={isSubmitting}
                        className={`flex left-2 right-2 bottom-4 fixed gap-2 ${isDesktop && "absolute"
                            }`}
                        loading={isSubmitting}
                    >
                        Save changes
                    </Button>
                </form>
            </Form>
        </div >
    );
};
