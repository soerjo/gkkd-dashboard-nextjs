import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/use-debounce';
import useQueryParams from '@/hooks/user-query-params';
import React from 'react'

const CustomSearchInput = () => {
    const [searchTerm, setSearchTerm] = React.useState<string | null>('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const queryParams = useQueryParams({ key: 'search', value: debouncedSearchTerm })

    return (
        <Input
            placeholder="Search..."
            className="w-full"
            defaultValue={queryParams}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    )
}

export default CustomSearchInput