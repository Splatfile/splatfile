"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, PropsWithChildren, ReactNode } from "react";

type DefaultModalProps = {
  title: ReactNode;
  open: boolean;
  closeButtonText?: string;
  onClose: (open: boolean) => void;
};

export function DefaultModal(props: PropsWithChildren<DefaultModalProps>) {
  const { title, children, open, closeButtonText, onClose } = props;
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
          <div className="flex h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 lg:max-w-2xl">
                <div className={"max-h-screen"}>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h2"
                      className="mb-4 mt-8 text-xl  font-semibold leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    {children}
                  </div>
                </div>
                {closeButtonText && (
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                      onClick={() => onClose(false)}
                    >
                      {closeButtonText}
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
