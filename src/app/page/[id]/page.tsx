'use client';

import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetchNotes, updateNote, Note } from '@/lib/api';
import NoteEditor from '@/components/NoteEditor';

export default function NotePage() {
  const { id } = useParams();
  const noteId = Array.isArray(id) ? id[0] : id; // normalize to string
  const { token } = useContext(AuthContext);

  const [note, setNote] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token && noteId) loadNote();
  }, [token, noteId]);

  const loadNote = async () => {
    if (!token || !noteId) return;
    try {
      const notes = await fetchNotes(token);
      const currentNote = notes.find((n) => n.id === noteId);
      if (currentNote) setNote(currentNote);
    } catch (err) {
      console.error('Failed to load note', err);
    }
  };

  const handleUpdate = async (content: Record<string, unknown>) => {
    if (!token || !noteId || !note) return;
    setSaving(true);
    try {
      const updatedNote = await updateNote(token, noteId, note.title, content);
      setNote(updatedNote);
    } catch (err) {
      console.error('Failed to save note', err);
    } finally {
      setSaving(false);
    }
  };

  if (!note) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
      <NoteEditor content={note.content} onUpdate={handleUpdate} />
      <p className="text-sm text-gray-500 mt-2">
        {saving ? 'Saving...' : 'All changes saved'}
      </p>
    </div>
  );
}
