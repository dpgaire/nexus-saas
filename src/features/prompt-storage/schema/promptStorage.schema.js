import * as yup from "yup";

export const promptStorageSchema = yup.object({
  title: yup.string().required(),
  ai_category: yup.string().required(),
  prompt: yup.string().required(),
});
