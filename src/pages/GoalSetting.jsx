import React, { useState } from "react";
import {
  useGetGoalsQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useCreateKeyResultMutation,
  useUpdateKeyResultMutation,
  useDeleteKeyResultMutation,
} from "@/app/services/api";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, Search, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/LoadingSpinner";

const GoalSetting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newObjective, setNewObjective] = useState({
    title: "",
    description: "",
    targetDate: "",
  });
  const [newKeyResults, setNewKeyResults] = useState([
    { title: "", currentValue: 0, targetValue: 100 },
  ]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [isAddObjectiveOpen, setIsAddObjectiveOpen] = useState(false);
  const [isEditObjectiveOpen, setIsEditObjectiveOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);
  const [isEditKeyResultOpen, setIsEditKeyResultOpen] = useState(false);
  const [editingKeyResult, setEditingKeyResult] = useState(null);

  const { data: objectives = [], isLoading } = useGetGoalsQuery();

  const [createGoal, { isLoading: isCreatingGoal }] = useCreateGoalMutation();
  const [updateGoal, { isLoading: isUpdatingGoal }] = useUpdateGoalMutation();
  const [deleteGoal, { isLoading: isDeletingGoal }] = useDeleteGoalMutation();

  const [createKeyResult, { isLoading: isCreatingKeyResult }] = useCreateKeyResultMutation();
  const [updateKeyResult, { isLoading: isUpdatingKeyResult }] = useUpdateKeyResultMutation();
  const [deleteKeyResult, { isLoading: isDeletingKeyResult }] = useDeleteKeyResultMutation();

  const handleAddObjective = async () => {
    if (newObjective.title) {
      try {
        await createGoal(newObjective).unwrap();
        toast.success("Objective created successfully");
        setNewObjective({ title: "", description: "", targetDate: "" });
        setIsAddObjectiveOpen(false);
      } catch (error) {
        toast.error(error.data?.message || "Failed to create objective");
      }
    }
  };

  const handleAddKeyResults = async (objectiveId) => {
    const validKeyResults = newKeyResults.filter(
      (kr) => kr.title.trim() !== ""
    );
    if (validKeyResults.length > 0) {
      try {
        await Promise.all(validKeyResults.map(kr => createKeyResult({ goalId: objectiveId, ...kr }).unwrap()));
        toast.success("Key results created successfully");
        setNewKeyResults([{ title: "", currentValue: 0, targetValue: 100 }]);
        setSelectedObjective(null);
      } catch (error) {
        toast.error(error.data?.message || "Failed to create key results");
      }
    }
  };

  const handleUpdateKeyResult = async () => {
    if (editingKeyResult.title) {
      try {
        await updateKeyResult({
          goalId: editingKeyResult.goalId,
          krId: editingKeyResult.id,
          ...editingKeyResult,
        }).unwrap();
        toast.success("Key result updated successfully");
        setIsEditKeyResultOpen(false);
        setEditingKeyResult(null);
      } catch (error) {
        toast.error(error.data?.message || "Failed to update key result");
      }
    }
  };

  const handleDeleteObjective = async (id) => {
    if (window.confirm("Are you sure you want to delete this objective?")) {
      try {
        await deleteGoal(id).unwrap();
        toast.success("Objective deleted successfully");
      } catch (error) {
        toast.error(error.data?.message || "Failed to delete objective");
      }
    }
  };

  const handleDeleteKeyResult = async (goalId, krId) => {
    if (window.confirm("Are you sure you want to delete this key result?")) {
      try {
        await deleteKeyResult({ goalId, krId }).unwrap();
        toast.success("Key result deleted successfully");
      } catch (error) {
        toast.error(error.data?.message || "Failed to delete key result");
      }
    }
  };

  const filteredObjectives = (objectives || []).filter((obj) =>
    obj.title.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice().reverse();

  const handleUpdateObjective = async () => {
    if (editingObjective.title) {
      try {
        await updateGoal({
          id: editingObjective.id,
          ...editingObjective,
        }).unwrap();
        toast.success("Objective updated successfully");
        setIsEditObjectiveOpen(false);
        setEditingObjective(null);
      } catch (error) {
        toast.error(error.data?.message || "Failed to update objective");
      }
    }
  };

  const handleEditClick = (obj) => {
    setEditingObjective({
      ...obj,
      targetDate: obj.targetDate
        ? new Date(obj.targetDate).toISOString().split("T")[0]
        : "",
    });
    setIsEditObjectiveOpen(true);
  };

  const handleEditKeyResultClick = (kr, goalId) => {
    setEditingKeyResult({ ...kr, goalId });
    setIsEditKeyResultOpen(true);
  };

  const handleNewKeyResultChange = (index, field, value) => {
    const updatedKeyResults = [...newKeyResults];
    updatedKeyResults[index][field] = value;
    setNewKeyResults(updatedKeyResults);
  };

  const addNewKeyResult = () => {
    setNewKeyResults([
      ...newKeyResults,
      { title: "", currentValue: 0, targetValue: 100 },
    ]);
  };

  const removeNewKeyResult = (index) => {
    const updatedKeyResults = [...newKeyResults];
    updatedKeyResults.splice(index, 1);
    setNewKeyResults(updatedKeyResults);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Goal Setting (OKRs)
        </h1>
        <Dialog open={isAddObjectiveOpen} onOpenChange={setIsAddObjectiveOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddObjectiveOpen(true)}>
              <Plus className="mr-2" /> Add Objective
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Objective</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Objective Title"
                value={newObjective.title}
                onChange={(e) =>
                  setNewObjective({ ...newObjective, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Description (supports Markdown)"
                value={newObjective.description}
                onChange={(e) =>
                  setNewObjective({
                    ...newObjective,
                    description: e.target.value,
                  })
                }
              />
              <Input
                type="date"
                value={newObjective.targetDate}
                onChange={(e) =>
                  setNewObjective({
                    ...newObjective,
                    targetDate: e.target.value,
                  })
                }
              />
              <Button
                onClick={handleAddObjective}
                disabled={isCreatingGoal}
              >
                {isCreatingGoal ? "Adding..." : "Add Objective"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search objectives..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredObjectives.map((obj) => (
          <Card key={obj.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                {obj.title}
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(obj)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteObjective(obj.id)}
                    disabled={isDeletingGoal}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <div className="prose dark:prose-invert max-w-none text-sm text-gray-500 dark:text-gray-400">
                <ReactMarkdown>{obj.description}</ReactMarkdown>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Target: {obj.targetDate}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {obj.keyResults.map((kr) => (
                <div key={kr.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{kr.title}</span>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditKeyResultClick(kr, obj.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteKeyResult(
                            obj.id,
                            kr.id
                          )
                        }
                        disabled={isDeletingKeyResult}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {kr.currentValue} / {kr.targetValue}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(kr.currentValue / kr.targetValue) * 100}
                    />
                  </div>
                </div>
              ))}
              <Dialog
                open={selectedObjective}
                onOpenChange={setSelectedObjective}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedObjective(obj.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Key Results
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>New Key Results for "{obj.title}"</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {newKeyResults.map((kr, index) => (
                      <div
                        key={index}
                        className="space-y-2 border p-4 rounded-lg relative"
                      >
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removeNewKeyResult(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Input
                          placeholder="Key Result Title"
                          value={kr.title}
                          onChange={(e) =>
                            handleNewKeyResultChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Current Value"
                          value={kr.currentValue}
                          onChange={(e) =>
                            handleNewKeyResultChange(
                              index,
                              "currentValue",
                              parseInt(e.target.value)
                            )
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Target Value"
                          value={kr.targetValue}
                          onChange={(e) =>
                            handleNewKeyResultChange(
                              index,
                              "targetValue",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </div>
                    ))}
                    <Button variant="outline" onClick={addNewKeyResult}>
                      <Plus className="mr-2 h-4 w-4" /> Add Another
                    </Button>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleAddKeyResults(obj.id)}
                      disabled={isCreatingKeyResult}
                      className="w-fit"
                    >
                      {isCreatingKeyResult
                        ? "Adding..."
                        : "Add Key Results"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Objective Dialog */}
      <Dialog open={isEditObjectiveOpen} onOpenChange={setIsEditObjectiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Objective</DialogTitle>
          </DialogHeader>
          {editingObjective && (
            <div className="space-y-4">
              <Input
                placeholder="Objective Title"
                value={editingObjective.title}
                onChange={(e) =>
                  setEditingObjective({
                    ...editingObjective,
                    title: e.target.value,
                  })
                }
              />
              <Textarea
                placeholder="Description (supports Markdown)"
                value={editingObjective.description}
                onChange={(e) =>
                  setEditingObjective({
                    ...editingObjective,
                    description: e.target.value,
                  })
                }
              />
              <Input
                type="date"
                value={editingObjective.targetDate}
                onChange={(e) =>
                  setEditingObjective({
                    ...editingObjective,
                    targetDate: e.target.value,
                  })
                }
              />
              <Button
                onClick={handleUpdateObjective}
                disabled={isUpdatingGoal}
              >
                {isUpdatingGoal ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Key Result Dialog */}
      <Dialog open={isEditKeyResultOpen} onOpenChange={setIsEditKeyResultOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Key Result</DialogTitle>
          </DialogHeader>
          {editingKeyResult && (
            <div className="space-y-4">
              <Input
                placeholder="Key Result Title"
                value={editingKeyResult.title}
                onChange={(e) =>
                  setEditingKeyResult({
                    ...editingKeyResult,
                    title: e.target.value,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Current Value"
                value={editingKeyResult.currentValue}
                onChange={(e) =>
                  setEditingKeyResult({
                    ...editingKeyResult,
                    currentValue: parseInt(e.target.value),
                  })
                }
              />
              <Input
                type="number"
                placeholder="Target Value"
                value={editingKeyResult.targetValue}
                onChange={(e) =>
                  setEditingKeyResult({
                    ...editingKeyResult,
                    targetValue: parseInt(e.target.value),
                  })
                }
              />
              <Button
                onClick={handleUpdateKeyResult}
                disabled={isUpdatingKeyResult}
              >
                {isUpdatingKeyResult ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalSetting;
