import * as React from "react"
import AsyncSelect from "@/components/react-select"
import debounce from 'lodash.debounce';
import useQueryParams from "@/hooks/user-query-params";

export type CustomSelectProps = {
  compName: string,
  fetchQuery: (query: string) => Promise<Array<Record<string, any>>>
}
const CustomSelect = ({ compName, fetchQuery }: CustomSelectProps) => {
  const [searchTerm, setSearchTerm] = React.useState<string | null>('');
  useQueryParams({ key: compName, value: searchTerm })

  const _loadSuggestions = async (query: string, callback: (...arg: any) => any) => {
    const resp = await fetchQuery(query)
    return callback(resp)
  };

  const loadOptions = debounce(_loadSuggestions, 300);

  return (
    <AsyncSelect
      id={compName}
      cacheOptions
      defaultOptions
      className="w-full"
      loadOptions={loadOptions}
      placeholder={`${compName}...`}
      maxMenuHeight={250}
      isClearable={true}
      onChange={(e: any) => setSearchTerm(e?.value?.id)}
    />

  )
}

export default CustomSelect