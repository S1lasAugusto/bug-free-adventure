import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GradeSelection } from "./GradeSelection";

export function GradeDialog({
  open = true,
  onSelect,
}: {
  open?: boolean;
  onSelect?: (grade: string) => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md p-0">
        <GradeSelection onSelect={onSelect ?? (() => {})} />
      </DialogContent>
    </Dialog>
  );
}
