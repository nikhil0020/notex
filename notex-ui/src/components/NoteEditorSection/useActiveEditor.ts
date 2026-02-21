import { useEffect, useState } from "react";
import { activeEditorManager } from "./ActiveEditorManager";
import { Editor } from "@tiptap/react";

export function useActiveEditor(): Editor | null {
  const [editor, setEditor] = useState<Editor | null>(
    activeEditorManager.getEditor()
  );

  useEffect(() => {
    const subscribe = activeEditorManager.subscribe(() => {
      setEditor(activeEditorManager.getEditor());
    });
    return () => {
      subscribe();
    };
  }, []);

  return editor;
}