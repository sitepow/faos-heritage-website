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
import { SearchIcon, ShoppingCart, Triangle, UserIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Button } from "@heroui/button";
import { ThemeSwitch } from "./theme-switch";
import Link from "next/link";

export const Navbar = () => {
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100 ",
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
    <>
      <div className="items-center text-xs sm:text-sm lg:text-base text-white bg-red-800 py-2.5 px-6">
        ร้านค้าออนไลน์ ร้านค้าตัวอย่าง ศูนย์รวมสินค้าบ้านของคนไทย ครบเรื่องบ้าน
        ถูกและดี
      </div>

      <HeroUINavbar
        maxWidth="full"
        position="sticky"
        isBordered
        isBlurred={false}
        className="shadow-md"
      >
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-2"
              href="/"
            >
              <Triangle className="text-red-800" />
              <div className="flex text-inherit flex-col gap-0">
                <span className="font-bold">DemoStore</span>
                <span className="text-xs text-red-800">ร้านค้าตัวอย่าง</span>
              </div>
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
            <Link href={siteConfig.link.login}>
              <Button variant="light" startContent={<UserIcon />}>
                เข้าสู่ระบบ
              </Button>
            </Link>
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <Link href={siteConfig.link.cart}>
              <Button
                variant="light"
                startContent={<ShoppingCart />}
                endContent={
                  <div className="size-7 font-bold flex items-center text-xs justify-center bg-red-800 rounded-full text-white">
                    <span>99+</span>
                  </div>
                }
              />
            </Link>
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>
    </>
  );
};
