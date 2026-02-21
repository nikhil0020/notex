import React, { useEffect } from 'react'
import { updateTextBlock, type TextBlock } from '../../ducks/slice/blocksSlice'
import { useDispatch, useSelector } from 'react-redux'
import { EditorContent, useEditor } from '@tiptap/react'
import { editorExtensions } from './extensions'
import { setFocusedBlock, setSelectedTool } from '../../ducks/slice/uiSlice'
import { selectFocusedBlockId } from '../../ducks/selector/uiSelector'
import { activeEditorManager } from './ActiveEditorManager'

type Props = {
  block: TextBlock
}

function TextBlockEditor({ block }: Props) {

  const focusedBlockId = useSelector(selectFocusedBlockId);

  const dispatch = useDispatch();

  const editor = useEditor({
    content: block.content,
    extensions: editorExtensions,
    onFocus: () => {
      dispatch(setSelectedTool("text"));
      dispatch(setFocusedBlock(block.id));
      activeEditorManager.set(editor, block.id);
    },

    onUpdate: ({ editor }) => {
      dispatch(updateTextBlock({
        id: block.id,
        content: editor.getHTML(),
      }))
    }
  })

  useEffect(() => {
    if(!editor) return;

    // if nothing focused → focus this block
    if (!focusedBlockId) {
      dispatch(setFocusedBlock(block.id));
      requestAnimationFrame(() => editor.commands.focus());
    } 

    // 🔥 auto focus when block becomes focused
    if (block.id === focusedBlockId) {
      requestAnimationFrame(() => {
        editor.commands.focus("end");
      });
    }

    return () => {
      if (activeEditorManager.getBlockId() === block.id) {
        activeEditorManager.set(null, null);
      }
    }

  }, [editor, focusedBlockId]);

  return (
    <EditorContent editor={editor} />
  )
}

export default TextBlockEditor