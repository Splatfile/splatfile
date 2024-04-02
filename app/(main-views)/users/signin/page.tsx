import { LoginView } from "@/app/(main-views)/users/signin/components/LoginView";

type PageProps = {};

export default async function Page(props: PageProps) {
  return (
    <div>
      <LoginView />
    </div>
  );
}
