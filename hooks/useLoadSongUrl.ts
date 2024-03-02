import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadSongUrl = async (song: Song) => {
  const supabaseClient = useSupabaseClient();

  if (!song) {
    return "";
  }
  const { data: songData } = await supabaseClient.storage
    .from("songs")
    .getPublicUrl(song.song_path);

  return songData.publicUrl;
};

export default useLoadSongUrl;
