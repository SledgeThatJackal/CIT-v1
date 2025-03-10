import { toast } from "sonner";

type ToastTypes = "success" | "info" | "warning" | "error" | "loading";

export function showToast(
  type: ToastTypes,
  title: string,
  description?: string
) {
  toast[type](title, { description });
}

export function showActionToast(
  title: string,
  label: string,
  onClick: () => void,
  description?: string
) {
  toast(title, {
    description,
    action: {
      label,
      onClick,
    },
  });
}

export function showPromiseToast<T extends { message: string }>(
  promise: () => Promise<T>,
  loading: string,
  func?: () => void
) {
  toast.promise(promise, {
    loading,
    success: (data: T) => {
      func?.();
      return data.message;
    },
    error: (error: Error) => {
      return error.message;
    },
  });
}
