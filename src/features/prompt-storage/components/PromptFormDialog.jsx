import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { usePromptForm } from "../hooks/usePromptForm.js";
import { AI_CATEGORIES } from "@/shared/constants/aiCategories.js";


export function PromptFormDialog({
  isCreating = false,
  isUpdating = false,
  open,
  onClose,
  onSave,
  editing,
}) {
  const { register, handleSubmit, control } = usePromptForm(editing);

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Prompt" : "Add Prompt"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          {/* Title */}
          <Input {...register("title")} placeholder="Title" />

          {/* AI Category */}
          <Controller
            name="ai_category"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_CATEGORIES.map((ai) => (
                    <SelectItem key={ai.value} value={ai.value}>
                      {ai.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {/* Prompt */}
          <Textarea
            {...register("prompt")}
            placeholder="Write your prompt here..."
            rows={8}
            className="resize-none"
          />

          {/* Submit */}
          <Button type="submit" disabled={isLoading}>
            {isCreating
              ? "Saving..."
              : isUpdating
              ? "Updating..."
              : editing
              ? "Update"
              : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
