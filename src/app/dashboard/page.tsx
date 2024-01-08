"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthProvider";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { api } from "~/trpc/react";
import Cookies from "js-cookie";

function formatDateShort(date: Date) {
  let output = "";

  output += date.getDate();
  output += "/";
  output += date.getMonth() + 1;
  output += "/";
  output += date.getFullYear();
  output += " ";
  output += date.getHours();
  output += ":";
  output += date.getMinutes();

  return output;
}

export default function Dashboard() {
  const [weightInp, setWeightInp] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);

  const user = useContext(AuthContext);
  const router = useRouter();
  const utils = api.useUtils();

  const logWeight = api.user.logWeight.useMutation({ onSuccess: () => {
    utils.user.getWeights.invalidate();
  }});
  const deleteWeight = api.user.deleteWeight.useMutation({ onSuccess: () => {
    utils.user.getWeights.invalidate();
  }});
  const weightLogs = api.user.getWeights.useQuery({ token: user.token });

  useEffect(() => {
    if (user.user === null) {
      router.push("/signin");
    }
  }, [user]);

  return (
    <>
      <p className="my-4 text-center text-3xl">Dashboard</p>
      <div className="mx-auto flex max-w-64 flex-col items-stretch text-xl">
        <div className="mb-4 flex h-32 animate-pulse flex-col justify-center rounded-lg bg-zinc-600 p-4">
          <p className="text-center">Eventually, there will be a graph here</p>
        </div>
        <Input
          id="weight"
          type="text"
          placeholder="0.0"
          className="text-center text-xl"
          value={weightInp}
          onChange={(e) => setWeightInp(e.target.value)}
        />
        <div className="h-2" />
        <Button
          variant={"confirm"}
          onClick={() =>
            logWeight.mutate({
              token: user.token,
              weight: Number.parseFloat(weightInp),
            })
          }
          disabled={weightInp == ""}
        >
          Add Weight Entry
        </Button>
        <div className="h-4" />
        <div className="rounded-md border">
          <div className="flex flex-row rounded-t-md border-b px-2 py-2">
            <p className="grow font-bold">Weight (kg)</p>
            <p className="font-bold">Date</p>
          </div>
          <ScrollArea className="h-96" onClick={() => {setSelectedEntry(null)}}>
            <table className="w-full">
              {weightLogs.isSuccess &&
                weightLogs.data!!.map((log, i) => {
                  return (
                    <tr
                      className={cn(
                        "cursor-default transition-colors hover:bg-white/10",
                        selectedEntry == i
                          ? "bg-white/20 hover:bg-white/20"
                          : "bg-transparent",
                      )}
                      key={`id-${log.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEntry(i);
                      }}
                    >
                      <td className="text-right pl-2">{log.weight.toFixed(1)}</td>
                      <td className="text-right pr-2">
                        {formatDateShort(log.created_at)}
                      </td>
                    </tr>
                  );
                })}
            </table>
          </ScrollArea>
        </div>
        <div className="h-2" />
        <Button
          variant={"destructive"}
          onClick={() => {
            deleteWeight.mutate({
              token: user.token,
              id: weightLogs.data!![selectedEntry!!]!!.id,
            });
            setSelectedEntry(null);
          }}
          disabled={selectedEntry == null}
        >
          Delete Weight Entry
        </Button>
        <div className="h-8" />
        <Button
          onClick={() => {
            Cookies.remove("token");
            router.push("/");
          }}
        >
          Sign Out
        </Button>
      </div>
    </>
  );
}
