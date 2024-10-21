import { toast } from "react-toastify";

export const displaySuccess = (text: string) => {
  toast.success(text);
};
export const displayError = (text: string) => {
  toast.error(text);
};
export const displayInfo = (text: string) => {
  toast.info(text);
};
export const displayWarning = (text: string) => {
  toast.warning(text);
};
