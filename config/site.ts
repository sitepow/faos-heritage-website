export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "DemoStore - ร้านค้าออนไลน์",
  description: "",
  footer: "Copyright 2025 DemoStore. ร้านค้าออนไลน์",
  link: {
    login: "/login",
    cart: "/cart",
  },
  navItems: [
    {
      label: "หน้าแรก",
      href: "/",
    },
    {
      label: "สินค้าทั้งหมด",
      href: "/",
    },
    {
      label: "เกี่ยวกับเรา",
      href: "/",
    },
  ],
  navMenuItems: [
    {
      label: "หน้าแรก",
      href: "/",
    },
    {
      label: "สินค้าทั้งหมด",
      href: "/",
    },
    {
      label: "เกี่ยวกับเรา",
      href: "/",
    },
  ],
};
