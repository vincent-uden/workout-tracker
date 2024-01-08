"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TRPCError } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";

export function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const createUser = api.user.create.useMutation();

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

      <label htmlFor="email" className="text-white">
        Email
      </label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

      <label htmlFor="passwordConfirm" className="text-white">
        Confirm Password
      </label>
      <Input
        id="passwordConfirm"
        type="password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />
      <div className="h-4" />

      <Button
        variant={"confirm"}
        onClick={async () => {
          if (password === passwordConfirm) {
            createUser.mutate({
              username,
              email,
              password,
            });
          }
        }}
        disabled={createUser.isLoading}
      >
        Create Account
      </Button>

      {createUser.error &&
        JSON.parse(createUser.error?.message).map((e: any) => (
          <p className="text-red-500 mt-2">{e.message}</p>
        ))}
    </div>
  );
}
