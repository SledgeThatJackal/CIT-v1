import { toast, ToasterProps } from "sonner";

type ToastTypes = "success" | "info" | "warning" | "error" | "loading";

type ToasterToast = ToasterProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
};

export function showToast(
  type: ToastTypes,
  title: string,
  description?: string
) {
  toast[type](title, { description });
}

type Toast = Omit<ToasterToast, "id">;

export function showActionToast({
  actionData,
  ...props
}: Omit<Toast, "title" | "description" | "variant"> & {
  actionData: { error?: Error; message?: string };
}) {
  toast(actionData?.error ? "Error" : "Success", {
    ...props,
    description: actionData?.error
      ? actionData.error.message
      : actionData.message,
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

export function showPromiseToastAndReturnValue<T extends { message: string }>(
  promise: () => Promise<T>,
  loading: string,
  returnFunc: (data: T) => void
) {
  toast.promise(promise, {
    loading,
    success: (data: T) => {
      returnFunc(data);

      return data.message;
    },
    error: (error: Error) => {
      return error.message;
    },
  });
}
