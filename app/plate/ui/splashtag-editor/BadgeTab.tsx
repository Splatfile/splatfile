import { useEffect, useState } from "react";
import { getDefinedBadges } from "../../lib/define-badges";
import { clsx } from "clsx";
import { setBadges, useBadges } from "../../lib/store/use-tag-store";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { baseUrl } from "@/app/plate/lib/const";
import lang from "@/app/plate/lang.json";

const defineName = (name: string) => {
  const hashIndex = name.indexOf("#");
  return name.substring(0, hashIndex).replace("NAME:", "") as SectionKeys;
};

type Badges = [string, string, string];

export function BadgeTab() {
  const [selectedSlot, setSelectedSlot] = useState(0);
  const currentBadges = useBadges();
  const badges = getDefinedBadges();

  const onClickBadge = (badge: string) => {
    console.log("badge", badge);
    let newBadges: Badges;
    const indexOf = currentBadges.indexOf(badge);

    if (currentBadges[selectedSlot] === badge) {
      newBadges = [
        ...currentBadges.slice(0, selectedSlot),
        "",
        ...currentBadges.slice(selectedSlot + 1),
      ] as Badges;
    } else if (indexOf !== -1) {
      newBadges = [
        ...currentBadges.slice(0, indexOf),
        "",
        ...currentBadges.slice(indexOf + 1),
      ] as Badges;
      newBadges[selectedSlot] = badge;
    } else {
      newBadges = [
        ...currentBadges.slice(0, selectedSlot),
        badge,
        ...currentBadges.slice(selectedSlot + 1),
      ] as Badges;
    }

    setBadges(newBadges);
  };

  // const [selectedCategory, setSelectedCategory] = useState<
  //   keyof typeof badges | ""
  // >("");
  //
  // useEffect(() => {
  //   // Set Scroll To Category
  // });

  useEffect(() => {
    console.log("currentBadges", currentBadges);
  }, [currentBadges]);

  return (
    <div className={"h-full overflow-y-hidden p-2 md:px-8 md:py-4"}>
      <div className={"my-2 flex gap-4"}>
        <div>
          <label className={"mr-2"} onClick={() => setSelectedSlot(0)}>
            <input
              className={"mr-1"}
              type="radio"
              name="badgenum"
              value="1"
              onChange={() => setSelectedSlot(0)}
              checked={selectedSlot === 0}
            />
            <span id="textSlot1">슬롯 1</span>
          </label>
          <button
            className={
              "rounded-md bg-gray-900 px-2 text-sm text-gray-400 hover:text-gray-600"
            }
            onClick={() => {
              setBadges(["", currentBadges[1], currentBadges[2]]);
            }}
          >
            비우기
          </button>
        </div>
        -{" "}
        <div>
          <label className={"mr-2"} onClick={() => setSelectedSlot(1)}>
            <input
              className={"mr-1"}
              type="radio"
              name="badgenum"
              value="2"
              onChange={() => setSelectedSlot(1)}
              checked={selectedSlot === 1}
            />
            <span id="textSlot2">슬롯 2</span>
          </label>
          <button
            className={
              "rounded-md bg-gray-900 px-2 text-sm text-gray-400 hover:text-gray-600"
            }
            onClick={() => {
              setBadges([currentBadges[0], "", currentBadges[2]]);
            }}
          >
            비우기
          </button>
        </div>
        -
        <div>
          <label className={"mr-2"} onClick={() => setSelectedSlot(2)}>
            <input
              className={"mr-1"}
              type="radio"
              name="badgenum"
              value="3"
              onChange={() => setSelectedSlot(2)}
              checked={selectedSlot === 2}
            />
            <span id="textSlot3">슬롯 3</span>
          </label>
          <button
            className={
              "rounded-md bg-gray-900 px-2 text-sm text-gray-400 hover:text-gray-600"
            }
            onClick={() => {
              setBadges([currentBadges[0], currentBadges[1], ""]);
            }}
          >
            비우기
          </button>
        </div>
      </div>
      <div className={"my-4 h-px w-full bg-black/20"}></div>
      <div className="h-full max-h-[calc(100vh-240px)] overflow-y-scroll pr-2 sm:pb-24">
        {Object.entries(badges).map((b) => {
          return (
            <BadgeItems
              key={b[0]}
              name={b[0]}
              items={b[1]}
              onClickBadge={onClickBadge}
            />
          );
        })}
      </div>
    </div>
  );
}

type BadgeItemProps = {
  name: string;
  items: string[];
  onClickBadge: (badge: string) => void;
};

