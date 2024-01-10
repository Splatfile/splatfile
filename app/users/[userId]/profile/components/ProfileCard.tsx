type ProfileCardProps = {};

export function ProfileCard(props: ProfileCardProps) {
  return (
    <div
      className={
        "flex h-full w-full flex-col items-center justify-center overflow-clip rounded-lg bg-amber-200"
      }
    >
      <div className={"flex w-full items-center justify-center"}>
        <img src="/samples/sample_profile.png" alt="Sample Profile Image" />
      </div>
      <div className={"aspect-[7/2] w-full max-w-full bg-amber-700"}>Plate</div>
    </div>
  );
}
