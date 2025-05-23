// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from "@/components/custom/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slice/auth";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import Link from "next/link";
import { userShort } from "../lib/user-short";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@heroui/react";

export function UserNav() {
  const { push } = useRouter();
  const authData = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    push("/login");
  };
  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <button className="bg-default-200 hover:bg-default-100 h-8 w-8 rounded-full text-sm font-bold">
        {userShort(authData?.name)}
        </button>
      </DropdownTrigger>
      <DropdownMenu className="w-56">
        <DropdownItem key="username" className="font-normal">
          <div className="flex flex-col space-y-1">
            <Link href={"#"}>
              <p className="text-sm font-medium leading-none hover:underline capitalize">
                {authData?.name}
              </p>
            </Link>
            <p className="text-xs leading-none text-muted-foreground">
              {authData?.email ?? authData?.username}
            </p>
          </div>
        </DropdownItem>

        <DropdownItem key="logout" color="danger" onClick={handleLogout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
