"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/navigation"; // Ensure correct import for Next.js router
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useAuthModal from "@/hooks/useAuthModal";

interface LikedButtonProps {
  songId: string;
}

const LikedButton: React.FC<LikedButtonProps> = ({ songId }) => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient(); // Corrected typo

  const authModal = useAuthModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (!user?.id || !songId) return; // Validate user.id and songId before proceeding
      const { data, error } = await supabaseClient
        .from("liked-songs")
        .select("song_id")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsLiked(!!data);
    };

    fetchLikedSongs();
  }, [songId, supabaseClient, user?.id]); // Corrected useEffect dependencies

  const handleLike = async () => {
    if (!user) {
      authModal.onOpen();
      return;
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from("liked-songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
        toast.success("Song unliked");
      }
    } else {
      const { error } = await supabaseClient
        .from("liked-songs")
        .insert([{ user_id: user.id, song_id: songId }]);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
        toast.success("Song liked");
      }
    }

    router.refresh(); // Optimize by not using router.refresh() and instead relying on state updates to reflect changes
  };

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <button
      onClick={handleLike}
      className="hover:opacity-75 transition"
      aria-label={isLiked ? "Unlike this song" : "Like this song"} // Improve accessibility
    >
      <Icon color={isLiked ? "#22c555" : "white"} size={25} />
    </button>
  );
};

export default LikedButton;
