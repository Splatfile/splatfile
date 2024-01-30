import { redirect } from "next/navigation";

type PageProps = {};

export default function Page(props: PageProps) {
  // Temporary redirect for development
  return redirect("/users/7973f2b0-ee0d-43ab-aeaf-a4d978e1609d/profile");
}
