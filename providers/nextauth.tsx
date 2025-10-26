"use client";

import { FC, PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";

const NextAuthProviders: FC<PropsWithChildren> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export { NextAuthProviders };
