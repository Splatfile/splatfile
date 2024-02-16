"use client";
import React, { Fragment, useState } from "react";
import { SplatPlateEditor } from "@/app/plate/ui/SplatPlateEditor";
import { useEditStore } from "@/app/lib/hooks/use-profile-store";
import { clsx } from "clsx";
import { Dialog, Transition } from "@headlessui/react";

type PlateImageProps = {};

export function PlateImage(props: PlateImageProps) {
  const [open, setOpen] = useState(false);

  const { isMine } = useEditStore();

  return (
    <button
      disabled={!isMine}
      onClick={() => setOpen(true)}
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
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex h-screen items-end justify-center text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full transform overflow-hidden rounded-lg bg-gray-800 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-screen-lg sm:px-2">
                <div className={""}>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h2"
                      className="mb-4 mt-8 text-xl font-semibold leading-6 text-white"
                    >
                      플레이트 꾸미기
                    </Dialog.Title>
                    <SplatPlateEditor />
                    <button
                      type="button"
                      className="inline-flex w-40 justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                      onClick={() => setOpen(false)}
                    >
                      결정
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
