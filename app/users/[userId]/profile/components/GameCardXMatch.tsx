import Image from "next/image";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import {
  setXMatchPoint,
  useEditStore,
  useGameStore,
} from "@/app/lib/hooks/use-profile-store";
import { ChangeEvent, useState } from "react";
import { isKeyOfXmatch, XMatchInfo } from "@/app/lib/schemas/profile";

type GameCardXMatchProps = {};

export function GameCardXMatch(props: GameCardXMatchProps) {
  const { xMatchInfo, anarchyBattleRank } = useGameStore();
  const { isMine } = useEditStore();
  const [edit, setEdit] = useState(false);

  if (anarchyBattleRank?.grade !== "S+") return null;

  if (!xMatchInfo && !isMine) {
    return null;
  }

  return (
    <EditableInlineTextCard edit={edit} title={"X 매치"} setEdit={setEdit}>
      {edit ? <XMatchCardEdit /> : <XMatchCardView xMatchInfo={xMatchInfo} />}
    </EditableInlineTextCard>
  );
}

type XMatchCardViewProps = {
  xMatchInfo?: XMatchInfo;
};

const XMatchCardView = (props: XMatchCardViewProps) => {
  const { xMatchInfo } = props;
  if (!xMatchInfo) {
    return null;
  }

  const { area, clam, fish, tower } = xMatchInfo;
  return (
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
          src="/ingames/shell.webp"
          alt="Splatoon Salmon Icon"
        />
        <p>{clam}</p>
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
          src="/ingames/tower.webp"
          alt="Splatoon Salmon Icon"
        />
        <p>{tower}</p>
      </div>
    </div>
  );
};

const XMatchCardEdit = () => {
  const { isMine } = useEditStore();
  const { xMatchInfo, anarchyBattleRank } = useGameStore();

  if (anarchyBattleRank?.grade !== "S+" || !isMine) {
    return null;
  }

  const { area, fish, clam, tower } = xMatchInfo ?? {
    area: "",
    fish: "",
    clam: "",
    tower: "",
  };
  const onChangePoint = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name;
    if (!isKeyOfXmatch(key)) {
      throw new Error(`Invalid key for XMatchInfo: ${key}`);
    }
    setXMatchPoint(key, e.target.value);
  };

  return (
    <div className={"grid grid-cols-2 gap-4 md:mt-2"}>
      <div className={"flex w-full gap-2"}>
        <Image
          width={24}
          height={24}
          src="/ingames/area.webp"
          alt="Splatoon Area Icon"
        />
        <label htmlFor={area}>Area Level</label>
        <input
          id={"area"}
          name={"area"}
          onChange={onChangePoint}
          placeholder={"2100+"}
        >
          {area}
        </input>
      </div>
      <div className={"flex gap-2"}>
        <Image
          width={24}
          height={24}
          src="/ingames/fish.webp"
          alt="Splatoon Fish Icon"
        />
        <label htmlFor={fish}>Fish Level</label>
        <input
          id={"fish"}
          name={"fish"}
          onChange={onChangePoint}
          placeholder={"20+"}
        >
          {fish}
        </input>
      </div>

      <div className={"flex gap-2"}>
        <Image
          width={24}
          height={24}
          src="/ingames/shell.webp"
          alt="Splatoon clam Icon"
        />
        <label htmlFor={clam}>Clam Level</label>
        <input
          id={"clam"}
          name={"clam"}
          onChange={onChangePoint}
          placeholder={"2341"}
        >
          {clam}
        </input>
      </div>
      <div className={"flex gap-2"}>
        <Image
          width={24}
          height={24}
          src="/ingames/tower.webp"
          alt="Splatoon Tower Icon"
        />
        <label htmlFor={tower}>Tower Level</label>
        <input
          id={"tower"}
          name={"tower"}
          onChange={onChangePoint}
          placeholder={"X"}
        >
          {tower}
        </input>
      </div>
    </div>
  );
};
