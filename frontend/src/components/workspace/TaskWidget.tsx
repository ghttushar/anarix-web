import { useState } from "react";
import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface TaskItem {
  text: string;
  done: boolean;
}

interface TaskWidgetProps {
  config: Record<string, unknown>;
  onConfigChange: (config: Record<string, unknown>) => void;
}

export function TaskWidget({ config, onConfigChange }: TaskWidgetProps) {
  const tasks = (config.tasks as TaskItem[]) || [];
  const [newTask, setNewTask] = useState("");

  const toggleTask = (idx: number) => {
    const updated = tasks.map((t, i) => (i === idx ? { ...t, done: !t.done } : t));
    onConfigChange({ ...config, tasks: updated });
  };

  const addTask = () => {
    if (!newTask.trim() || tasks.length >= 10) return;
    onConfigChange({ ...config, tasks: [...tasks, { text: newTask.trim(), done: false }] });
    setNewTask("");
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex-1 overflow-auto space-y-1.5">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Checkbox
              checked={task.done}
              onCheckedChange={() => toggleTask(idx)}
            />
            <span className={`text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {task.text}
            </span>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">No tasks yet. Add one below.</p>
        )}
      </div>
      {tasks.length < 10 && (
        <div className="flex items-center gap-2 shrink-0">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add task..."
            className="h-8 text-sm"
          />
          <button
            onClick={addTask}
            disabled={!newTask.trim()}
            className="h-8 w-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
