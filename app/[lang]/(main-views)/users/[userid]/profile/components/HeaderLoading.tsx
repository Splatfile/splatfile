"use client";
import { useEditStore } from "@/app/lib/hooks/use-profile-store";
import { useTagLoadingStore } from "@/app/plate/lib/store/use-tag-store";
import { LoadingLogo } from "@/app/ui/components/LoadingLogo";

type HeaderLoadingProps = {};

export default function HeaderLoading(props: HeaderLoadingProps) {
  const { isLoading } = useEditStore();
  const { isLoading: isTagLoading } = useTagLoadingStore();
  return isLoading || isTagLoading ? (
    <div className={"mx-4 flex items-center justify-center"}>
      <LoadingLogo />
    </div>
  ) : null;
}
