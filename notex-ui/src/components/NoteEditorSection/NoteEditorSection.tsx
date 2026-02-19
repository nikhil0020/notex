import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentNoteId, selectFocusedBlockId } from '../../ducks/selector/uiSelector'
import { selectNoteById, selectBlocksByNote } from '../../ducks/selector/fileSystemSelector'
import { Box, Typography } from '@mui/material'
import styles from './styles.module.css';
import { changeNodeName } from '../../ducks/slice/fileSystemSlice'
import { setFocusedBlock } from '../../ducks/slice/uiSlice'
import TextBlock from './TextBlock'
import HandwritingBlock from './HandwritingBlock'
import type { Block } from '../../ducks/slice/blocksSlice'

type Props = {}

const NoteEditorSection = (props: Props) => {

  const selectedNoteId = useSelector(selectCurrentNoteId);
  const selectedNote = useSelector(selectNoteById(selectedNoteId || ''));
  const focusedBlockId = useSelector(selectFocusedBlockId);
  const blocks = useSelector(selectBlocksByNote(selectedNoteId || ''));
  const [name, setName] = useState(selectedNote ? selectedNote.name : '');

  const dispatch = useDispatch();

  useEffect(() => {
    setName(selectedNote ? selectedNote.name : '');
  }, [selectedNoteId, selectedNote]);

  const handleInput = (e: any) => {
    setName(e.currentTarget.textContent || '');
  };

  const handleBlur = () => {
    if (selectedNote && name !== selectedNote.name) {
      dispatch(changeNodeName({
        id: selectedNoteId || '',
        newName: name
      }));
    }
  };

  const handleBlockFocus = (blockId: string) => {
    dispatch(setFocusedBlock(blockId));
  };

  const renderBlock = (block: Block | undefined) => {
    if (!block) return null;

    const isFocused = focusedBlockId === block.id;

    switch (block.type) {
      case 'text':
        return (
          <TextBlock
            key={block.id}
            block={block}
            isFocused={isFocused}
            onFocus={() => handleBlockFocus(block.id)}
          />
        );
      case 'handwriting':
        return (
          <HandwritingBlock
            key={block.id}
            block={block}
            isFocused={isFocused}
            onFocus={() => handleBlockFocus(block.id)}
          />
        );
      case 'image':
        return (
          <Box key={block.id} className={styles.block}>
            <img 
              src={block.url} 
              alt="Note image" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                borderRadius: '4px'
              }} 
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box className={styles.noteEditorSection}>
      <Typography
        contentEditable={!!selectedNote}
        onInput={handleInput}
        onBlur={handleBlur}
        variant="h6"
        component="h1"
        sx={{ mb: 2 }}
      >
        {selectedNote ? selectedNote.name : 'Select a note to view or edit'}
      </Typography>
      
      {selectedNote && (
        <Box>
          {blocks.map((block) => renderBlock(block))}
          {blocks.length === 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              color: 'text.secondary',
              py: 4,
              px: 2
            }}>
              <Typography variant="body2">
                Click "Text" or "Draw" in the toolbar to add your first block
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default NoteEditorSection