type SectionKeys = keyof (typeof lang)["KRko"]["sections"];

const weaponLevels = ["00", "01", "02", "03", "04", "05", "06"];

function WeaponBadgeItem({
  weaponName,
  onClickBadge,
}: {
  weaponName: string;
  onClickBadge: (badge: string) => void;
}) {
  if (weaponName.includes("Lv01")) {
    return null;
  }
  const [collapsed, setCollapsed] = useState(true);
  const badges = useBadges();

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={clsx("weapon-category", collapsed ? "" : "mb-6")}>
      {/* 헤더 - 무기 이름과 접기/펼치기 버튼 */}
      <div
        className="flex cursor-pointer items-center rounded transition-colors hover:bg-gray-800"
        onClick={onCollapse}
      >
        {collapsed ? (
          <div
            key={weaponName}
            className={clsx("cursor-pointer", {
              "selected box-content rounded-md border-2 border-yellow-400":
                badges.some((badge) => badge === weaponName),
            })}
          >
            <img
              alt={weaponName}
              key={weaponName}
              src={`${baseUrl}/assets/badges/${weaponName}.png`}
              draggable="false"
            />
          </div>
        ) : (
          <EyeIcon />
        )}
      </div>
      <>
        {!collapsed &&
          weaponLevels.map((level) => {
            const badgeName = weaponName.replace("Lv00", `Lv${level}`);
            const isSelected = badges.some((badge) => badge === badgeName);

            return (
              <div
                key={badgeName}
                className={clsx(
                  "cursor-pointer transition-all hover:scale-105",
                  {
                    "selected box-content rounded border-2 border-yellow-400 shadow-lg":
                      isSelected,
                    "rounded border-gray-600 hover:border": !isSelected,
                  },
                )}
                title={`Level ${level}`}
              >
                <img
                  alt={`${weaponName} Level ${level}`}
                  src={`${baseUrl}/assets/badges/${badgeName}.png`}
                  onClick={() => onClickBadge(badgeName)}
                  draggable="false"
                  className="h-auto w-full"
                  onError={(e) => {
                    // 이미지 로드 실패시 플레이스홀더 표시
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            );
          })}
      </>
      <div
        className={clsx("mt-2 grid grid-cols-5 gap-1 sm:grid-cols-10", {
          hidden: collapsed,
        })}
      ></div>
    </div>
  );
}

const BadgeItem = ({
  badgeName,
  onClickBadge,
  isCustom,
}: {
  badgeName: string;
  onClickBadge: (badge: string) => void;
  isCustom: boolean;
}) => {
  const badges = useBadges();
  if (isCustom) return null;

  if (isWeaponLevelItem(badgeName)) {
    return (
      <WeaponBadgeItem onClickBadge={onClickBadge} weaponName={badgeName} />
    );
  }

  return (
    <div
      key={badgeName}
      className={clsx("cursor-pointer", {
        "selected box-content rounded-md border-2 border-yellow-400":
          badges.some((badge) => badge === badgeName),
      })}
    >
      <img
        alt={badgeName}
        key={badgeName}
        onClick={() => onClickBadge(badgeName)}
        src={`${baseUrl}/assets/${
          isCustom ? "custom/" : ""
        }badges/${badgeName}.png`}
        draggable="false"
      />
    </div>
  );
};

const BadgeItems = (props: BadgeItemProps) => {
  const { name, items } = props;
  const [collapsed, setCollapsed] = useState(name.includes("custom"));
  const isCustom = name.includes("custom");

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={clsx("category", collapsed ? "mb-2" : "mb-8")}>
      <div className={"flex cursor-pointer"} onClick={onCollapse}>
        <span id="textBadges">{lang.KRko.sections[defineName(name)]}</span>
        <div className={"ml-1 h-6 w-6 pt-0.5 text-white"}>
          {collapsed ? <EyeSlashIcon /> : <EyeIcon />}
        </div>
      </div>
      <div
        className={clsx(
          "category my-2 grid grid-cols-4 gap-2 sm:grid-cols-8 md:grid-cols-12",
          {
            hidden: collapsed,
          },
        )}
      >
        {items.map((badgeName) => {
          return (
            <BadgeItem
              key={badgeName}
              isCustom={isCustom}
              onClickBadge={props.onClickBadge}
              badgeName={badgeName}
            />
          );
        })}
      </div>
    </div>
  );
};

function isWeaponLevelItem(name: string) {
  return name.startsWith("Badge_WeaponLevel");
}
