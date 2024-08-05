import React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import AsyncSelect from "@/components/react-select";
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
import { CreateUser, GetUserResponse } from "@/interfaces/userResponse";
import { useUpdateUserMutation, useGetUserByIdQuery } from "@/store/services/user";
import { useLazyGetParamsQuery } from "@/store/services/params";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { useLazyGetAllChurchQuery } from "@/store/services/church";
import { ScrollArea } from "@/components/ui/scroll-area";
import debounce from "lodash.debounce";
import { AUTH_PAYLOAD, getAuthCookie } from "@/lib/cookies";
import { toast } from "react-toastify";
import { Spinner } from "../../../../components/ui/spinner";
import { useLazyGetAllQuery } from "@/store/services/fellowship";
import { UserRole } from "../../../../interfaces/auth.interface";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

type dropDown = { label: string, value: string | number }
type CreateInputForm = Omit<CreateUser, "region_id" | "role"> & { region: dropDown, role: dropDown, blesscomn?: dropDown[], }

const defaultCreateForm: CreateInputForm = {
    name: "",
    email: "",
    phone: "",
    region: {
        label: "",
        value: "",
    },
    role: {
        label: "",
        value: "",
    },
    blesscomn: [{
        label: "",
        value: "",
    }],
};

const dropDownSchema = z.object({
    label: z.string(),
    value: z.any(),
});

const FormSchema = z.object({
    name: z.string().min(1, { message: "required" }).max(25),
    email: z.string().min(1, { message: "required" }).max(25).email(),
    phone: z.string().regex(phoneRegex, "invalid number"),
    role: dropDownSchema,
    region: dropDownSchema,
    blesscomn: z.array(dropDownSchema.nullable()).optional()
});

export type UpdateFormInputProps = React.ComponentProps<"form"> & {
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    data: GetUserResponse;
};

export const UpdateFormInput = ({
    onOpenChange,
    data,
}: UpdateFormInputProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [updateData] = useUpdateUserMutation();
    const [getParams] = useLazyGetParamsQuery();

    const form = useForm<CreateInputForm>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultCreateForm,
    });

    const { isLoading, data: payload } = useGetUserByIdQuery({ id: data.id });
    const { formState: { isSubmitting, isDirty }, reset, watch } = form;

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            const oldData = data;

            const cookiesPayload = getAuthCookie(AUTH_PAYLOAD);
            const userPayload = JSON.parse(cookiesPayload ?? "");

            await updateData({
                ...values,
                id: oldData.id,
                role: values.role.value,
                region_id: values.region?.value ?? userPayload.region?.id,
                blesscomn_ids: values?.blesscomn?.map(com => com?.value)
            }).unwrap();

            onOpenChange(val => !val);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    };

    const _loadRoleSuggestions = async (
        query: string,
        callback: (...arg: any) => any
    ) => {
        try {
            const response = await getParams({ param: "role" }).unwrap();
            const list = response.data.map(val => ({
                value: val.name,
                label: val.name,
            }));
            return callback(list);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    };

    const promiseRoleOptions = debounce(_loadRoleSuggestions, 300);

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

    const [fetchCommunity] = useLazyGetAllQuery();
    const _loadSuggestionsCommunity = async (query: string, callback: (...arg: any) => any) => {
        try {
            const res = await fetchCommunity({
                take: 100,
                page: 1,
                search: query,
                region_id: watch('region')?.value as number
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
    const loadOptionsCommunity = debounce(_loadSuggestionsCommunity, 300);

    React.useEffect(() => {

        reset({
            name: payload?.data.name ?? "",
            email: payload?.data.email ?? "",
            phone: payload?.data.phone ?? "",
            role: {
                label: payload?.data.role ?? "",
                value: payload?.data.role ?? "",
            },
            region: {
                label: payload?.data.region.name ?? "",
                value: payload?.data.region.id ?? "",
            },
            blesscomn: payload?.data.blesscomn.map(bc => ({
                label: bc?.blesscomn.name,
                value: bc?.blesscomn.id
            }))
        });


    }, [payload]);

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
                    Detail/Update User
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
                                    name={"email"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"email".replaceAll("_", " ")}
                                            </FormLabel>
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
                                    name={"phone"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"phone".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"phone"}
                                                    placeholder={"phone"}
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
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"role".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <AsyncSelect
                                                    id="role"
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={promiseRoleOptions}
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
                                                    cacheOptions
                                                    defaultOptions
                                                    isClearable
                                                    loadOptions={loadOptionsChurch}
                                                    value={field.value}
                                                    onChange={(e: any) => field.onChange(e)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {
                                    payload?.data.role === UserRole.LEADER && (

                                        <FormField
                                            control={form.control}
                                            name="blesscomn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="capitalize">
                                                        {"blesscomn".replaceAll("_", " ")}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <AsyncSelect
                                                            key={watch('region')?.value}
                                                            id="blesscomn"
                                                            isMulti
                                                            cacheOptions
                                                            defaultOptions
                                                            loadOptions={loadOptionsCommunity}
                                                            value={field.value}
                                                            onChange={(e: any) => field.onChange(e)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )
                                }
                            </div>
                        </ScrollArea>

                        {isDirty && (
                            <Button
                                type="submit"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                                className={`flex mx-4 `}
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
