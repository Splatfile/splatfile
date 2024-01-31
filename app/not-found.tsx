import Link from "next/link";

type NotFoundProps = {};

export default function NotFound(props: NotFoundProps) {
  return (
    <div>
      <h1>404 Not Found</h1>
      <Link href="/">Return Home</Link>
    </div>
  );
}
