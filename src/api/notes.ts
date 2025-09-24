import api from "@/lib/axios";
import type { Note } from "@/types";

export const fetchNotes = async (): Promise<Note[]> => {
  const res = await api.get("/notes");
  return res.data;
};

export const fetchNote = async (id: string): Promise<Note> => {
  const res = await api.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (newNote: {
  id: string;
  title: string;
  priority: string;
  description: string;
}): Promise<Note> => {
  const res = await api.post("/notes", {
    ...newNote,
    createdAt: new Date().toISOString(),
  });
  return res.data;
};

export const deleteNote = async (noteId: string) => {
  await api.delete(`/notes/${noteId}`);
};

export const editNote = async (
  noteId: string,
  updatedNote: {
    title: string;
    priority: string;
    description: string;
    createdAt?: string;
  }
): Promise<Note> => {
  const res = await api.put(`/notes/${noteId}`, updatedNote);
  return res.data;
};
