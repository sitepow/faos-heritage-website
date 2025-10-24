import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { ShoppingCart, UserIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { SearchIcon, Logo } from "@/components/icons";
import { Button } from "@heroui/button";

export const Navbar = () => {
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100 min-w-96",
        input: "text-sm",
      }}
      labelPlacement="outside"
      placeholder="ค้นหาสิ่งที่ต้องการที่นี่..."
      endContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">DemoStore</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Button variant="light" startContent={<UserIcon />}>
            เข้าสู่ระบบ
          </Button>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <div className="flex items-center gap-2">
            <ShoppingCart />
            <div className="size-6 bg-red-800 rounded-full text-white text-center">
              0
            </div>
          </div>
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
