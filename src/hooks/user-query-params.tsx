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

export default useQueryParams