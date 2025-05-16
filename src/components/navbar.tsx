import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  NavbarMenuToggle,
  NavbarMenu,
} from "@heroui/react";
import React from "react";

import { UserNav } from "@/components/user-nav";
import ThemeSwitch from "@/components/theme-switch";
import { AUTH_PAYLOAD, getAuthCookie } from "@/lib/cookies";

import { UserPayload } from "@/interfaces/auth.interface";
import { NavLinkDropdown } from "./nav";
import { sidelinks } from "@/data/sidelinks";

export const MyNewNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const cookiesPayload = getAuthCookie(AUTH_PAYLOAD);
  const userPayload: UserPayload = JSON.parse(cookiesPayload ?? "{}");

  return (
    <Navbar isBordered onMenuOpenChange={setIsMenuOpen} className="mx-0 px-0 flex justify-end" position="sticky">
      <NavbarContent >
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
        <NavbarBrand>
          <Link href={"/dashboard"} className={`flex items-center gap-2 text-default-900 md:hidden`}>
            <svg
              width="30"
              height="30"
              viewBox="0 0 177 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-all h-8 w-8 `}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M75.7157 80.5704H49.4655L49.4685 80.5762L0 157.714H12.1155L54.9137 90.9774L63.5368 107.449L31.3026 157.713H43.4181L68.9819 117.85L77.1481 133.449L61.5877 157.713H73.7031L82.5932 143.851L89.8504 157.713H116.101L97.0456 121.314L99.2696 117.846L120.14 157.713H146.39L113.722 95.3103L115.946 91.8422L150.43 157.713H176.68L136.295 80.5704H123.175H111.059H110.045L110.501 81.4409L108.277 84.909L106.006 80.5704H92.8896H80.7741H79.7553L80.2132 81.445L77.9892 84.9131L75.7157 80.5704ZM85.6584 91.8463L93.8245 107.445L91.6004 110.913L83.4343 95.3143L85.6584 91.8463Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M109.043 0L109.043 35.604H157.507V73.1864H109.043V76.9236H96.8583V61.25H145.322V47.5403L96.8583 47.5403V11.9363H80.8436L80.8436 47.5403L30.3638 47.5403V61.25H80.8436V76.9236H68.6585V73.1864H18.1787V35.604L68.6585 35.604L68.6585 0H109.043ZM68.6585 161.375L68.6585 180H109.043V161.375H96.8583V168.064H80.8436V161.375H68.6585Z"
                fill="currentColor"
              />
            </svg>
            <div className={`flex flex-col justify-end visible w-auto truncate `} >
              <span className="font-bold uppercase">
                {userPayload?.region?.alt_name ?? "e-gereja"}
              </span>
              <span className="text-xs">Admin Management</span>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" >
        <ThemeSwitch />
        <UserNav />
      </NavbarContent>
      <NavbarMenu>
        {
            sidelinks.filter(datalink => {
                        return datalink.roles?.includes(userPayload.role)
                      }).map(datalink => {
                        return { ...datalink, sub: datalink.sub?.filter(side => side.roles?.includes(userPayload.role)) }
                      }).map(({ sub, ...rest }, index) =>(
            <NavLinkDropdown
                {...rest} sub={sub} key={index}
            />

        ))}
      </NavbarMenu>
    </Navbar>
  );
};
