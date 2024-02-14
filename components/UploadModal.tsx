"use client";
import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
const UploadModal = () => {
  const uploadModal = useUploadModal();
  const onChange = (open: boolean) => {
    if (!open) {
      uploadModal.onClose();
    }
  };
  return (
    <Modal
      title="Upload a song"
      description="Upload your song to the library."
      isOpen
      onChange={() => {}}
    >
      Upload contert
    </Modal>
  );
};

export default UploadModal;
