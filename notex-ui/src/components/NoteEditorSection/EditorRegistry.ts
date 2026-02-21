import { Editor } from '@tiptap/react';

export const editorRegistry = new Map<string, Editor>();

export function registerEditor(blockId: string, editor: Editor) {
  editorRegistry.set(blockId, editor);
}

export function getEditor(blockId: string): Editor | undefined {
  return editorRegistry.get(blockId);
}

export function unregisterEditor(blockId: string) {
  editorRegistry.delete(blockId);
}