export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "DemoStore - ร้านค้าออนไลน์",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "หน้าแรก",
      href: "/",
    },
    {
      label: "สินค้าทั้งหมด",
      href: "/products",
    },
    {
      label: "เกี่ยวกับเรา",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "โปรไฟล์",
      href: "/profile",
    },
    {
      label: "แดชบอร์ด",
      href: "/dashboard",
    },
    {
      label: "ออกจากระบบ",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
