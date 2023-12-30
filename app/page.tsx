import { AccountCard } from "@/app/ui/AccountCard";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-1">
      <h1>Hello, Splatfile</h1>

      <main
        className={
          "h-screen w-full max-w-screen-xl rounded-2xl bg-neutral-100 px-2 py-4 sm:p-4"
        }
      >
        {/* 계정 정보*/}
        <AccountCard />
      </main>
    </div>
  );
}
