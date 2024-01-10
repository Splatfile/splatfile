import Image from "next/image";
import { InlineTextCard } from "@/app/ui/components/InlineTextCard";

type GameCardSalmonrunProps = {};

export function GameCardSalmonRun(props: GameCardSalmonrunProps) {
  const { aramaki, donbrako, meuniere, sekena, sujiko, tokisira } = {
    aramaki: 40,
    donbrako: 40,
    meuniere: 40,
    sekena: 40,
    sujiko: 40,
    tokisira: 40,
  };
  return (
    <InlineTextCard title={"연어런"}>
      <div className={"grid grid-cols-2 gap-4"}>
        <div className={"flex w-full gap-2"}>
          <div className={"h-6 w-6 md:h-8 md:w-8"}>
            <Image
              width={48}
              height={48}
              alt="Aramaki Stage"
              src="/ingames/salmonrun/aramaki.webp"
            />
          </div>
          <p>{aramaki}</p>
        </div>
        <div className={"flex gap-2"}>
          <div className={"h-6 w-6 md:h-8 md:w-8"}>
            <Image
              width={48}
              height={48}
              src="/ingames/salmonrun/donbrako.webp"
              alt="Donbrako Stage"
            />
          </div>
          <p>{donbrako}</p>
        </div>
        <div className={"flex gap-2"}>
          <div className={"h-6 w-6 md:h-8 md:w-8"}>
            <Image
              width={48}
              height={48}
              src="/ingames/salmonrun/meuniere.webp"
              alt="Meuniere Stage"
            />
          </div>
          <p>{meuniere}</p>
        </div>
        <div className={"flex w-full gap-2"}>
          <div className={"h-6 w-6 md:h-8 md:w-8"}>
            <Image
              width={48}
              height={48}
              src="/ingames/salmonrun/sekena.webp"
              alt="Seken Stage"
            />
          </div>
          <p>{sekena}</p>
        </div>
        <div className={"flex gap-2"}>
          <div className={"h-6 w-6 md:h-8 md:w-8"}>
            <Image
              width={48}
              height={48}
              src="/ingames/salmonrun/sujiko.webp"
              alt="Sujiko Stage"
            />
          </div>
          <p>{sujiko}</p>
        </div>
        <div className={"flex gap-2"}>
          <div className={"h-6 w-6 md:h-8 md:w-8"}>
            <Image
              width={48}
              height={48}
              src="/ingames/salmonrun/tokisira.webp"
              alt="Tokisira Stage"
            />
          </div>
          <p>{tokisira}</p>
        </div>
      </div>
    </InlineTextCard>
  );
}
