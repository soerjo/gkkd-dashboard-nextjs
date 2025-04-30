'use client'

import { Input } from '@heroui/react'
import { Search, X } from 'lucide-react'
import { useState } from 'react'

export default function SearchInput() {
  const [query, setQuery] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      fetchData(query)
    }
  }

  const fetchData = async (searchTerm: string) => {
    try {
    //   const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
    //   const data = await res.json()
      console.log('Fetched data:', searchTerm)
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const clearInput = () => setQuery('')

  return (
    <Input
      placeholder="Search..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      endContent={
        query ? (
          <X
            className="w-4 h-4 text-gray-500 cursor-pointer"
            onClick={clearInput}
          />
        ) : (
            <Search className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        )
      }
    />
  )
}
