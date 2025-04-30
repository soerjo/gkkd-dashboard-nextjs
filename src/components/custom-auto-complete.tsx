import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete"
import { Search } from "lucide-react"
import React from "react"

export const CustomAutoComplete = () => {
    const [value, setValue] = React.useState<any | null>(null)
    const [loading, setLoading] = React.useState(false)

    const options = [
        {key: "youth", label: "youth"},
        {key: "witness", label: "witness"},
        {key: "arrow", label: "arrow"},
        {key: "family", label: "family"},
      ];

    const handleSelect = async (option: any | null) => {
      if (option) {
        setValue(option) // clear the selection

        console.log('Selected:', option)
        await fetchData(option.value)
      }
    }

    const fetchData = async (searchTerm: string) => {
        setLoading(true)
        console.log(`Fetching for "${searchTerm}"...`)
        setTimeout(() => {
          console.log(`Dummy fetch complete for "${searchTerm}"`)
          setLoading(false)
          setValue(null) // clear the selection
        }, 1500) // 1.5s fake delay
      }

    return (
                <Autocomplete
                  className="w-full"
                //   value={value}
                //   inputValue={(inputValue: any) => console.log({inputValue})}
                isLoading={loading}
                // onClose={() => setValue(null)}
                  items={options}
                  selectedKey={value}
                  onSelectionChange={handleSelect}
                  onInputChange={(onInputChange)=> console.log({onInputChange})}
                  placeholder="Add People..."
                  variant='flat'
                  disableSelectorIconRotation
                  unselectable="on"
                  isClearable
                    
                  
                  selectorIcon={<Search className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                >
                  {(item) => <AutocompleteItem key={item.key}>
                      <div className='flex flex-col justify-center'>
                        <p className='capitalize'>{`Mama Jeremy / Ka Ida / Iby Neny`}</p>
                        <p className='text-sm text-default-500'>Witness - Blesscomn</p>
                      </div>
                    </AutocompleteItem>}
                </Autocomplete>
    )
}