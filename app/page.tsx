import { redirect } from "next/navigation";

type PageProps = {};

export default function Page(props: PageProps) {
  // Temporary redirect for development
  return redirect("/users/1/profile");
}
