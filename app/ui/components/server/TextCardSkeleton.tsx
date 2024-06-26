import { clsx } from "clsx";

export type InlineTextCardSkeletonProps = {
  wrapperClassName?: string;
};

export function InlineTextCardSkeleton(props: InlineTextCardSkeletonProps) {
  return (
    <div
      className={clsx(
        "flex w-full max-w-full animate-pulse items-center justify-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-6 drop-shadow-sm sm:min-w-60 md:w-auto md:flex-col md:items-center md:justify-center md:px-4 md:py-12",
        props.wrapperClassName,
      )}
    >
      <div className="h-6 w-3/4 rounded-md bg-gray-300 md:w-1/2"></div>
      <div className="flex w-full flex-col gap-2">
        <div className="h-4 w-1/2 rounded-md bg-gray-300"></div>
        <div className="h-4 w-2/3 rounded-md bg-gray-300"></div>
        <div className="h-4 w-5/6 rounded-md bg-gray-300"></div>
      </div>
    </div>
  );
}
