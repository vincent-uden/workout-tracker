import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { Icon } from "@iconify/react";

import { api } from "../utils/api";
import { useRef, useState } from "react";
import {
  Area,
  AreaChart,
  ReferenceDot,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import WeightView from "../components/WeightView";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";

import { TransitionGroup, CSSTransition } from "react-transition-group";

type IndexView = "weight" | "workout" | "nutrition";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const [activeView, setActiveVew] = useState<IndexView>("weight");

  const weightRef = useRef(null);
  const nutritionRef = useRef(null);
  const workoutRef = useRef(null);

  return (
    <>
      <Head>
        <title>Workout Tracker</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="bg-pattern" />
      <div className="bg-pattern-grad" />
      <main className="min-h-screen">
        <div className="relative top-8 mx-auto flex w-fit flex-row gap-4">
          <Icon
            icon="ion:scale"
            className={`h-8 w-8 text-white transition ${
              activeView == "weight" ? "opacity-100" : "scale-75 opacity-20"
            }`}
            onClick={() => setActiveVew("weight")}
          />
          <Icon
            icon="map:gym"
            className={`h-8 w-8 text-white transition ${
              activeView == "workout" ? "opacity-100" : "scale-75 opacity-20"
            }`}
            onClick={() => setActiveVew("workout")}
          />
          <Icon
            icon="mdi:food-fork-drink"
            className={`h-8 w-8 text-white transition ${
              activeView == "nutrition" ? "opacity-100" : "scale-75 opacity-20"
            }`}
            onClick={() => setActiveVew("nutrition")}
          />
        </div>
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-12 py-16">
          <div className="flex grow flex-col items-center">
            <TransitionGroup component={null}>
              {
                {
                  weight: (
                    <CSSTransition ref={weightRef} timeout={500} classNames="view-panel">
                      <WeightView nodeRef={weightRef}/>
                    </CSSTransition>
                  ),
                  workout: (
                    <CSSTransition ref={workoutRef} timeout={500} classNames="view-panel">
                  <WorkoutView nodeRef={workoutRef}/>
                    </CSSTransition>
                  ),
                  nutrition: (
                    <CSSTransition ref={nutritionRef} timeout={500} classNames="view-panel">
                  <NutritionView nodeRef={nutritionRef} />
                    </CSSTransition>
                  ),
                }[activeView]
              }
            </TransitionGroup>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

export interface PanelProps {
  nodeRef: React.RefObject<HTMLDivElement>,
}


const WorkoutView = ({nodeRef}: PanelProps) => {
  return (
    <div className="flex flex-col items-center justify-start gap-4" ref={nodeRef}>
      <h1>Workout</h1>
    </div>
  );
};

const NutritionView  = ({ nodeRef }: PanelProps) => {
  const [editingEntry, setEditingEntry] = useState<number | null>(null);

  return (
    <div className="flex grow flex-col items-center justify-start gap-4" ref={nodeRef}>
      <h1 className="text-center font-ibm text-5xl text-fitblue">
        1873<span className="ml-2 text-2xl text-white/60">kcal</span>
      </h1>

      <div className="w-full max-w-[90vw] grow basis-8 rounded border border-fitblue bg-[#18181b] p-4">
        <table className="w-[80vw]">
          <thead className="">
            <tr className="border-b border-white">
              <th className="text-left font-ibm-cond text-white">Name</th>
              <th className="text-right font-ibm-cond text-white">Amount</th>
              <th className="text-right font-ibm-cond text-white">(kcal)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-left font-ibm-cond text-white">
                Chicken Breast
              </td>
              <td className="text-right font-ibm-cond text-white">200g</td>
              <td className="text-right font-ibm-cond text-white">457</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="h-2" />
      <div className="align-center grid justify-center">
        <button
          className={`rounded-full bg-sky-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-sky-500`}
          onClick={() => {
            setEditingEntry(-1);
          }}
        >
          Add Food
        </button>
      </div>

      <div className="h-2" />
      <div className="flex flex-row">
        <Icon icon="mdi:chevron-left" className="h-8 w-8 text-white" />
        <h2 className="mx-8 text-center font-ibm text-2xl text-white">Today</h2>
        <Icon icon="mdi:chevron-right" className="h-8 w-8 text-white" />
      </div>

      <div
        className={`fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-black/30 transition-opacity ${
          editingEntry === null
            ? "pointer-events-none opacity-0"
            : "pointer-events-auto opacity-100"
        }`}
        onClick={() => {}}
      >
        <div
          className="fixed top-0 left-0 -z-10 h-screen w-screen"
          onClick={() => setEditingEntry(null)}
        />
        <div
          className="mx-8 grid w-full grid-cols-2 gap-2 rounded-xl bg-zinc-800 p-8 shadow-2xl"
          onClick={() => {}}
        >
          <h3 className="col-span-2 text-center font-ibm text-xl text-white">
            Add Food
          </h3>

          <input
            className="col-span-2 rounded border border-white/20 bg-transparent bg-zinc-900 py-2 pl-4 font-ibm-cond text-base text-white placeholder-white/40 outline-none transition-colors"
            type="text"
            name="editEntryWeight"
            id="editEntryWeight"
            placeholder="Food"
            onChange={(e) => {}}
            value={""}
          />

          <div className="col-span-2 h-60 rounded border border-white/20 bg-transparent bg-zinc-900 py-2 pl-4"></div>

          <input
            className="col-span-1 rounded border border-white/20 bg-transparent bg-zinc-900 py-2 pl-4 font-ibm-cond text-base text-white placeholder-white/40 outline-none transition-colors"
            type="text"
            name="editEntryWeight"
            id="editEntryWeight"
            placeholder="Amount"
            onChange={(e) => {}}
            value={""}
          />

          <div className="grid items-center rounded border border-white/20 bg-zinc-900 align-middle">
            <Select>
              <SelectTrigger className="bg-zinc-900">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="oz">oz</SelectItem>
                <SelectItem value="lb">lb</SelectItem>
                <SelectItem value="dl">dl</SelectItem>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="fl oz">fl oz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2" />
          <div className="col-span-2 grid items-center justify-center align-middle">
            <button
              className={`w-40 rounded-full bg-sky-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-sky-500`}
              onClick={() => {}}
            >
              0 kcal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
