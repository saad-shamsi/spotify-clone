"use client";
import uniqid from "uniqid";
import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
const UploadModal = () => {
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const router = useRouter();
  const { user } = useUser();
  const uploadModal = useUploadModal();
  const supabseClient = useSupabaseClient();
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });
  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };
  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Please fill all the fields.");
        return;
      }

      const uniqID = uniqid();

      // upload songs
      const { data: songData, error: songError } = await supabseClient.storage
        .from("songs")
        .upload(`songs-${values.title}${uniqID}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });
      if (songError) {
        setIsLoading(false);
        return toast.error("Failed song Upload");
      }

      // upload images
      const { data: imageData, error: imageError } = await supabseClient.storage
        .from("images")
        .upload(`image-${values.title}${uniqID}`, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });
      if (imageError) {
        setIsLoading(false);
        return toast.error("Failed image Upload");
      }
      const { error: supabaseError } = await supabseClient
        .from("songs")
        .insert({
          title: values.title,
          user_id: user.id,
          author: values.author,
          image_path: imageData?.path, // Corrected from 'image' to 'image_path'
          song_path: songData?.path, // Ensuring this matches your schema
        });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }
      router.refresh();
      setIsLoading(false);
      toast.success("Song uploaded successfully.");
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error("An error occurred while uploading the song.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      title="Upload a song"
      description="Upload your song to the library."
      isOpen={uploadModal.isOpen}
      onChange={() => {}}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song Title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Song Author"
        />
        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            id="song"
            type="file"
            accept=".mp3"
            disabled={isLoading}
            {...register("song", { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">Select an Image</div>
          <Input
            id="image"
            type="file"
            accept="image/*"
            disabled={isLoading}
            {...register("image", { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
