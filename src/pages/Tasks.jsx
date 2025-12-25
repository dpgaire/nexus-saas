import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  apiSlice,
} from "../app/services/api";
// import { api } from "../app/services/api";
import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { taskSchema } from "../utils/validationSchemas";
import TaskCard from "@/components/TaskCard";
import { Search } from "lucide-react";

const Tasks = () => {
  const dispatch = useDispatch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { register, handleSubmit, control, reset, setValue } = useForm({
    resolver: yupResolver(taskSchema),
  });

  const { data: tasksData = [], isLoading } = useGetTasksQuery();
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  useEffect(() => {
    if (editingTask) {
      setValue("title", editingTask.title);
      setValue("description", editingTask.description);
      setValue("priority", editingTask.priority);
      setValue("status", editingTask.status);
      setValue(
        "dueDate",
        editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split("T")[0]
          : ""
      );
    }
  }, [editingTask, setValue]);

  const handleCreateTask = async (data) => {
    try {
      await createTask(data).unwrap();
      toast.success("Task created successfully!");
      setIsCreateModalOpen(false);
      reset();
    } catch (error) {
       toast.error(error.data?.message || "Failed to create task");
    }
  };

  const handleEditTask = async (data) => {
     try {
      await updateTask({ id: editingTask.id, ...data }).unwrap();
      toast.success("Task updated successfully!");
      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (error) {
       toast.error(error.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = (id) => {
    setDeleteTaskId(id);
  };

  const confirmDeleteTask = async () => {
    if (!deleteTaskId) return;
    try {
        await deleteTask(deleteTaskId).unwrap();
        toast.success("Task deleted successfully!");
        setDeleteTaskId(null);
    } catch (error) {
        toast.error(error.data?.message || "Failed to delete task");
        setDeleteTaskId(null);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };
  
const onDragEnd = async (result) => {
  const { destination, source, draggableId } = result;

  if (!destination) return;
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }

  const taskId = Number(draggableId);
  const newStatus = destination.droppableId;

  // Find the current task from cached data
  const currentTask = tasksData.find((t) => t.id === taskId);
  if (!currentTask) return;

  // Create full updated task object with only status changed
  const updatedTask = {
    ...currentTask,
    status: newStatus,
  };

  // Optimistic UI update
  const patchResult = dispatch(
    apiSlice.util.updateQueryData("getTasks", undefined, (draft) => {
      const task = draft.find((t) => t.id === taskId);
      if (task) {
        task.status = newStatus;
      }
    })
  );

  try {
    // Send the FULL task object (required for PUT)
    await updateTask({ id: taskId, ...updatedTask }).unwrap();
    toast.success("Task moved successfully");
  } catch (error) {
    patchResult.undo(); // Revert UI on failure
    toast.error(error.data?.message || "Failed to move task");
  }
};

const columns = (tasksData || []).reduce(
  (acc, task) => {
    if (task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
    }
    return acc;
  },
  { todo: [], "in-progress": [], completed: [] }
);

// Reverse each column so the latest tasks are shown first
Object.keys(columns).forEach((key) => {
  columns[key] = columns[key].slice().reverse();
});

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start gap-2 md:gap-0 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your tasks with drag-and-drop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new task</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(handleCreateTask)}
                className="space-y-4"
              >
                <Input {...register("title")} placeholder="Task title" />
                <Textarea
                  {...register("description")}
                  placeholder="Description"
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To-Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input {...register("dueDate")} type="datetime-local" />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <AlertDialog
        open={!!deleteTaskId}
        onOpenChange={() => setDeleteTaskId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              task and remove its data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTaskId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTask}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([columnId, tasks]) => (
            <Card key={columnId}>
              <CardHeader>
                <CardTitle className="capitalize">
                  {columnId.replace("-", " ")}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={
                        "min-h-[200px] p-2 rounded-md transition-colors " +
                        (snapshot.isDraggingOver
                          ? "border-2 border-dashed border-slate-300 bg-blue-900/50"
                          : "border border-transparent")
                      }
                    >
                      {tasks.length === 0 && (
                        <div className="py-8 text-center text-sm text-gray-400">
                          Drop tasks here
                        </div>
                      )}

                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={String(task.id)}
                          index={index}
                        >
                          {(providedDraggable, snapshotDraggable) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              {...providedDraggable.dragHandleProps}
                              className={
                                "mb-3" +
                                (snapshotDraggable.isDragging
                                  ? "opacity-95 shadow-lg"
                                  : "")
                              }
                            >
                              <TaskCard
                                task={task}
                                onEdit={openEditModal}
                                onDelete={handleDeleteTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>
      </DragDropContext>

      {/* Edit Task Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEditTask)} className="space-y-4">
            <Input {...register("title")} placeholder="Task title" />
            <Textarea {...register("description")} placeholder="Description" />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To-Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Input {...register("dueDate")} type="date" />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>{isUpdating ? "Updating..." : "Update"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
