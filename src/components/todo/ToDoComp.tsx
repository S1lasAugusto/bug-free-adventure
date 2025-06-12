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
} from "lucide-react";

const ToDoComp = () => {
  const ctx = api.useContext();

  const { user, isLoading: authLoading } = useAuth();
  const { register, handleSubmit, reset } = useForm<ToDoForm>();
  const [openAddToDo, setOpenAddToDo] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  if (authLoading) {
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-3/4 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-12 rounded bg-gray-200"></div>
            <div className="h-12 rounded bg-gray-200"></div>
            <div className="h-12 rounded bg-gray-200"></div>
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
      ctx.userRouter.getToDosOnUser.invalidate({ userId: user.id });
    },
  });

  const setCompletedMutation = api.userRouter.setToDoCompleted.useMutation({
    async onMutate(newTodo) {
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
      ctx.userRouter.getToDosOnUser.invalidate({ userId: user.id });
    },
  });

  const deleteTodoMutation = api.userRouter.deleteTodo.useMutation({
    async onMutate(todoId) {
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
      ctx.userRouter.getToDosOnUser.invalidate({ userId: user.id });
    },
  });

  if (isLoading || !isSuccess) {
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-3/4 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-12 rounded bg-gray-200"></div>
            <div className="h-12 rounded bg-gray-200"></div>
            <div className="h-12 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit: SubmitHandler<ToDoForm> = (data: ToDoForm) => {
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
    return date < today && date.toDateString() !== today.toDateString();
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="mb-2 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Task Planner</h2>
        </div>
        <p className="text-sm text-gray-600">
          Organize your assignments and deadlines
        </p>
      </div>

      {/* Error Messages */}
      {(deleteTodoMutation.isError ||
        addToDoMutation.isError ||
        setCompletedMutation.isError) && (
        <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              {deleteTodoMutation.isError && "Failed to delete task"}
              {addToDoMutation.isError && "Failed to add task"}
              {setCompletedMutation.isError && "Failed to complete task"}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-900">
              {activeTodos.length}
            </div>
            <div className="text-sm text-blue-700">Active Tasks</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-900">
              {completedTodos.length}
            </div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
        </div>

        {/* Task List */}
        <div className="mb-6 space-y-3">
          {visibleTodos.length > 0 ? (
            visibleTodos.map((item, index) => (
              <div
                key={item.todoId}
                className={`flex items-center gap-3 rounded-lg border p-4 transition-all hover:shadow-sm ${
                  item.completed
                    ? "border-green-200 bg-green-50"
                    : isOverdue(item.dueDate)
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-white hover:border-blue-200"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => onComplete(item.todoId)}
                  className={`flex-shrink-0 transition-colors ${
                    item.completed
                      ? "text-green-600"
                      : "text-gray-400 hover:text-blue-600"
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>

                {/* Task Content */}
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      item.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {item.name}
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span
                      className={`text-xs ${
                        isOverdue(item.dueDate) && !item.completed
                          ? "font-medium text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {formatDate(item.dueDate)}
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => onDeleteTodo(item.todoId)}
                  className="flex-shrink-0 text-gray-400 transition-colors hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <ClipboardList className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No tasks yet
              </h3>
              <p className="text-gray-600">
                Add your first task to get started!
              </p>
            </div>
          )}
        </div>

        {/* Add New Task */}
        <div className="border-t border-gray-200 pt-4">
          {!openAddToDo ? (
            <button
              onClick={() => setOpenAddToDo(true)}
              className="flex w-full items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-gray-600 transition-colors hover:border-blue-400 hover:text-blue-600"
            >
              <Plus className="h-5 w-5" />
              Add new task
            </button>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Task Name
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter task name..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    {...register("dueDate", { valueAsDate: true })}
                    type="date"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenAddToDo(false);
                    reset();
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Toggle Completed */}
        {completedTodos.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              {showCompleted ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showCompleted ? "Hide" : "Show"} completed tasks (
              {completedTodos.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDoComp;
