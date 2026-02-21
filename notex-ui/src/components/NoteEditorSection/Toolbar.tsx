// editor/Toolbar.tsx
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import './EditorStyles.css';
import { useEffect, useState } from "react";

type Props = {
  editor: Editor | null;
};

const Button = ({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`toolbar-btn ${active ? "active" : ""}`}
  >
    {children}
  </button>
);

export default function Toolbar({ editor }: Props) {
  const [, forceUpdate] = useState(0);
  
  useEffect(() => {
    if (!editor) return;
    
    const update = () => {
      forceUpdate(v => v + 1);
    };
    
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;
  
  return (
    <div className="toolbar">
      <Button
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </Button>

      <Button
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </Button>

      <Button
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={16} />
      </Button>

      <Button
        active={editor.isActive("heading", { level: 1 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 size={16} />
      </Button>

      <Button
        active={editor.isActive("heading", { level: 2 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 size={16} />
      </Button>

      <Button
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </Button>

      <Button
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={16} />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={16} />
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={16} />
      </Button>
    </div>
  );
}