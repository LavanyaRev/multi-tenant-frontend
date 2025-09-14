'use client';

import { useState, useEffect, useContext, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import NoteCard from '@/components/NoteCard';
import { fetchNotes, createNote, upgradeTenant } from '@/lib/api';

// Define a proper Note type
interface Note {
  id: string;
  title: string;
  content?: Record<string, unknown>; // Tiptap JSON content
}

export default function DashboardPage(): JSX.Element {
  const router = useRouter();
  const { token } = useContext(AuthContext);

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tenantIsFree, setTenantIsFree] = useState<boolean>(true); // Assume free plan initially

  // Fetch notes when token is available
  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const loadNotes = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await fetchNotes(token);
        setNotes(data);

        // Update tenant plan status
        setTenantIsFree(data.length >= 3);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    };

    void loadNotes();
  }, [token, router]);

  // Create a new note
  const handleNewNote = async (): Promise<void> => {
    if (!token) return;

    try {
      const note = await createNote(token);
      setNotes((prevNotes) => [note, ...prevNotes]);
      router.push(`/page/${note.id}`);
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  // Upgrade tenant from Free → Pro
  const handleUpgrade = async (): Promise<void> => {
    if (!token) return;

    try {
      await upgradeTenant(token, 'acme'); // Replace with dynamic tenant slug if available
      setTenantIsFree(false);
    } catch (err) {
      console.error('Error upgrading tenant:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        onNewNote={handleNewNote}
        onUpgrade={handleUpgrade}
        tenantIsFree={tenantIsFree}
      />

      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <p className="text-center col-span-full">Loading notes...</p>}

        {!loading && notes.length === 0 && (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-300">
            No notes yet. Create your first note!
          </p>
        )}

        {notes.map((note) => (
          <NoteCard
            key={note.id}
            title={note.title}
            onClick={() => router.push(`/page/${note.id}`)}
          />
        ))}
      </main>
    </div>
  );
}
