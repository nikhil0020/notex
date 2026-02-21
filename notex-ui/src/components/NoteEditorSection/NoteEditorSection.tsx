import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentNoteId, selectSelectedTool } from '../../ducks/selector/uiSelector'
import { selectNoteById } from '../../ducks/selector/fileSystemSelector'
import { Box } from '@mui/material'
import styles from './styles.module.css';
import { addBlockToNote } from '../../ducks/slice/fileSystemSlice'
import BlockRenderer from './BlockRenderer'
import { addHandwritingBlock, addTextBlock } from '../../ducks/slice/blocksSlice'
import { setFocusedBlock } from '../../ducks/slice/uiSlice'

type Props = {}

const NoteEditorSection = (props: Props) => {

  const selectedNoteId = useSelector(selectCurrentNoteId);
  const selectedNote = useSelector(selectNoteById(selectedNoteId || ''));
  const selectedTool = useSelector(selectSelectedTool);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedNoteId || !selectedNote) return;

    // only react when DRAW selected
    if (selectedTool !== "draw") return;

    const lastBlock = selectedNote.blocks.length > 0 ? selectedNote.blocks[selectedNote.blocks.length - 1] : null;

    // avoid creating multiple draw blocks
    if (lastBlock?.type === "draw") return;

    // create drawing block
    const action = addHandwritingBlock(selectedNoteId);
    dispatch(action);

    dispatch(
      addBlockToNote({
        noteId: selectedNoteId,
        blockId: action.payload.id,
      })
    );

    dispatch(setFocusedBlock(action.payload.id));
  }, [selectedTool]);

  useEffect(() => {
    if (!selectedNote) return;

    if (selectedNote.blockIds.length === 0) {
      const action = addTextBlock(selectedNote.id);
      dispatch(action);

      dispatch(addBlockToNote({
        noteId: selectedNote.id,
        blockId: action.payload.id,
      }));

      dispatch(setFocusedBlock(action.payload.id));
    }
  }, [selectedNoteId, selectedNote]);

  const createTextBlockBelow = () => {
    if (!selectedNoteId || !selectedNote) return;

    const blockIds = selectedNote.blockIds;
    const index = blockIds.length - 1;
    if (index === -1) return;

    const lastBlock = selectedNote.blocks[index];

    if (lastBlock?.type === "text" && lastBlock.content === "") {
      dispatch(setFocusedBlock(lastBlock.id));
      return;
    }

    const action = addTextBlock(selectedNoteId);
    dispatch(action);
    
    const newBlockId = action.payload.id;
    
    dispatch(addBlockToNote({
      noteId: selectedNoteId,
      blockId: newBlockId,
    }));
  };

  return (
    <Box className={styles.noteEditorSection}>
      {
        selectedNote && selectedNote.blockIds.map((blockId) => {
          return <BlockRenderer
                    key={blockId}
                    blockId={blockId}
                  />
        })
      }
      {
        selectedNote && selectedNote.blocks[selectedNote.blocks.length - 1]?.type !== "text" && (
          <div
            className={styles.blockSpacer}
            onClick={() => createTextBlockBelow()}
          />
        )
      }
    </Box>
  )
}

export default NoteEditorSection