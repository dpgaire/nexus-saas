import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Edit, Mail, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmAlertDialog } from "@/shared/components/ConfirmAlertDialog";

const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function UserCard({ user, onEdit, onDelete, isDeleting }) {
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    await onDelete(userToDelete.id);
    setUserToDelete(null);
  };

  return (
    <>
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
        )}
      >
        {/* Main Content */}
        <CardContent className="p-6 pt-12 text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-white dark:ring-gray-800 shadow-lg">
            <AvatarImage src={user.image} />
            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-purple-600 text-white">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>

          {/* Full Name */}
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
            {user.fullName}
          </h3>

          {/* Email */}
          <div className="flex items-center justify-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate max-w-[180px]">{user.email}</span>
          </div>

          {/* ✅ Role */}
          <div
            className={cn(
              "mt-2 inline-block px-3 py-1 text-xs font-medium rounded-full",
              user.role === "superAdmin"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                : user.role === "Admin"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            )}
          >
            {user.role}
          </div>
        </CardContent>
        <div className="absolute top-3 right-3 z-10 flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(user)}
            className="text-red-600 hover:text-red-700"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
      {userToDelete && (
        <ConfirmAlertDialog
          open={!!userToDelete}
          onCancel={() => setUserToDelete(null)}
          title={`Delete user "${userToDelete?.fullName}"?`}
          description="This action cannot be undone."
          onConfirm={confirmDelete}
          isLoading={isDeleting}
          loadingText="Deleting..."
          confirmText="Delete"
        />
      )}
    </>
  );
}
