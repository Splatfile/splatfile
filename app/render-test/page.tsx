import { RenderTest } from "./RenderTest";

type PageProps = {};

export default function Page(props: PageProps) {
  return (
    <div className={"relative h-24 w-24 bg-white"}>
      {/*<div*/}
      {/*  className={"absolute inset-0 h-12 w-12 bg-white mix-blend-difference"}*/}
      {/*/>*/}
      {/*<div*/}
      {/*  className={*/}
      {/*    "absolute inset-0 h-12 w-12 bg-yellow-500 mix-blend-exclusion"*/}
      {/*  }*/}
      {/*/>*/}
      {/*<div*/}
      {/*  className={"absolute inset-0 h-12 w-12 bg-white mix-blend-exclusion"}*/}
      {/*/>*/}
      {/*<div className={"absolute inset-0 h-12 w-12 mix-blend-color-dodge"}>*/}
      {/*  <img src={"/ingames/weapons/subs/" + "PoisonMist" + ".webp"} alt="" />*/}
      {/*</div>*/}
      {/*<div*/}
      {/*  className={"absolute inset-0 h-24 w-24"}*/}
      {/*  style={{*/}
      {/*    maskSize: "100%",*/}
      {/*    maskImage: 'url("/ingames/weapons/subs/PoisonMist.webp")',*/}
      {/*    maskMode: "luminance",*/}
      {/*    background: "yellow",*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<canvas className={"h-full w-full"} />*/}
      <RenderTest />
    </div>
  );
}
