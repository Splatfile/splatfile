"use client";
import dynamic from "next/dynamic";

const HeaderLoading = dynamic(() => import("./HeaderLoading"), { ssr: false });

type HeaderLoadingWrapperProps = {};

export function HeaderLoadingWrapper(props: HeaderLoadingWrapperProps) {
  return <HeaderLoading />;
}
