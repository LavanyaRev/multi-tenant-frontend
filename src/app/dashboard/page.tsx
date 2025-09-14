'use client';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import NoteCard from '../../components/NoteCard';
import { fetchNotes, createNote, upgradeTenant } from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { token } = useContext(AuthContext);

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tenantIsFree, setTenantIsFree] = useState(true); // Assume free initially

  useEffect(() => {
    if (!token) return router.push('/auth/login');

    setLoading(true);
    fetchNotes(token)
      .then((data) => {
        setNotes(data);
        if (data.length >= 3) setTenantIsFree(true);
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  const handleNewNote = async () => {
    if (!token) return;
    const note = await createNote(token);
    setNotes((prev) => [note, ...prev]);
    router.push(`/page/${note.id}`);
  };

  const handleUpgrade = async () => {
    if (!token) return;
    await upgradeTenant(token, 'acme'); // Or dynamically determine tenant
    setTenantIsFree(false);
  };

  return (
    <div className="flex">
      <Sidebar onNewNote={handleNewNote} onUpgrade={handleUpgrade} tenantIsFree={tenantIsFree} />
      <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p>Loading...</p>}
        {notes.map((note) => (
          <NoteCard key={note.id} title={note.title} onClick={() => router.push(`/page/${note.id}`)} />
        ))}
      </div>
    </div>
  );
}
