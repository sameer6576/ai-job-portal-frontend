import { toast } from "sonner";

let lastNotification = { key: "", at: 0 };

const shouldShow = (key) => {
  const now = Date.now();
  if (lastNotification.key === key && now - lastNotification.at < 750) {
    return false;
  }
  lastNotification = { key, at: now };
  return true;
};

export const getApiErrorMessage = (error) => {
  const data = error?.response?.data;
  const apiMessage =
    data?.message?.error ||
    (typeof data?.message === "string" ? data.message : null) ||
    (typeof data?.error === "string" ? data.error : null);

  return (
    apiMessage ||
    error?.message ||
    (typeof error === "string" ? error : null) ||
    "Error"
  );
};

export const notifySuccess = (message) => {
  const description = message || "Operation completed successfully.";
  const key = `success:${description}`;
  if (shouldShow(key)) {
    toast.success("Success", { description });
  }
};

export const notifyError = (error) => {
  const description = getApiErrorMessage(error);
  const key = `error:${description}`;
  if (shouldShow(key)) {
    toast.error("Error", { description });
  }
};
