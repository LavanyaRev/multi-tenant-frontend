'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface NoteEditorProps {
  content: string;
  onUpdate: (content: string) => void;
}

export default function NoteEditor({ content, onUpdate }: NoteEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  useEffect(() => {
    editor?.commands.setContent(content);
  }, [content, editor]);

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
