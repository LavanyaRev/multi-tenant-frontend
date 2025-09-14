'use client';
interface NoteCardProps {
  title: string;
  onClick: () => void;
}

export default function NoteCard({ title, onClick }: NoteCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-white dark:bg-gray-700 rounded shadow cursor-pointer hover:shadow-lg transition"
    >
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}
