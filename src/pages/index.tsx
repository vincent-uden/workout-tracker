import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { Icon } from "@iconify/react";

import { api } from "../utils/api";
import { useState } from "react";
import {
  Area,
  AreaChart,
  ReferenceDot,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import WeightView from "../components/WeightView";

type IndexView = "weight" | "workout" | "nutrition";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const [activeView, setActiveVew] = useState<IndexView>("weight");

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
        <div className="relative top-8 flex flex-row gap-4 w-fit mx-auto">
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
        <div className="container flex flex-col items-center justify-center gap-12 py-16 mx-auto">
          <div className="flex flex-col items-center">
            {
              {
                weight: <WeightView />,
                workout: <WorkoutView />,
                nutrition: <NutritionView />,
              }[activeView]
            }
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const WorkoutView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start gap-4">
      <h1>Workout</h1>
    </div>
  );
};

const NutritionView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start gap-4">
      <h1>Nutrition</h1>
    </div>
  );
};
