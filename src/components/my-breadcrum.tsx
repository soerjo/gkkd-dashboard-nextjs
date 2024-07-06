'use client'

import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SlashIcon } from "@radix-ui/react-icons";
import { usePathname } from 'next/navigation';

const MyBreadcrum = ({ currentPath }: { currentPath: string }) => {
    const currentPage = usePathname();
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {
                    currentPage.replace('/', '').split('/').map((path, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbItem className='capitalize'>
                                {path}
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <SlashIcon />
                            </BreadcrumbSeparator>
                        </React.Fragment>
                    ))
                }
                <BreadcrumbPage>
                    <BreadcrumbItem className='capitalize'>
                        {currentPath}
                    </BreadcrumbItem>
                </BreadcrumbPage>
            </BreadcrumbList>
        </Breadcrumb>)
}

export default MyBreadcrum