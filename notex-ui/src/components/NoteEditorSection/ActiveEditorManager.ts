import { Editor } from "@tiptap/react";

type Listener = () => void;

class ActiveEditorManager {
  private editor: Editor | null = null;
  private blockId: string | null = null;
  private listeners = new Set<Listener>();

  set(editor: Editor | null, blockId: string | null) {
    this.editor = editor;
    this.blockId = blockId;
    this.emit();
  }

  getEditor() {
    return this.editor;
  }

  getBlockId() {
    return this.blockId;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    this.listeners.forEach(l => l());
  }
}

export const activeEditorManager = new ActiveEditorManager();