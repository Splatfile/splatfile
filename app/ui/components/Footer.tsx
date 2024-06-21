import React from "react";
import { DiscordIcon } from "@/app/plate/ui/icons/DiscordIcon";

export const Footer: React.FC = () => {
  return (
    <footer className="bottom-0 left-0 w-full bg-gray-800 py-4 text-center text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className={"flex items-center gap-2"}>
            <a
              href={"https://discord.gg/nnAwPxH4"}
              className={
                "mt-2 h-8 w-8 items-center fill-white text-white hover:text-gray-400"
              }
            >
              <DiscordIcon />
            </a>
            <p>© 2024 Splatfile</p>
          </div>
          <div>
            <a href="/privacy" className="hover:text-gray-400">
              Privacy Policy
            </a>
            <span className="mx-2">|</span>
            <a href="/terms" className="hover:text-gray-400">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
