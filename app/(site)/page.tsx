import getAllSongs from "@/actions/getAllSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import PageContent from "@/components/PageContent";
import Image from "next/image";

export const revalidate = 0;

export default async function Home() {
  const songs = await getAllSongs();
  return (
    <main className="p-6 space-y-4">
      <p className="text-3xl">All songs</p>
      {/* <ListItem /> */}
      <PageContent songs={songs} />
    </main>
  );
}
