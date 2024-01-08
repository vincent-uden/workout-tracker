import Link from "next/link";
import { SignInForm } from "./SignInForm";

export default async function SignIn() {
  return (
    <main className="min-h-screen">
    <div className="h-16"></div>
      <SignInForm />
    </main>
  );

}

