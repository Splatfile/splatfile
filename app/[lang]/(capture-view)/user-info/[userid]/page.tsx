import { SERVER_COMPONENT } from "@/app/lib/splatfile-client";
import {
  SplatfileAdmin,
  SplatfileServer,
} from "@/app/lib/server/splatfile-server";
import { unstable_noStore } from "next/cache";
import { StoreSetting } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/StoreSetting";
import { UserInfoWrapper } from "@/app/[lang]/(capture-view)/user-info/[userid]/components/UserInfoWrapper";
import { getDictionary } from "@/app/lib/dictionaries";
import { PageProps } from "@/app/lib/types/component-props";

type ProfilePageProps = PageProps & {
  params: {
    userid: string;
  };
};

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export default async function ProfilePage(props: ProfilePageProps) {
  unstable_noStore();

  const client = new SplatfileServer(SERVER_COMPONENT);
  const user = await client.supabase.auth.getUser();
  const locale = await getDictionary(props.params.lang);

  if (user.data.user && user.data.user?.id === props.params.userid) {
    const profile = await client.createOrGetMyProfile();
    return (
      <>
        <StoreSetting
          profile={profile}
          userId={props.params.userid}
          isMine={true}
        />
        <UserInfoWrapper ingame={locale.ingame} />
      </>
    );
  }

  const admin = new SplatfileAdmin(SERVER_COMPONENT);
  const profile = await admin.getProfile(props.params.userid);

  return (
    <>
      <StoreSetting
        profile={profile}
        userId={props.params.userid}
        isMine={true}
      />
      <UserInfoWrapper ingame={locale.ingame} />
    </>
  );
}
