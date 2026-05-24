import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TaskPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [columnId, setColumnId] = useState("");

  const fetchTasks = async () => {
    // NOTE: kalau belum ada endpoint list task, nanti kita pakai board detail
    setTasks([]);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async () => {
    await taskService.createTask({
      title,
      columnId,
      order: 0,
    });

    setTitle("");
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Hapus task?");
    if (!confirm) return;

    await taskService.deleteTask(id);
    fetchTasks();
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Task Manager</h1>

      {/* CREATE */}
      <div className="flex gap-2">
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          placeholder="Column ID"
          value={columnId}
          onChange={(e) => setColumnId(e.target.value)}
        />

        <Button onClick={handleCreate}>Create</Button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between p-3 bg-gray-100 rounded"
          >
            <span>{task.title}</span>

            <Button
              variant="destructive"
              onClick={() => handleDelete(task.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}