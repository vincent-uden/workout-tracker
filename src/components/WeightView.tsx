import { useSession, signOut, signIn } from "next-auth/react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceDot,
} from "recharts";
import { api } from "../utils/api";

const WeightView: React.FC = () => {
  const [newWeight, setNewWeight] = useState<string>("");
  const [minW, setMinW] = useState<number>(0);
  const [maxW, setMaxW] = useState<number>(100);

  const [editEntry, setEditEntry] = useState<number | null>(null);
  const [editWeight, setEditWeight] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<Date | null>(null);

  const { data: sessionData } = useSession();

  /*
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );
  */
  const { data: weightEntries, refetch: fetchWeights } =
    api.example.getAllWeightEntries.useQuery(undefined, {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        let min = 0;
        let max = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i]?.kg ?? 1000000 < min) {
            min = i;
          }

          if (data[i]?.kg ?? -1 > max) {
            max = i;
          }
        }

        setMinW(data[min]?.kg ?? 0);
        setMaxW(data[max]?.kg ?? 100);
      },
    });

  const createWeightEntryMut = api.example.addWeightEntry.useMutation({
    onSuccess: () => fetchWeights(),
  });

  const deleteWeightEntryMut = api.example.deleteWeightEntry.useMutation({
    onSuccess: () => fetchWeights(),
  });

  return (
    <div className="flex flex-col items-center justify-start gap-4">
      <div
        className={
          (sessionData ? "block" : "hidden") +
          " flex flex-col items-center justify-start gap-4"
        }
      >
        <div className="h-40 w-screen -translate-x-12">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <AreaChart
              data={
                weightEntries?.map((v) => {
                  return {
                    name: v.created_at,
                    w: v.kg,
                    x: `${v.created_at.getDate()}/${
                      v.created_at.getMonth() + 1
                    }`,
                  };
                }) ?? []
              }
              margin={{ top: 30, right: 30 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="w"
                stroke="#38bdf8aa"
                strokeWidth="2"
                fill="url(#colorUv)"
                label={() => "ASKLJD"}
              />
              <XAxis
                dataKey="x"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fill: "#38bdf8aa", fontSize: 14 }}
              />
              <YAxis
                domain={[minW, maxW]}
                tickLine={false}
                tick={true}
                axisLine={false}
                width={0}
              />
              {weightEntries?.map((v, i) => {
                return (
                  <ReferenceDot
                    x={i}
                    y={v.kg}
                    r={3}
                    fill="#38bdf8"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    label={{
                      position: "top",
                      value: v.kg,
                      fontSize: 14,
                      fill: "#ddd",
                      offset: 10,
                      fontWeight: "bold",
                    }}
                    key={`ref-dot-${i}`}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="h-4"></div>
        <div className="flex w-full flex-row px-4">
          <p className="grow rounded-l py-2 text-center text-white">1mo</p>
          <p className="grow py-2 text-center text-white/20">3mo</p>
          <p className="grow py-2 text-center text-white/20">6mo</p>
          <p className="grow rounded-r py-2 text-center text-white/20">1y</p>
        </div>
        <div className="h-16"></div>
        <div className="grid grid-cols-3">
          <label
            htmlFor="newWeight"
            className="translate-x-[100%] -translate-y-8 text-gray-200"
          >
            Weight
          </label>
          <input
            type="text"
            name="newWeight"
            id="newWeight"
            placeholder="0.0"
            className="rounded border border-white/20 bg-transparent bg-[#18181b] py-2 text-center font-ibm-cond text-2xl text-white placeholder-white/40 outline-none transition-colors"
            onChange={(e) => {
              setNewWeight(e.target.value);
            }}
            value={newWeight}
          />
          <label
            htmlFor="newWeight"
            className="-translate-x-[100%] -translate-y-8 text-right text-gray-200"
          >
            (kg)
          </label>
        </div>
        <button
          className={`rounded-full ${
            sessionData
              ? "bg-sky-600 hover:bg-sky-500"
              : "bg-white/10 hover:bg-white/20"
          } px-10 py-3 font-semibold text-white no-underline transition`}
          onClick={() => {
            createWeightEntryMut.mutate({ kg: parseFloat(newWeight) });
          }}
        >
          Log Weight
        </button>

        <div className="h-8"></div>

        <div
          className={`fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-black/30 transition-opacity ${
            editEntry === null
              ? "pointer-events-none opacity-0"
              : "pointer-events-auto opacity-100"
          }`}
          onClick={() => setEditEntry(null)}
        >
          <div
            className="w-full rounded-xl bg-zinc-800 flex flex-col items-center p-8 mx-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-center text-lg mb-8">Edit Weight Entry</h3>
            <input
              className="rounded border border-white/20 bg-transparent bg-zinc-900 py-2 text-center font-ibm-cond text-base text-white placeholder-white/40 outline-none transition-colors"
              type="text"
              name="editEntryWeight"
              id="editEntryWeight"
              placeholder={
                weightEntries === null || editEntry === null
                  ? ""
                  : weightEntries!![editEntry!!]?.kg.toPrecision(3) ?? ""
              }
              onChange={(e) => {setEditWeight(Number(e.target.value))}}
            />
            
            <div className="h-8" />
            <DayPicker
            mode="single"
             />
          </div>
        </div>

        <div className="max-h-60 overflow-y-scroll rounded-xl bg-zinc-800 p-8 pb-0 shadow-md">
          <h2 className="mb-4 text-center text-xl text-white">
            Weight History
          </h2>
          <div className="p-4">
            <table className="w-full">
              <tbody className="">
                {weightEntries?.map((v, i) => {
                  return (
                    <tr
                      className=""
                      key={`wEntries${i}`}
                      onClick={() => setEditEntry(i)}
                    >
                      <td className="pr-6 text-right text-white">{v.kg.toPrecision(3)} kg</td>
                      <td className="text-white">
                        {v.created_at.toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <button
        className={`rounded-full ${
          sessionData
            ? "bg-red-500/40 hover:bg-red-500/80"
            : "bg-white/10 hover:bg-white/20"
        } mt-12 px-10 py-3 font-semibold text-white no-underline transition`}
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default WeightView;
