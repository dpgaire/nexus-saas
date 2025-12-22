import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";

export function PageHeader({ addLabel, onCreate, onExport, onImport }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 md:gap-4 mb-4">
      <div className="flex gap-2">
        <Button
          onClick={onExport}
          variant="outline"
          className="border-gray-300 dark:border-gray-600"
        >
          <Upload className="mr-2 h-4 w-4" /> Export
        </Button>

        <Button
          variant="outline"
          asChild
          className="border-gray-300 dark:border-gray-600"
        >
          <label className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4 rotate-180" /> Import
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={onImport}
            />
          </label>
        </Button>
        <Button
          onClick={onCreate}
          className="border-gray-300 dark:border-gray-600"
        >
          <Plus className="mr-2 h-4 w-4" /> Add {addLabel}
        </Button>
      </div>
    </div>
  );
}
