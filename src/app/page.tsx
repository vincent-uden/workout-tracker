import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      </div>
      <Link href="/dashboard">
        Dashboard
      </Link>
      <Link href="/signup">
        Create an account
      </Link>
    </main>
  );
}
