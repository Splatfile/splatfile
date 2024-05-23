import { LoginView } from "@/app/[lang]/(main-views)/users/signin/components/LoginView";
import { PageProps } from "@/app/lib/types/component-props";

export default async function Page(props: PageProps) {
  return (
    <div>
      <LoginView lang={props.params.lang} />
    </div>
  );
}
