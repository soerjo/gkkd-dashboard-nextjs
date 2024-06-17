import { ColourOption, colourOptions } from "@/data/color-data";
import { useMediaQuery } from "@/hooks/use-media-query";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/custom/button'
import { Textarea } from "@/components/ui/textarea";
import AsyncSelect from "@/components/react-select";
import React, { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Payment } from "@/data/dummy-table";

const FormSchema = z
    .object({
        id: z.string(),
        name: z.string().min(1, { message: "required" }),
        parent: z.string(),
        status: z.enum(["inactive", "active"]),
        address: z.string().optional(),
    })
    .required({ name: true });

export const UpdateFormInput = ({
    onOpenChange,
}: React.ComponentProps<"form"> & {
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const searchParams = useSearchParams();

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const form = useForm<Payment>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            id: "",
            name: "",
            parent: "",
            status: "active",
            address: "",
            createdAt: "2024-05-10",
        },
    });

    const {
        formState: { isDirty, isSubmitting },
        setValue,
        reset,
    } = form;

    const onSubmit = (values: z.infer<typeof FormSchema>) => {
        console.log({ values });
        return new Promise<ColourOption[]>(resolve => {
            setTimeout(() => {
                console.log("triger submit button");
                onOpenChange(val => !val);
            }, 5000);
        });
    };

    const filterColors = (inputValue: string) => {
        return colourOptions.filter(i =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const promiseOptions = async (inputValue: string): Promise<any[]> =>
        new Promise<ColourOption[]>(resolve => {
            setTimeout(() => {
                resolve(filterColors(inputValue));
            }, 1000);
        });

    React.useEffect(() => {
        if (searchParams.get("id")) {
            reset({
                id: "123",
                name: searchParams.get("id") || "",
                status: "active",
                parent: "parent",
                address: "address",
                createdAt: new Date().toLocaleDateString(),
            });
        }
    }, [searchParams]);

    return (
        <div
            className={`flex flex-col justify-center items-center gap-4 h-full ${isDesktop ? "" : "h-[70vh]"
                }`}
        >
            <h2 className="text-xl font-semibold tracking-tight md:text-xl">
                Update Church
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
                                    {/* <Input placeholder="shadcn"  /> */}
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="parent"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent</FormLabel>
                                <FormControl>
                                    <AsyncSelect
                                        id="parent"
                                        cacheOptions
                                        defaultOptions
                                        loadOptions={promiseOptions}
                                        value={
                                            field.value && { value: field.value, label: field.value }
                                        }
                                        onChange={(e: any) => field.onChange(e?.value)}
                                    />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value === "active"}
                                        onCheckedChange={e =>
                                            e ? field.onChange("active") : field.onChange("inactive")
                                        }
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
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="address"
                                        placeholder="my church address..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isDirty &&
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex left-2 right-2 bottom-4 fixed gap-2 ${isDesktop && "absolute"
                                }`}
                            loading={isSubmitting}
                        >
                            {/* {isSubmitting && (
                        <Spinner show className="text-secondary" size={"small"} />
                    )} */}
                            Save changes
                        </Button>
                    }

                </form>
            </Form>
        </div>
    );
};
