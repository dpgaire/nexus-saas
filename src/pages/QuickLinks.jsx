import React, { useState } from "react";
import {
  useGetQuickLinksQuery,
  useCreateQuickLinkMutation,
  useUpdateQuickLinkMutation,
  useDeleteQuickLinkMutation,
} from "@/app/services/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash,
  Link as LinkIcon,
  Search,
  Upload,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const QuickLinks = () => {
  const [open, setOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: quickLinks, isLoading } = useGetQuickLinksQuery();
  const [createQuickLink, { isLoading: isCreating }] = useCreateQuickLinkMutation();
  const [updateQuickLink, { isLoading: isUpdating }] = useUpdateQuickLinkMutation();
  const [deleteQuickLink] = useDeleteQuickLinkMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (editingLink) {
        await updateQuickLink({ id: editingLink.id, ...data }).unwrap();
        toast.success("Quick link updated successfully");
      } else {
        await createQuickLink(data).unwrap();
        toast.success("Quick link created successfully");
      }
      setOpen(false);
      setEditingLink(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to save quick link");
    }
  };
  
  const handleDelete = async (id) => {
      try {
          await deleteQuickLink(id).unwrap();
          toast.success("Quick link deleted successfully");
      } catch (error) {
          toast.error(error.data?.message || "Failed to delete quick link");
      }
  }

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(quickLinks, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "quicklinks.json";
    link.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (Array.isArray(importedData)) {
            importedData.forEach(async (link) => {
              try {
                await createQuickLink(link).unwrap();
              } catch (err) {
                 console.error("Error importing a link:", err);
              }
            });
            toast.success("Quick links imported successfully!");
          } else {
            toast.error(
              "Invalid JSON format. Expected an array of quick links."
            );
          }
        } catch (error) {
          toast.error("Error parsing JSON file.", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredQuickLinks = (quickLinks || [])?.filter((link) =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice().reverse();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-2 md:gap-0 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ">Quick Links</h1>
          <p className="mt-2">Create and manage your quick links</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExport}>
            <Upload className="mr-2 h-4 w-4" /> Export JSON
          </Button>
          <Button asChild>
            <label htmlFor="import-json">
              <Upload className="mr-2 h-4 w-4" /> Import JSON
              <input
                type="file"
                id="import-json"
                className="hidden"
                accept=".json"
                onChange={handleImport}
              />
            </label>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingLink(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingLink ? "Edit Link" : "Add New Link"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title">Title</label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingLink?.title || ""}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="link">Link</label>
                  <Input
                    id="link"
                    name="link"
                    defaultValue={editingLink?.link || ""}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (editingLink ? "Updating..." : "Creating...") : (editingLink ? "Update" : "Create")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {filteredQuickLinks?.map((link) => (
              <li
                key={link.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <LinkIcon className="h-5 w-5 text-gray-500" />
                  <div className="flex flex-col min-w-0">
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-500 hover:underline"
                    >
                      {link.title}
                    </a>
                  <p className="text-sm break-words text-gray-500 dark:text-gray-400">
                      {link.link}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingLink(link);
                      setOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(link.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickLinks;
