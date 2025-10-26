"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { User } from "@heroui/user";
import { LogOutIcon } from "lucide-react";

import { useSession, signOut } from "next-auth/react";

const UserPanel = () => {
  const { data: session } = useSession();

  return (
    <Dropdown>
      <DropdownTrigger>
        <User
          className="cursor-pointer"
          avatarProps={{
            src: "/placeholder.svg",
          }}
          description={session?.user?.email}
          name={session?.user?.name}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="logout"
          startContent={<LogOutIcon />}
          onClick={signOut}
          className="text-danger"
          color="danger"
        >
          ออกจากระบบ
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export { UserPanel };
