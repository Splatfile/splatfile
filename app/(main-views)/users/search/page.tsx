import { SplatfileAdmin } from "@/app/lib/server/splatfile-server";
import { SearchResult } from "@/app/(main-views)/users/search/components/SearchResult";

type PageProps = {
  searchParams: {
    q: string;
  };
};

export default async function Page(props: PageProps) {
  const admin = new SplatfileAdmin("SERVER_COMPONENT");
  if (!props.searchParams.q) {
    return (
      <SearchResult query={props.searchParams.q} profiles={[]}></SearchResult>
    );
  }
  const profiles = await admin.searchProfiles(props.searchParams.q);

  return <SearchResult query={props.searchParams.q} profiles={profiles} />;
}
