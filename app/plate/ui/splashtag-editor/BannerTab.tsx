import assets from "../../assets.json";
import langs from "../../lang.json";
import { useState } from "react";
import {
  setBanner,
  setColor,
  setLayers,
  useBanner,
} from "../../lib/store/use-tag-store";
import { clsx } from "clsx";
import {
  Banner,
  BannerItem,
  isBannerItems,
  isSectionType,
  SectionType,
} from "../../lib/types/banner";
import { defineBanners } from "../../lib/define-banner";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { baseUrl } from "../../lib/const";
import { GradientRenderer } from "./banner-tab/GradientRenderer";
import { Lang } from "@/app/lib/types/component-props";
import { getLanguage } from "@/app/plate/ui/SplatPlateEditor";

type BannerTabProps = {
  lang: Lang;
};

export function BannerTab(props: BannerTabProps) {
  const { lang } = props;
  const { banners } = assets;

  const castedBanners = banners as Banner[];
  const definedBanner = defineBanners(castedBanners);

  // const { customBanners } = assets;
  // const castedCustomBanners = customBanners as Banner[];
  // const definedCustomBanner = defineBanners(castedCustomBanners);

  return (
    <div className="h-full max-h-[calc(100vh-240px)] overflow-y-scroll text-white">
      {/*<label className="file">*/}
      {/*  (<span id="textUpload">Upload</span>)*/}
      {/*  <input*/}
      {/*    type="file"*/}
      {/*    id="custombanner"*/}
      {/*    style={{ display: "none" }}*/}
      {/*    multiple*/}
      {/*    accept="image/*"*/}
      {/*  />*/}
      {/*</label>*/}
      <div className="imglistcontainer">
        <div className={"p-2 md:p-8"}>
          {Object.entries(definedBanner).map((b) => {
            if (!isSectionType(b[0])) {
              return null;
            }
            if (!isBannerItems(b[1])) {
              return null;
            }
            return (
              <BannerRenderer key={b[0]} name={b[0]} items={b[1]} lang={lang} />
            );
          })}
          {/*{Object.entries(definedCustomBanner).map((b) => {*/}
          {/*  if (!isSectionType(b[0])) {*/}
          {/*    return null;*/}
          {/*  }*/}
          {/*  if (!isBannerItems(b[1])) {*/}
          {/*    return null;*/}
          {/*  }*/}
          {/*  return <BannerRenderer name={b[0]} items={b[1]} custom={true} />;*/}
          {/*})}*/}
        </div>
      </div>
      <div className="my-8 w-full flex-col items-center justify-center">
        <GradientRenderer />
      </div>
    </div>
  );
}

type BannerRendererProps = {
  name: SectionType;
  custom?: boolean;
  items: BannerItem[];
  lang: Lang;
};

const BannerRenderer = (props: BannerRendererProps) => {
  const { name, items, custom, lang } = props;

  const banner = useBanner();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div
        id={`banner-${name}`}
        onClick={() => {
          setCollapsed(!collapsed);
        }}
        className={clsx("my-2 flex cursor-pointer items-center gap-2", {
          collapsed: collapsed,
        })}
      >
        {langs[getLanguage(lang)].sections[name]}
        <div className={"h-6 w-6 pt-0.5 text-white"}>
          {collapsed ? <EyeSlashIcon /> : <EyeIcon />}
        </div>
      </div>
      <div
        className={clsx("grid grid-cols-2 gap-2 md:grid-cols-4", {
          hidden: collapsed,
        })}
      >
        {items.map((item) => (
          <div
            key={item.file}
            className={clsx("overflow-clip rounded-md", {
              "box-border border border-amber-400": banner === item.file,
            })}
          >
            <img
              key={item.file}
              className={clsx("cursor-pointer")}
              onClick={() => {
                setBanner(item.file);
                setColor("#" + item.colour);
                setLayers(item.layers || 0);
              }}
              loading={"lazy"}
              src={`${baseUrl}/assets/${custom ? "custom/" : ""}banners/${
                item.file
              }.webp`}
              alt={item.colour}
              data-colour={item.colour}
              data-name={item.file}
            />
          </div>
        ))}
      </div>
    </>
  );
};
