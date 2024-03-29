import {
  createOrGetMyProfile,
  getProfile,
  SERVER_COMPONENT,
} from "@/app/lib/supabase-client";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/app/lib/server/supabase-client";
import { ProfileWrapper } from "@/app/users/[userId]/profile/components/ProfileWrapper";
import { unstable_noStore } from "next/cache";
import { StoreSetting } from "@/app/users/[userId]/profile/components/StoreSetting";

type PageProps = {
  params: {
    userId: string;
  };
};

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export default async function ProfilePage(props: PageProps) {
  unstable_noStore();

  const supabaseClient = createSupabaseServerClient(SERVER_COMPONENT);
  const user = await supabaseClient.auth.getUser();

  if (user.data.user && user.data.user?.id === props.params.userId) {
    const profile = await createOrGetMyProfile(supabaseClient);
    return (
      <>
        <StoreSetting
          profile={profile}
          userId={props.params.userId}
          isMine={true}
        />
        <ProfileWrapper />
      </>
    );
  }

  const adminClient = createSupabaseServiceClient(SERVER_COMPONENT);
  const profile = await getProfile(adminClient, props.params.userId);

  return (
    <>
      <StoreSetting
        profile={profile}
        userId={props.params.userId}
        isMine={true}
      />
      <ProfileWrapper />
    </>
  );
}
