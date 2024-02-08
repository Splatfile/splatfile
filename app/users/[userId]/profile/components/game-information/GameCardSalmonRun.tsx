import Image from "next/image";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import {
  setSalmonRunMapPoints,
  useMine,
  useSalmonRunMapPoints,
  useSalmonRunRank,
} from "@/app/lib/hooks/use-profile-store";
import {
  isKeyOfSalmonRunMapPoints,
  salmonrun_legend,
  salmonRunMapPointKeys,
  SalmonRunMapPoints,
} from "@/app/lib/schemas/profile";
import { useState } from "react";
import { EditableNumber } from "@/app/ui/components/EditableText";

export function GameCardSalmonRun() {
  const salmonRunRank = useSalmonRunRank();
  const mapPoints = useSalmonRunMapPoints();
  const [edit, setEdit] = useState(false);
  const isMine = useMine();

  if (salmonRunRank?.grade !== salmonrun_legend) return null;

  if (!isMine && !mapPoints) return null;

  return (
    <EditableInlineTextCard title={"연어런"} edit={edit} setEdit={setEdit}>
      <SalmonRunView edit={edit} mapPoints={mapPoints} />
    </EditableInlineTextCard>
  );
}

type SalmonRunViewProps = {
  edit: boolean;
  mapPoints?: SalmonRunMapPoints;
};

const SalmonRunView = (props: SalmonRunViewProps) => {
  if (!props.mapPoints) return null;

  return (
    <div className={"grid grid-cols-2 gap-4"}>
      {salmonRunMapPointKeys.map(
        (key) =>
          isKeyOfSalmonRunMapPoints(key) && (
            <SalmonEditText
              key={key}
              mapKey={key}
              edit={props.edit}
              point={props.mapPoints?.[key]}
            />
          ),
      )}
    </div>
  );
};

type SalmonEditTextProps = {
  point?: number;
  mapKey: keyof SalmonRunMapPoints;
  edit: boolean;
};
const SalmonEditText = (props: SalmonEditTextProps) => {
  const { mapKey, point = 40, edit } = props;
  const onChangePoint = (value: string) => {
    let point = parseInt(value);
    if (point < 0) {
      point = 0;
    } else if (point > 999) {
      point = 999;
    }
    setSalmonRunMapPoints(mapKey, point);
  };

  return (
    <div className={"flex w-full gap-2"}>
      <div className={"h-6 w-6 md:h-8 md:w-8"}>
        <Image
          width={48}
          height={48}
          src={`/ingames/salmonrun/Badge_CoopGrade_Normal_Shake${mapKey}_Lv${
            point === 999
              ? "03"
              : point >= 600
                ? "02"
                : point >= 400
                  ? "01"
                  : "00"
          }.png`}
          alt={`${mapKey} Stage`}
        />
      </div>
      <EditableNumber
        edit={edit}
        value={String(point || 40)}
        step={10}
        onChange={onChangePoint}
        inputClassName={"w-20 px-2 underline underline-offset-2 outline-none"}
      />
    </div>
  );
};
