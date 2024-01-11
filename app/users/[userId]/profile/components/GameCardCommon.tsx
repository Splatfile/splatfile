import Image from "next/image";
import { InlineTextCard } from "@/app/ui/components/InlineTextCard";

export async function GameCardCommon() {
  const level = 46;
  const rank = "S+3";
  const salmon = "전설";
  return (
    <InlineTextCard title={"종합"}>
      <div className={"flex items-center gap-2"}>
        <div className={"h-6 w-6 md:h-8 md:w-8"}>
          <Image
            width={48}
            height={48}
            src="/ingames/level.png"
            alt="Splatoon Level Icon"
          />
        </div>
        <p>{level}</p>
      </div>
      <div className={"flex items-center gap-2"}>
        <div className={"h-6 w-6 md:h-8 md:w-8"}>
          <Image
            width={48}
            height={48}
            src="/ingames/ranked.png"
            alt="Splatoon Rank Icon"
          />
        </div>
        <p>{rank}</p>
      </div>
      <div className={"flex items-center gap-2"}>
        <div className={"h-6 w-6 md:h-8 md:w-8"}>
          <Image
            width={48}
            height={48}
            src="/ingames/salmon.png"
            alt="Splatoon Salmon Icon"
          />
        </div>
        <p>{salmon}</p>
      </div>
    </InlineTextCard>
  );
}
