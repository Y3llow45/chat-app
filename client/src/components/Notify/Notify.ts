import { toast } from "react-toastify";

export const displaySuccess = (text: String) => {
  toast.success(text);
};
export const displayError = (text: String) => {
  toast.error(text);
};
export const displayInfo = (text: String) => {
  toast.info(text);
};
export const displayWarning = (text: String) => {
  toast.warning(text);
};