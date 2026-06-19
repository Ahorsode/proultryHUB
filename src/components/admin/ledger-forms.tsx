import { addExpenseAction, addPaymentAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form-controls";

const today = new Date().toISOString().slice(0, 10);

export function AddExpenseForm({ projectId }: { projectId: string }) {
  return (
    <form action={addExpenseAction} className="grid gap-3 border-t pt-4">
      <input type="hidden" name="project_id" value={projectId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Description" className="sm:col-span-2">
          <Input name="description" required placeholder="Materials or work completed" />
        </Field>
        <Field label="Amount (GHS)">
          <Input name="amount" type="number" min="0.01" step="0.01" required />
        </Field>
        <Field label="Category">
          <Select name="category" defaultValue="other">
            <option value="carpentry">Carpentry</option>
            <option value="masonry">Masonry</option>
            <option value="electrical">Electrical</option>
            <option value="water_system">Water system</option>
            <option value="other">Other</option>
          </Select>
        </Field>
        <Field label="Date">
          <Input name="date" type="date" defaultValue={today} required />
        </Field>
      </div>
      <Button type="submit" variant="outline" className="justify-self-start">Add expense</Button>
    </form>
  );
}

export function AddPaymentForm({ projectId }: { projectId: string }) {
  return (
    <form action={addPaymentAction} className="grid gap-3 border-t pt-4">
      <input type="hidden" name="project_id" value={projectId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Amount (GHS)">
          <Input name="amount" type="number" min="0.01" step="0.01" required />
        </Field>
        <Field label="Date">
          <Input name="date" type="date" defaultValue={today} required />
        </Field>
        <Field label="Method">
          <Select name="method" defaultValue="bank_transfer">
            <option value="bank_transfer">Bank transfer</option>
            <option value="mobile_money">Mobile money</option>
            <option value="cash">Cash</option>
          </Select>
        </Field>
        <Field label="Note">
          <Input name="note" placeholder="Optional reference" />
        </Field>
      </div>
      <Button type="submit" variant="outline" className="justify-self-start">Add payment</Button>
    </form>
  );
}
