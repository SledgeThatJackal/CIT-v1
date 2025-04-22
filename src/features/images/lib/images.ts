import { showPromiseToastAndReturnValue } from "@/util/Toasts";

export async function handleImageChange(
  e: React.ChangeEvent<HTMLInputElement>,
  selectedImages: string[],
  onSelectedImageChange: (images: string[]) => void
) {
  if (e.target.files && e.target.files.length > 0) {
    const data = new FormData();
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      data.append("images", files[i]!);
    }

    const promise = (): Promise<{
      message: string;
      images: { id: string; fileName: string }[];
    }> =>
      fetch("/api/image", {
        method: "POST",
        body: data,
      }).then((res) => res.json());

    function addImagesToContainer(data: {
      message: string;
      images: { id: string; fileName: string }[];
    }) {
      const images = data.images;

      if (images.length !== 0) {
        onSelectedImageChange([
          ...new Set(selectedImages.concat(images.map((image) => image.id))),
        ]);
      }
    }

    showPromiseToastAndReturnValue<{
      message: string;
      images: { id: string; fileName: string }[];
    }>(promise, "Attempting to create image(s)", addImagesToContainer);
  }
}
