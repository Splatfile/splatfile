import "@/app/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "min-w-screen min-h-screen bg-black/50 backdrop-blur md:text-lg"
      }
    >
      {children}
    </div>
  );
}
