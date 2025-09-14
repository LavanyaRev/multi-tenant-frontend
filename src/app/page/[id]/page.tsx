'use client';
import { useState, useEffect, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from '../../../context/AuthContext';
import NoteEditor from '../../../components/NoteEditor';
import { fetchNotes, updateNote, deleteNote } from '../../../lib/api';

export default function NotePage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useContext(AuthContext);

  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return router.push('/login');
    fetchNotes(token).then((data) => {
      const currentNote = data.find((n: any) => n.id === params.id);
      if (!currentNote) return router.push('/dashboard');
      setNote(currentNote);
      setLoading(false);
    });
  }, [token, params.id, router]);

  const handleUpdate = (content: string) => {
    if (!note) return;
    setNote({ ...note, content });
    updateNote(token!, note.id, note.title, content);
  };

  const handleDelete = async () => {
    if (!note) return;
    await deleteNote(token!, note.id);
    router.push('/dashboard');
  };

  if (loading) return <p>Loading...</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <div className="flex p-6">
      <div className="flex-1">
        <input
          className="text-2xl font-bold mb-4 w-full"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          onBlur={() => updateNote(token!, note.id, note.title, note.content)}
        />
        <NoteEditor content={note.content} onUpdate={handleUpdate} />
      </div>
      <button
        onClick={handleDelete}
        className="ml-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete Note
      </button>
    </div>
  );
}
