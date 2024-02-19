"use client";
import { Song } from "@/types";

import React from "react";
import SongItem from "./SongItem";

interface PageContentProps {
  songs: Song[];
}
const PageContent: React.FC<PageContentProps> = ({ songs }) => {
  return (
    <div
      className="
    grid
    grid-cols-2
    sm:grid-cols-3
    md:grid-cols-3
    lg:grid-cols-4
    xl:grid-cols-5
    2xl:grid-cols-8
    gap-4
    mt-4
    "
    >
      {songs.map((song) => (
        <SongItem key={song.id} data={song} onClick={() => {}} />
      ))}
    </div>
  );
};
export default PageContent;
