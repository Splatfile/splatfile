import { LoginView } from "@/app/[lang]/(main-views)/users/signin/components/LoginView";
import { PageProps } from "@/app/lib/types/component-props";
import { UserContextWrapper } from "@/app/lib/hooks/user-context-wrapper";

export default async function Page(props: PageProps) {
  return (
    <div>
      <UserContextWrapper>
        <LoginView lang={props.params.lang} />
      </UserContextWrapper>
    </div>
  );
}
