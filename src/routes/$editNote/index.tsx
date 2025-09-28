import { editNote, fetchNote } from "@/api/notes";
import { FieldInfo } from "@/utils/fieldInfo";
import { useForm } from "@tanstack/react-form";
import {
  queryOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

type InitialFormValue = {
  title: string;
  priority: string;
  description: string;
};

const priorityOptions = [
  { name: "High", value: "High" },
  { name: "Medium", value: "Medium" },
  { name: "Low", value: "Low" },
];
const noteFormSchema = z.object({
  title: z.string().min(3, "Title should be at least 3 characters"),
  priority: z.enum(["High", "Medium", "Low"], {
    errorMap: () => ({ message: "Please select a category" }),
  }),

  description: z.string().min(6, "Description should be at least 6 characters"),
});

const noteQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["note", id],
    queryFn: () => fetchNote(id),
  });

export const Route = createFileRoute("/$editNote/")({
  component: EditNotePage,
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(noteQueryOptions(params.editNote)),
});

function EditNotePage() {
  const navigate = useNavigate();

  const { editNote: noteId } = Route.useParams();
  const { data: note } = useSuspenseQuery(noteQueryOptions(noteId));

  const { mutateAsync: updateNote, isPending } = useMutation({
    mutationFn: (updated: InitialFormValue) => editNote(noteId, updated),
    onSuccess: () => {
      navigate({ to: "/" });
    },
  });

  const form = useForm({
    defaultValues: note as InitialFormValue,
    validators: {
      onChange: noteFormSchema,
      onSubmit: noteFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateNote(value);
      } catch (err) {
        console.log(err);
      }
    },
  });
  return (
    <div className="max-w-6xl mx-auto my-6">
      <form
        className="mt-12 px-8 py-8 max-w-3xl mx-auto border-2 shadow rounded-md bg-white"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <h1 className="text-2xl font-semibold my-4">Add Notes</h1>
        <div className="space-y-4">
          <form.Field name="title">
            {(field) => (
              <div>
                <label className="block" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Add title"
                  className="input-field"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </div>
            )}
          </form.Field>
          <form.Field name="priority">
            {(field) => (
              <div>
                <label className="block" htmlFor="priority">
                  Priority
                </label>
                <select
                  name="priority"
                  id="priority"
                  className="border border-gray-400 p-2 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  {priorityOptions.map((option) => (
                    <option key={option.name} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <FieldInfo field={field} />
              </div>
            )}
          </form.Field>
          <form.Field name="description">
            {(field) => (
              <div>
                <label className="block" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Add description"
                  className="input-field"
                  rows={5}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </div>
            )}
          </form.Field>
          <button
            disabled={isPending}
            type="submit"
            className="btn-primary mt-4"
          >
            {isPending ? "Editing..." : "Edit Note"}
          </button>
        </div>
      </form>
    </div>
  );
}
