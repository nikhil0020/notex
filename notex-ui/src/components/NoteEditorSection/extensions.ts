// editor/extensions.ts
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

export const editorExtensions = [
  StarterKit,
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];