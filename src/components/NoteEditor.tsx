'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface NoteEditorProps {
  content?: Record<string, unknown>; // Tiptap JSON
  onUpdate: (content: Record<string, unknown>) => void;
}

export default function NoteEditor({ content, onUpdate }: NoteEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content ?? {}, // fallback to empty object for Tiptap JSON
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
  });

  // Sync content updates if prop changes
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-300 rounded p-4 min-h-[300px] dark:border-gray-600 dark:bg-gray-800">
      <EditorContent editor={editor} />
    </div>
  );
}
