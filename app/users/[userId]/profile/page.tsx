import {
  createOrGetMyProfile,
  getProfile,
  SERVER_COMPONENT,
} from "@/app/lib/supabase-client";
import { createSupabaseServerClient } from "@/app/lib/server/supabase-client";
import { ProfileWrapper } from "@/app/users/[userId]/profile/components/ProfileWrapper";

type PageProps = {
  params: {
    userId: string;
  };
};

export default async function ProfilePage(props: PageProps) {
  const supabaseClient = createSupabaseServerClient(SERVER_COMPONENT);
  const user = await supabaseClient.auth.getUser();
  console.log("user", user);
  if (user.data.user && user.data.user?.id === props.params.userId) {
    const profile = await createOrGetMyProfile(supabaseClient);
    return <ProfileWrapper userId={props.params.userId} isMine={true} />;
  }

  const profile = await getProfile(supabaseClient, props.params.userId);

  return (
    <ProfileWrapper
      profile={profile}
      userId={props.params.userId}
      isMine={false}
    />
  );
}
