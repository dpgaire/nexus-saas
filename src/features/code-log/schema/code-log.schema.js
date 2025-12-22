import * as yup from "yup";

export const codeLogSchema = yup.object({
  title: yup.string().required("Title is required"),
  code: yup.string().required("Code is required"),
});
