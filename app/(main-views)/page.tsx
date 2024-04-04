import Link from "next/link";

type PageProps = {};

export default function Page(props: PageProps) {
  // Temporary redirect for development
  return (
    <div className={"text-xl"}>
      메인 페이지 만들어야함
      <Link
        className={"text-blue-500"}
        href={"/users/7973f2b0-ee0d-43ab-aeaf-a4d978e1609d/profile"}
      >
        임시 프로필로 이동
      </Link>
    </div>
  );
}
