'use client'

import React from 'react'
import {Breadcrumbs, BreadcrumbItem} from "@heroui/react";import { usePathname } from 'next/navigation';

const MyBreadcrum = ({ currentPath }: { currentPath?: string }) => {
    const currentPage = usePathname();
    return (
        <Breadcrumbs underline="active">
            {currentPage.replace('/','').split('/').map((path, index) => {
                const href = `/${path}`;
                return (
                    <BreadcrumbItem key={index} isCurrent={currentPage == currentPath}>
                        {path.charAt(0).toUpperCase() + path.slice(1)}
                    </BreadcrumbItem>
                );
            })}
      </Breadcrumbs>
    )
    
}

export default MyBreadcrum