"use client";

import { api } from "~/trpc/react";
import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { AuthContext } from "../AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const user = useContext(AuthContext);
  const router = useRouter();

  const login = api.user.login.useMutation({
    onSuccess: (data) => {
      if (data) {
        Cookies.set("token", data);
      router.push("/dashboard");
      }
    },
  });

  useEffect(() => {
    if (user.user !== null) {
      router.push("/dashboard");
    }
  }, [user]);

  return (
    <div className="mx-auto flex max-w-64 flex-col items-stretch">
      <label htmlFor="username" className="text-white">
        Username
      </label>
      <Input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="h-4" />

      <label htmlFor="password" className="text-white">
        Password
      </label>
      <Input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="h-4" />

      <Button
        variant={"confirm"}
        onClick={async () => {
            login.mutate({
              username,
              password,
            });
        }}
        disabled={login.isLoading}
      >
        Log In
      </Button>
      <div className="h-2" />
      <Link href={"/signup"} className="underline opacity-80 hover:opacity-100 transition-opacity">Create an account</Link>

      {login.error &&
          <p className="mt-2 text-red-500">{login.error.message}</p>}
    </div>
  );
}
