import { ToDo } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ToDoForm } from "../../server/schema/UserSchema";
import { api } from "../../utils/api";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  CheckCircle2,
  Circle,
  ClipboardList,
  AlertCircle,
  X,
} from "lucide-react";

const ToDoComp = () => {
  const ctx = api.useContext();

  const { user, isLoading: authLoading } = useAuth();
  const { register, handleSubmit, reset } = useForm<ToDoForm>();
  const [openAddToDo, setOpenAddToDo] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  if (authLoading) {
    return (
      <div className="w-full rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-3">
            <div className="h-12 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-12 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-12 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  const {
    data: todo,
    isSuccess,
    isLoading,
  } = api.userRouter.getToDosOnUser.useQuery(
    { userId: user?.id || "" },
    { enabled: !!user }
  );

  const addToDoMutation = api.userRouter.addToDoToUser.useMutation({
    async onMutate(newToDo) {
      await ctx.userRouter.getToDosOnUser.cancel();
      const prevData = ctx.userRouter.getToDosOnUser.getData({
        userId: user?.id || "",
      });
      ctx.userRouter.getToDosOnUser.setData(
        { userId: user?.id || "" },
        (old: any) => [...old, newToDo.toDo]
      );

      return { prevData };
    },
    onSettled() {
      if (user?.id) {
        ctx.userRouter.getToDosOnUser.invalidate({ userId: user.id });
      }
    },
  });

  const setCompletedMutation = api.userRouter.setToDoCompleted.useMutation({
    async onMutate(newTodo) {
      if (!user?.id) return;
      await ctx.userRouter.getToDosOnUser.cancel();
      const prevData = ctx.userRouter.getToDosOnUser.getData({
        userId: user.id,
      });
      ctx.userRouter.getToDosOnUser.setData({ userId: user.id }, (old: any) => {
        const newTodos = old.map((todo: ToDo) => {
          if (todo.todoId === newTodo.todoId) {
            return { ...todo, completed: true };
          }
          return todo;
        });
        return newTodos;
      });

      return { prevData };
    },
    onSettled() {
      if (user?.id) {
        ctx.userRouter.getToDosOnUser.invalidate({ userId: user.id });
      }
    },
  });

  const deleteTodoMutation = api.userRouter.deleteTodo.useMutation({
    async onMutate(todoId) {
      if (!user?.id) return;
      await ctx.userRouter.getToDosOnUser.cancel();
      const prevData = ctx.userRouter.getToDosOnUser.getData({
        userId: user.id,
      });
      ctx.userRouter.getToDosOnUser.setData({ userId: user.id }, (old: any) => {
        const newTodos = old.filter((todo: ToDo) => {
          return todo.todoId !== todoId.todoId;
        });
        return newTodos;
      });
      return { prevData };
    },
    onSettled() {
      if (user?.id) {
        ctx.userRouter.getToDosOnUser.invalidate({ userId: user.id });
      }
    },
  });

  if (isLoading || !isSuccess) {
    return (
      <div className="w-full rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-3">
            <div className="h-12 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-12 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-12 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit: SubmitHandler<ToDoForm> = (data: ToDoForm) => {
    if (!user?.id) return;
    addToDoMutation.mutate(
      {
        toDo: { ...data, userId: user.id },
      },
      {
        onError: () => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "failed to add to do ",
          });
        },
      }
    );
    reset();
    setOpenAddToDo(false);
  };

  const onComplete = (todoId: string) => {
    setCompletedMutation.mutate(
      {
        todoId: todoId,
      },
      {
        onSuccess: () => {
          ctx.invalidate();
        },
        onError: () => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "failed to set todo to completed",
          });
        },
      }
    );
  };

  const onDeleteTodo = (todoId: string) => {
    deleteTodoMutation.mutate(
      {
        todoId: todoId,
      },
      {
        onSuccess: () => {
          ctx.invalidate();
        },
        onError: () => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete todo",
          });
        },
      }
    );
  };

  const activeTodos = todo.filter((t) => !t.completed);
  const completedTodos = todo.filter((t) => t.completed);
  const visibleTodos = showCompleted ? todo : activeTodos;

  const formatDate = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `${diffDays} days`;
  };

  const isOverdue = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const TodoItem = ({ todo }: { todo: ToDo }) => {
    const overdue = isOverdue(new Date(todo.dueDate));

    return (
      <div
        className={`group rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
          todo.completed
            ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
            : overdue
            ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
            : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onComplete(todo.todoId)}
            className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
              todo.completed
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-300 hover:border-green-400 dark:border-gray-600"
            }`}
            disabled={todo.completed}
          >
            {todo.completed && <CheckCircle2 className="h-3 w-3" />}
          </button>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3
                  className={`font-medium ${
                    todo.completed
                      ? "text-gray-500 line-through dark:text-gray-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {todo.name}
                </h3>

                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span
                    className={`${
                      overdue && !todo.completed
                        ? "font-medium text-red-600 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {formatDate(new Date(todo.dueDate))}
                  </span>
                  {overdue && !todo.completed && (
                    <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                      <AlertCircle className="h-3 w-3" />
                      Overdue
                    </span>
                  )}
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => onDeleteTodo(todo.todoId)}
                className="p-1 text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-gray-500 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full rounded-xl bg-white shadow-sm dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Task Planner
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle completed visibility */}
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              {showCompleted ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showCompleted ? "Hide" : "Show"} completed
            </button>

            {/* Add todo button */}
            <button
              onClick={() => setOpenAddToDo(true)}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {activeTodos.length}
            </span>{" "}
            active
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {completedTodos.length}
            </span>{" "}
            completed
          </span>
        </div>
      </div>

      {/* Add Todo Form */}
      {openAddToDo && (
        <div className="border-b border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Add New Task
              </h3>
              <button
                type="button"
                onClick={() => setOpenAddToDo(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task Name
                </label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task name..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date
                </label>
                <input
                  {...register("dueDate", {
                    required: true,
                    valueAsDate: true,
                  })}
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={() => setOpenAddToDo(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Todo List */}
      <div className="p-6">
        {visibleTodos.length === 0 ? (
          <div className="py-12 text-center">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No tasks yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding your first task.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleTodos.map((todoItem) => (
              <TodoItem key={todoItem.todoId} todo={todoItem as ToDo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDoComp;
