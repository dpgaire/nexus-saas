import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { skillSchema } from "../schema/skill.schema";

export function SkillForm({ onSubmit, initialData, isLoading, submitText }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(skillSchema),
    defaultValues: initialData || {
      title: "",
      icon: "",
      skills: [{ name: "", percentage: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="e.g., Frontend" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon (Optional)</Label>
        <Input
          id="icon"
          placeholder="e.g., <Code />"
          {...register("icon")}
        />
        {errors.icon && (
          <p className="text-sm text-red-600">{errors.icon.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label>Skills</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Skill name (e.g., React)"
                {...register(`skills.${index}.name`)}
              />
            </div>
            <div className="w-24">
              <Input
                type="number"
                placeholder="%"
                {...register(`skills.${index}.percentage`)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: "", percentage: "" })}
        >
          Add Skill
        </Button>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : submitText}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isLoading}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
