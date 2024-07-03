import { SERVER_COMPONENT } from "@/app/lib/splatfile-client";
import {
  SplatfileAdmin,
  SplatfileServer,
} from "@/app/lib/server/splatfile-server";
import { unstable_noStore } from "next/cache";
import {
  isGameInfo,
  isPlateInfo,
  isUserInfo,
} from "@/app/lib/types/type-checker";

import { ProfileImage } from "@/app/konva/components/ProfileImage";
import { OgProfileImage } from "@/app/konva/components/OgProfileImage";

import dynamic from "next/dynamic";

const StoreSetting = dynamic(
  () =>
    import(
      "@/app/[lang]/(main-views)/users/[userid]/profile/components/StoreSetting"
    ),
  { ssr: false },
);

const DebounceEditing = dynamic(
  () =>
    import(
      "@/app/[lang]/(main-views)/users/[userid]/profile/components/DebounceEditing"
    ),
  { ssr: false },
);

const ProfileWrapper = dynamic(
  () =>
    import(
      "@/app/[lang]/(main-views)/users/[userid]/profile/components/ProfileWrapper"
    ),
  { ssr: false },
);

type PageProps = {
  params: {
    userid: string;
  };
};

export const generateMetadata = async (props: PageProps) => {
  const admin = new SplatfileAdmin(SERVER_COMPONENT);
  const profile = await admin.getProfile(props.params.userid);

  const userInfo = profile.user_info;

  if (isUserInfo(userInfo)) {
    const userName =
      userInfo.switchInfo?.name || userInfo.twitterInfo?.name || "";
    return {
      title: userName + " 프로필",
      description: userName + " 스플래툰 프로필. 스플랫파일",
    };
  }

  return {
    title: "프로필",
    description: "스플래툰 프로필. 스플랫파일",
  };
};

export default async function ProfilePage(props: PageProps) {
  unstable_noStore();

  const client = new SplatfileServer(SERVER_COMPONENT);

  const admin = new SplatfileAdmin(SERVER_COMPONENT);
  const profile = await admin.getProfile(props.params.userid);

  const { user_info, game_info, plate_info } = profile;

  if (
    !isUserInfo(user_info) ||
    !isGameInfo(game_info) ||
    !isPlateInfo(plate_info)
  ) {
    return <div>유효한 프로필 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <>
      <StoreSetting
        profile={profile}
        userId={props.params.userid}
        isMine={true}
      />
      <div className={"flex flex-col text-white"}>
        <p>내보내기 이미지</p>
        <ProfileImage
          userInfo={user_info}
          gameInfo={game_info}
          plateInfo={plate_info}
        />
        <p>og 이미지</p>
        <OgProfileImage
          userInfo={user_info}
          gameInfo={game_info}
          plateInfo={plate_info}
        />
      </div>
    </>
  );
}
