import * as yup from "yup";

export const skillSchema = yup.object({
  title: yup.string().required("Title is required"),
  icon: yup.string().optional(),
  skills: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("Skill name is required"),
        percentage: yup
          .number()
          .required("Percentage is required")
          .min(0)
          .max(100),
      })
    )
    .optional(),
});
