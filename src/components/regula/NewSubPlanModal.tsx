import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

interface NewSubPlanModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; topics: string }) => void;
}

export function NewSubPlanModal({
  open,
  onClose,
  onCreate,
}: NewSubPlanModalProps) {
  const [name, setName] = useState("");
  const [topics, setTopics] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onCreate({ name, topics });
      setName("");
      setTopics("");
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <Dialog.Title className="mb-4 text-xl font-bold">
            New Sub-Plan
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter sub-plan name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Topics</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="E.g. Java, OOP, Collections"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !name}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default NewSubPlanModal;
