import { updateProjectStatusAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-controls";
import type { ProjectStatus } from "@/lib/types";

export function ProjectStatusForm({ id, status }: { id: string; status: ProjectStatus }) {
  return (
    <form action={updateProjectStatusAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <Select name="status" defaultValue={status} className="w-40">
        <option value="registered">Registered</option>
        <option value="in_progress">In progress</option>
        <option value="stocked">Stocked</option>
        <option value="complete">Complete</option>
      </Select>
      <Button type="submit" variant="outline">Update</Button>
    </form>
  );
}
