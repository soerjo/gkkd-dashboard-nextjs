import * as React from "react";
import AsyncSelect from "@/components/react-select";
import debounce from "lodash.debounce";
import useQueryParams from "@/hooks/user-query-params";
import { StylesConfig } from "react-select";

export type CustomSelectProps = {
  compName: string;
  fetchQuery: (query: string) => Promise<Array<Record<string, any>>>;
};
const CustomSelect = ({ compName, fetchQuery }: CustomSelectProps) => {
  const [searchTerm, setSearchTerm] = React.useState<string | null>("");
  useQueryParams({ key: compName, value: searchTerm });

  const _loadSuggestions = async (query: string, callback: (...arg: any) => any) => {
    const resp = await fetchQuery(query);
    return callback(resp);
  };

  const loadOptions = debounce(_loadSuggestions, 300);

  const customStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#f9fafb", // Tailwind gray-50
    borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb", // blue-500 / gray-200
    borderRadius: "0.75rem", // rounded-xl
    padding: "0.375rem 0.75rem",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59,130,246,0.4)" : "none",
    minHeight: "3rem",
    fontSize: "1rem",
    color: "#111827", // gray-900
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderRadius: "0.75rem", // rounded-xl
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", // shadow-lg
    marginTop: "0.25rem",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f3f4f6" : "#ffffff", // gray-100 on hover
    color: "#111827", // gray-900
    padding: "0.5rem 1rem", // py-2 px-4
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "0.5rem",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#111827",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af", // gray-400
  }),
  input: (base) => ({
    ...base,
    color: "#111827",
  }),
  menuList: (base) => ({
    ...base,
    // Hide scrollbar
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE 10+
    maxHeight: "300px", // optional: limit height
    overflowY: "auto",
    padding: 0,
    "&::-webkit-scrollbar": {
      display: "none", // Chrome, Safari
    },
  }),
}

  return (
    <AsyncSelect
      styles={customStyles}
      id={compName}
      cacheOptions
      defaultOptions
      className="w-full"
      loadOptions={loadOptions}
      placeholder={`${compName}...`}
      maxMenuHeight={250}
      isClearable={true}
      onChange={(e: any) => setSearchTerm(e?.value?.id || e?.value)}
    />
  );
};

export default CustomSelect;
