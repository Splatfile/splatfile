"use client";
import { useErrorToastStore } from "@/app/lib/hooks/use-error-toast-store";

export function ErrorToast() {
  const { error, setError } = useErrorToastStore();

  if (!error) return null;

  return (
    <div
      className="fixed right-0 top-0 m-4 rounded-lg bg-red-500 p-4 text-white"
      onClick={() => setError("")}
    >
      {error}
    </div>
  );
}
