"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { z } from "zod";
import { api } from "~/trpc/react";
import Cookies from "js-cookie";
import { JwtSchema } from "~/server/api/routers/user";

export type JwtUser = z.infer<typeof JwtSchema>;

export const AuthContext = createContext<{
  user: JwtUser | null;
  token: string;
}>({ user: null, token: "" });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const validate = api.user.validate.useQuery({token});
  const utils = api.useUtils();

  useEffect(() => {
    if (Cookies.get("token") !== undefined) {
      setToken(Cookies.get("token")!!);
    } else {
      utils.user.invalidate();
    }
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ user: validate.data ?? null, token }}>
      {children}
    </AuthContext.Provider>
  );
}
