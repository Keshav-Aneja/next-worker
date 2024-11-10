"use client";
import { controlledWorker } from "@/workers/controlled-worker";
import { useEffect, useState } from "react";

export default function Home() {
  const [result, setResult] = useState<any>(0);
  const [worker, setWorker] = useState<controlledWorker | null>(null);
  useEffect(() => {
    const myworker = new controlledWorker(
      "worker.js",
      () => {
        console.log("Default handler");
      },
      () => {
        console.log("Error handler");
      }
    );
    setWorker(myworker);
    myworker.addListener("printresult", (data: any) => {
      setResult(data);
      console.log(data);
    });
  }, []);

  return (
    <main className="w-full min-h-screen bg-black text-white flex items-center justify-center flex-col gap-2">
      <h1 className="text-4xl mb-8">Web Workers</h1>
      <div className="flex items-center gap-2">
        <button
          className="bg-white rounded-md text-black px-4 py-2 font-semibold"
          onClick={() => {
            worker?.execute("add", "printresult", 200, 300);
          }}
        >
          ADD
        </button>
        <button
          className="bg-white hover:scale-50 transition-all duration-100 ease-linear rounded-md text-black px-4 py-2 font-semibold"
          onClick={() => {
            worker?.execute("subtract", "printresult", 300, 200);
          }}
        >
          SUB
        </button>
        <button
          className="bg-white rounded-md text-black px-4 py-2 font-semibold"
          onClick={() => {
            worker?.execute("factorial", "printresult", 72);
          }}
        >
          FAC!
        </button>
      </div>
      <p>RESULT : {result}</p>
    </main>
  );
}
