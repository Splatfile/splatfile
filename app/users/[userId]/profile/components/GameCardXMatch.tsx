import Image from "next/image";
import { InlineTextCard } from "@/app/ui/components/InlineTextCard";

type GameCardXMatchProps = {};

export function GameCardXMatch(props: GameCardXMatchProps) {
  const { area, fish, shell, tower } = {
    area: 2100,
    fish: 2100,
    shell: 2100,
    tower: 2300,
  };

  return (
    <InlineTextCard title={"X 매치"}>
      <div className={"grid grid-cols-2 gap-4 md:mt-2"}>
        <div className={"flex w-full gap-2"}>
          <Image
            width={24}
            height={24}
            src="/ingames/area.webp"
            alt="Splatoon Level Icon"
          />
          <p>{area}</p>
        </div>
        <div className={"flex gap-2"}>
          <Image
            width={24}
            height={24}
            src="/ingames/fish.webp"
            alt="Splatoon Rank Icon"
          />
          <p>{fish}</p>
        </div>

        <div className={"flex gap-2"}>
          <Image
            width={24}
            height={24}
            src="/ingames/shell.webp"
            alt="Splatoon Salmon Icon"
          />
          <p>{shell}</p>
        </div>
        <div className={"flex gap-2"}>
          <Image
            width={24}
            height={24}
            src="/ingames/tower.webp"
            alt="Splatoon Salmon Icon"
          />
          <p>{tower}</p>
        </div>
      </div>
    </InlineTextCard>
  );
}
