"use client";
import { DefaultModal } from "@/app/ui/components/DefaultModal";
import React, { useState } from "react";
import { SplatPlateEditor } from "@/app/plate/ui/SplatPlateEditor";
import { useEditStore } from "@/app/lib/hooks/use-profile-store";
import { clsx } from "clsx";

type PlateImageProps = {};

export function PlateImage(props: PlateImageProps) {
  const [open, setOpen] = useState(false);

  const { isMine } = useEditStore();

  return (
    <button
      disabled={!isMine}
      className={clsx(
        "aspect-[7/2] w-full max-w-full bg-amber-700",
        isMine && "cursor-pointer hover:opacity-90",
      )}
    >
      <PlateModal open={open} setOpen={setOpen} />
      Plate
    </button>
  );
}

type PlateModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function PlateModal(props: PlateModalProps) {
  const { open, setOpen } = props;

  return (
    <DefaultModal
      title={"플레이트 꾸미기"}
      open={open}
      onClose={() => setOpen(false)}
    >
      <SplatPlateEditor />
    </DefaultModal>
  );
}
