import type { Note } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import { FieldInfo } from "@/utils/fieldInfo";
import z from "zod";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { createNote, deleteNote, fetchNotes } from "@/api/notes";

type InitialFormValue = {
  title: string;
  priority: string;
  description: string;
};

const initialValue: InitialFormValue = {
  title: "",
  priority: "Medium",
  description: "",
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

const notesQueryOptions = () =>
  queryOptions({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

export const Route = createFileRoute("/")({
  component: App,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(notesQueryOptions()),
});

function App() {
  const queryClient = useQueryClient();

  // const [notes, setNotes] = useState<Note[]>([]);
  const { data: notes } = useSuspenseQuery(notesQueryOptions());
  // const { mutateAsync: createNoteMutate, isPending } = useMutation({
  //   mutationFn: createNote,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["notes"] });
  //   },
  // });
  // const { mutateAsync: deleteNoteMutate } = useMutation({
  //   mutationFn: (id: string) => deleteNote(id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["notes"] });
  //   },
  // });

  const { mutateAsync: createNoteMutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: (data) => {
      console.log("Note created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Error creating note:", error);
    },
  });

  const { mutateAsync: deleteNoteMutate } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: (data) => {
      console.log("Note deleted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
    },
  });

  const form = useForm({
    defaultValues: initialValue,
    validators: {
      onChange: noteFormSchema,
      onSubmit: noteFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      try {
        await createNoteMutate({ ...value, id: Date.now().toString() });
        form.reset();
      } catch (error) {
        console.error("Failed to create note:", error);
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
          <button type="submit" className="btn-primary mt-4">
            {isPending ? "Adding Note..." : "Add Note"}
          </button>
        </div>
      </form>
      <section className="my-10 max-w-6xl">
        <h1 className="text-2xl font-semibold my-4"> Notes</h1>
        <div className="grid grid-cols-3 gap-4 p-4">
          {notes.map((note) => (
            <div
              className="border-2 p-4 bg-white rounded-md shadow flex flex-col gap-6"
              key={note.id}
            >
              <div className="">
                <h2 className="text-lg font-semibold">{note.title}</h2>
                <p className="font-sm text-indigo-500">{note.priority}</p>
                <p className="mt-2 leading-none">{note.description}</p>
              </div>
              <div className="flex justify-between">
                <button type="button" className="btn-primary">
                  Edit Note
                </button>
                <button
                  onClick={() => deleteNoteMutate(note.id)}
                  className="btn-secondary"
                  type="button"
                >
                  Delete Note
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
