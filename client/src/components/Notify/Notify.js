import { toast } from "react-toastify";

export const displaySuccess = (text) => {
    toast.success(text);
};
export const displayError = (text) => {
    toast.error(text);
};
export const displayInfo = (text) => {
    toast.info(text);
};
export const displayWarning = (text) => {
    toast.warning(text);
};