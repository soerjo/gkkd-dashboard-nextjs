import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type UseQueryParamProps = { key: string, value: any }

const useQueryParams = ({ key, value }: UseQueryParamProps) => {
    const [paramsValue, setParamsValue] = React.useState(value);
    
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    React.useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams?.toString())
        const setValue = paramsValue ?? value;
        for (const [newKey, newValue] of Object.entries({ [key]: setValue ?? null })) {
            if (!newValue) {
                newSearchParams.delete(newKey);
            } else {
                key != "page" && newSearchParams.delete("page");
                newSearchParams.set(newKey, String(newValue));
            }
        }
    
        router.push(pathname + "?" + newSearchParams.toString())
    }, [paramsValue])

    React.useEffect(() => {
        setParamsValue(searchParams.get(key))
    }, [])

    return [paramsValue, setParamsValue]
}

export type UseQueryRangeParamProps = { value: Record<string, any>, key: string[] }

export const useQueryRangeParams: any= ({ key, value }: UseQueryRangeParamProps) => {
    const [paramsValue, setParamsValue] = React.useState(value);
    
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    React.useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams?.toString())
        for (const k of key) {
            const setValue = paramsValue[k] ?? value[k];
            for (const [newKey, newValue] of Object.entries({ [k]: setValue ?? null })) {
                if (!newValue) {
                    newSearchParams.delete(newKey);
                } else {
                    k != "page" && newSearchParams.delete("page");
                    newSearchParams.set(newKey, String(newValue));
                }
            }
        }
    
        router.push(pathname + "?" + newSearchParams.toString())
    }, [paramsValue])

    React.useEffect(() => {
        const paramObj = {} as Record<string, any>
        for (const k of key) {
            paramObj[k] = searchParams.get(k);
        }

        console.log({paramObj})
        setParamsValue(paramObj);
    }, [])

    return [paramsValue, setParamsValue]
}

export default useQueryParams