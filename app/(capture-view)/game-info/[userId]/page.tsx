import { unstable_noStore } from "next/cache";
import { StoreSetting } from "@/app/(main-views)/users/[userId]/profile/components/StoreSetting";
import { GameInfoWrapper } from "@/app/(capture-view)/game-info/[userId]/components/GameInfoWrapper";
import { SERVER_COMPONENT, SplatfileClient } from "@/app/lib/splatfile-client";
import { SplatfileAdmin } from "@/app/lib/server/splatfile-server";

type PageProps = {
  params: {
    userId: string;
  };
};

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export default async function ProfilePage(props: PageProps) {
  unstable_noStore();

  const client = new SplatfileClient(SERVER_COMPONENT);
  const user = await client.supabase.auth.getUser();

  if (user.data.user && user.data.user?.id === props.params.userId) {
    const profile = await client.createOrGetMyProfile();
    return (
      <>
        <StoreSetting
          profile={profile}
          userId={props.params.userId}
          isMine={true}
        />
        <GameInfoWrapper />
      </>
    );
  }

  const admin = new SplatfileAdmin(SERVER_COMPONENT);
  const profile = await admin.getProfile(props.params.userId);

  return (
    <>
      <StoreSetting
        profile={profile}
        userId={props.params.userId}
        isMine={true}
      />
      <GameInfoWrapper />
    </>
  );
}
