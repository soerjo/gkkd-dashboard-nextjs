import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type UseQueryParamProps = { key: string, value: any }

const useQueryParams = ({ key, value }: UseQueryParamProps) => {
    const [paramsValue, setParamsValue] = React.useState(value)
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()

    React.useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams?.toString())
        for (const [newKey, newValue] of Object.entries({ [key]: value ?? null })) {
            if (newValue === null) {
                newSearchParams.delete(newKey)
            } else {
                newSearchParams.set(newKey, String(newValue))
            }
        }

        router.push(pathname + "?" + newSearchParams.toString())
    }, [value])

    React.useEffect(() => {
        setParamsValue(searchParams.get(key))
    }, [searchParams])

    return paramsValue
}

export default useQueryParams