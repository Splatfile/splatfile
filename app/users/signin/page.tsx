import { LoginView } from "@/app/users/signin/components/LoginView";

type PageProps = {};

export default async function Page(props: PageProps) {
  return (
    <div>
      <LoginView />
    </div>
  );
}
