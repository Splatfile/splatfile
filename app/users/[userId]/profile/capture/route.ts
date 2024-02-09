import { NextRequest, NextResponse } from "next/server";

// 내부에서 외부 IO 에 대해 캐싱을 관리 하는 세그먼트 입니다.
// 업데이트 관련 한 api는 force-dynamic 을 사용하는 게 좋을 것 같습니다.
export const dynamic = "force-dynamic"; // defaults to auto

// 함수 명이 각 http method에 매핑됩니다.
// 아래와 같이 선언 해주시면 현재 경로인 /users/[userId]/profile/capture 에 매핑 되는 구조입니다.
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const userId = params.userId; // dynamic path parameter 를 가져올 때 사용합니다. [userId] 에 해당하는 값이 들어옵니다.
  const somethingSearchParam = request.nextUrl.searchParams.get(
    "somethingSearchParam",
  ); // url query 에서 가져올 때 사용합니다.

  console.log("userId:", userId, "somethingSearchParam", somethingSearchParam);
  // lib/server 쪽에 비즈니스 로직 작성해 주신뒤 이쪽에서 호출해주시면 될 것 같아요.

  return NextResponse.json({ message: "Hello, world!" });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({ message: "Hello, world!" });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({ message: "Hello, world!" });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({ message: "Hello, world!" });
}
