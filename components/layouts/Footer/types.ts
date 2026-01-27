interface FooterLink {
  label: string
  href: string
}

interface FooterSubSection {
  title: string
  isShipping?: boolean
  isPayment?: boolean
  items?: string[]
}

interface FooterMenuSection {
  title?: string
  isGroup?: boolean
  isMarketplace?: boolean
  isCertificate?: boolean
  subSections?: FooterSubSection[]
  items?: (string | FooterLink)[]
  maps?: string[]
}

export type { FooterLink, FooterSubSection, FooterMenuSection }
