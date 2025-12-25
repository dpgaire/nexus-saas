import * as yup from "yup";

export const quickLinkSchema = yup.object({
  title: yup.string().required("Title is required"),
  link: yup.string().url("Must be a valid URL").required("URL is required"),
});
