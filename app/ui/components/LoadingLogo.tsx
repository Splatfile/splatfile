type LoadingLogoProps = {};

export function LoadingLogo(props: LoadingLogoProps) {
  return (
    <div className="z-50 flex h-full w-full items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
    </div>
  );
}
