import * as yup from "yup";

export const librarySchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  url: yup.string().url("Must be a valid URL").required("PDF URL is required"),
  author: yup.string().optional(),
  coverImage: yup.string().url("Must be a valid URL").optional(),
});
