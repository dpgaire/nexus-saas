import { EmptyState } from "@/shared/components/EmptyState";
import { User } from "lucide-react";
import { UserCard } from "./UserCard";
import { UserCardSkeleton } from "./UserCardSkeleton";

export function UsersGrid({
  users,
  isFetching,
  onEditUser,
  onDeleteUser,
  isDeletingUser,
}) {
  const isEmpty = !isFetching && users.length === 0;
  const hasData = !isFetching && users.length > 0;
  return (
    <>
      {isFetching && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isEmpty && (
        <EmptyState
          icon={User}
          title="No users found"
          description="Get started by adding a new user."
        />
      )}

      {hasData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={onEditUser}
              onDelete={onDeleteUser}
              isDeleting={isDeletingUser}
            />
          ))}
        </div>
      )}
    </>
  );
}
