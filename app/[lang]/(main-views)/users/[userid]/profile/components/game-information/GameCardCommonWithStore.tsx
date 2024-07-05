"use client";
import { useState } from "react";
import { Lang } from "@/app/lib/types/component-props";
import { IngameLocale } from "@/app/lib/locales/locale";
import { GameInfo } from "@/app/lib/types/type-checker";
import { GameCardCommon } from "./GameCardCommon";

type GameCardCommonProps = {
  lang: Lang;
  gameInfo: GameInfo;
  ingameLocale: IngameLocale;
  isMine: boolean;
};

export function GameCardCommonWithStore(props: GameCardCommonProps) {
  const [edit, setEdit] = useState(false);

  return <GameCardCommon {...props} edit={edit} setEdit={setEdit} />;
}
