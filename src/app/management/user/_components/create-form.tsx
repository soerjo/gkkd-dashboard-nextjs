import { useMediaQuery } from "@/hooks/use-media-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import React from "react";
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
import { useLazyGetAllChurchQuery } from "@/store/services/church";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { useLazyGetParamsQuery } from "@/store/services/params";
import {
    useCreateUserMutation,
    useLazyGetAllUserQuery,
} from "@/store/services/user";
import { GetUserResponse } from "@/interfaces/userResponse";
import AsyncSelect from "@/components/react-select";

const phoneRegex = new RegExp(/^(\+?\d[\s\d]*)?(\d{3}|\(\d+\))?([\s-]?\d)+$/);

const FormSchema = z
    .object({
        name: z.string().min(1, { message: "required" }).max(25).refine(s => !s.includes(' '), 'No Spaces!'),
        email: z.string().min(1, { message: "required" }).max(25).email(),
        role: z.string().min(1, { message: "required" }).max(25),
        phone: z.string().regex(phoneRegex, 'Invalid Number!'),
        region: z.object(
            {
                id: z.number(),
                name: z.string(),
            },
            { message: "required" }
        ),
    })
    .required({ name: true, email: true, role: true });

export const CreateForm = ({
    onOpenChange,
}: React.ComponentProps<"form"> & {
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { toast } = useToast();

    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") ?? "1");
    const take = parseInt(searchParams.get("take") ?? "10");
    const search = searchParams.get('search') ?? '';

    const form = useForm<GetUserResponse>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    const [getAllUser] = useLazyGetAllUserQuery();
    const [getListChurch] = useLazyGetAllChurchQuery();
    const [getParams] = useLazyGetParamsQuery();
    const [createNewUser] = useCreateUserMutation();

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            await createNewUser({
                name: values.name,
                email: values.email,
                role: values.role,
                regions_id: values.region.id,
            }).unwrap();
            await getAllUser({ page, take, search }).unwrap();
            onOpenChange(val => !val);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast({
                className:
                    "fixed top-5 z-[100] flex max-h-screen w-full flex-col-reverse p-4  sm:right-5 sm:flex-col w-fit",
                variant: "destructive",
                description: errorMessage,
            });
        }
    };

    const promiseRoleOptions = async (inputValue: string) => {
        try {
            const listRole = await getParams({ param: "role" }).unwrap();
            const data = listRole.data.map(listRole => ({
                value: listRole.name,
                label: listRole.name,
            }));
            return data.filter(d =>
                d.value.toLowerCase().includes(inputValue.toLowerCase())
            );
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast({
                className:
                    "fixed top-5 z-[100] flex max-h-screen w-full flex-col-reverse p-4  sm:right-5 sm:flex-col w-fit",
                variant: "destructive",
                description: errorMessage,
            });
            return [];
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
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={`w-full flex flex-col gap-4 h-full relative  ${isDesktop ? "px-0" : "px-2"
                        }`}
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        id="email"
                                        placeholder="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>phone</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        id="phone"
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
                        name="region"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Region</FormLabel>
                                <FormControl>
                                    <AsyncSelect
                                        id="region"
                                        cacheOptions
                                        defaultOptions
                                        loadOptions={promiseRegionOptions}
                                        value={
                                            field.value?.name && {
                                                value: field.value?.name,
                                                label: field.value?.name,
                                            }
                                        }
                                        onChange={(e: any) => field.onChange(e?.value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <AsyncSelect
                                        id="role"
                                        cacheOptions
                                        defaultOptions
                                        loadOptions={promiseRoleOptions}
                                        value={
                                            field.value && { value: field.value, label: field.value }
                                        }
                                        onChange={(e: any) => field.onChange(e?.value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
        </div>
    );
};
