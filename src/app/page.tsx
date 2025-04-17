import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"></div>
      <h1 className="text-4xl font-bold text-center text-slate-800 sm:text-6xl animate-bounce">
        Hello, Dealers <span className="animate-spin">🎉</span> <span className="animate-pulse">🚀</span>
      </h1>
      </div>
    
  );
}
