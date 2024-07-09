import { useMediaQuery } from "@/hooks/use-media-query";

import { Input } from "@/components/ui/input";
import React from "react";
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
import { CreateMember } from "@/interfaces/memberResponse";
import { useCreateMemberMutation, useLazyGetAllMemberQuery } from "@/store/services/member";
import { CalendarIcon } from "lucide-react";
import { CalendarComponent } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AUTH_PAYLOAD, getAuthCookie } from "@/lib/cookies";
import { toast } from "react-toastify";



const defaultCreateMemberForm = {
    nij: "",
    full_name: "",
    name: "",
    email: "",
    gender: "",
    place_birthday: "",
    date_birthday: undefined,
    phone_number: "",
    address: "",
    father_name: "",
    mother_name: "",
    birth_order: undefined,
    total_brother_sister: undefined,
    marital_status: undefined,
    husband_wife_name: "",
    wedding_date: undefined,
    // region_id: undefined,
}

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const FormSchema = z
    .object({
        nij: z.string().min(1, { message: "required" }).max(25),
        full_name: z.string().min(1, { message: "required" }).max(25),
        name: z.string().min(1, { message: "required" }).max(25),
        email: z.string().min(1, { message: "required" }).max(25).email(),
        gender: z.string().min(1, { message: "required" }).max(25),
        place_birthday: z.string().min(1, { message: "required" }).max(25),
        date_birthday: z.date(),
        phone_number: z.string().regex(phoneRegex, 'Invalid Number!'),
        address: z.string().max(250).optional(),
        father_name: z.string().max(25).optional(),
        mother_name: z.string().max(25).optional(),
        birth_order: z.number().min(0).optional(),
        total_brother_sister: z.number().min(0).optional(),
        marital_status: z.boolean().optional(),
        husband_wife_name: z.string().max(25).optional(),
        wedding_date: z.date().optional(),
        // region_id: z.number().min(0).optional(),
    })

export type CreateFormProps = React.ComponentProps<"form"> & { onOpenChange: React.Dispatch<React.SetStateAction<boolean>> }

export const CreateForm = ({ onOpenChange }: CreateFormProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const form = useForm<CreateMember>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultCreateMemberForm,
    });
    const { formState: { isSubmitting } } = form;


    const [createMember] = useCreateMemberMutation();
    const [fetchMember] = useLazyGetAllMemberQuery()

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            const cookiesPayload = getAuthCookie(AUTH_PAYLOAD);
            const userPayload = JSON.parse(cookiesPayload ?? "")
            const createUserBody: CreateMember = {
                ...values,
                region_id: userPayload.region.id,

            }
            await createMember(createUserBody).unwrap();
            await fetchMember({}).unwrap();
            onOpenChange(val => !val);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast(errorMessage);
        }
    };

    return (
        <div
            className={`flex flex-col justify-center items-center gap-4 h-full ${isDesktop ? "" : "h-[70vh]"}`}
        >
            <div className="flex flex-col w-full h-1/6 gap-3 justify-center items-center">
                <h2 className="text-xl font-semibold tracking-tight md:text-xl">
                    Input New User
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
                className={`w-full h-5/6 flex flex-col gap-4  ${isDesktop ? "px-0" : "px-2"}`}
            >

                <Form
                    {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex h-full"
                    >
                        <ScrollArea >
                            <div className="flex flex-col gap-4">
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
                                                defaultValue={field.value}
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
                                    )}
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
                                                    type="number"
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
                                                defaultValue={field.value ? "true" : "false"}
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
                            disabled={isSubmitting}
                            className={`flex left-2 right-2 bottom-4 fixed gap-2 ${isDesktop && "absolute"}`}
                        >
                            Save changes
                        </Button>
                    </form>
                </Form>
            </div>

        </div>
    );
};
