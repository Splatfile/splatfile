import Link from "next/link";

type NotFoundProps = {};

export default function NotFound(props: NotFoundProps) {
  return (
    <div
      className={
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col rounded-md bg-white px-10 py-8 text-center shadow-2xl"
      }
    >
      <h1
        className={
          "animate-bounce text-4xl font-bold text-gray-900 hover:animate-spin"
        }
      >
        404 Not Found
      </h1>
      <Link className={"text-blue-400"} href="/">
        Return Home
      </Link>
    </div>
  );
}
