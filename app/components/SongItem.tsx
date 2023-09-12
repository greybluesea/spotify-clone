"use client";

import Image from "next/image";
import { Song } from "../../types_incl_stripe";
import useImageUrl from "@/hooks/useImageUrl";
import PlayButton from "./PlayButton";
import LikeButton from "./LikeButton";

interface SongItemProps {
  song: Song;
  handleClick: (song: Song) => void;
}

const SongItem = ({ song, handleClick }: SongItemProps) => {
  const imageUrl = useImageUrl(song);

  return (
    <div
      onClick={() => handleClick(song)}
      className="
        group 
        rounded-md 
        overflow-hidden 
        bg-BGCOLOR-SECONDARY 
        cursor-pointer 
        hover:bg-BGCOLOR-HIGHLIGHT 
        transition 
        duration-200
        p-3
      "
    >
      <div
        className="
          relative
          w-full
          aspect-square
          rounded-md 
          overflow-hidden
        "
      >
        <Image
          className="object-cover"
          src={imageUrl || "/images/music-placeholder.jpg"}
          fill
          alt="Image"
        />
        <div
          className="
          absolute 
          bottom-5
          right-5
        "
        >
          <PlayButton />
        </div>
      </div>
      <div className="flex justify-between space-x-2">
        <div className="py-4 space-y-1 truncate">
          <p className="font-semibold truncate">{song.title}</p>
          <p className="text-NEUTRAL text-sm w-full truncate">
            By {song.author}
          </p>
        </div>
        <LikeButton songId={song.id} />
      </div>
    </div>
  );
};

export default SongItem;
