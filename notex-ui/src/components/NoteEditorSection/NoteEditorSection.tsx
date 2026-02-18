import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentNoteId } from '../../ducks/selector/uiSelector'
import { selectNoteById } from '../../ducks/selector/fileSystemSelector'
import { Box, Typography } from '@mui/material'
import styles from './styles.module.css';
import { changeNodeName } from '../../ducks/slice/fileSystemSlice'

type Props = {}

const NoteEditorSection = (props: Props) => {

  const selectedNoteId = useSelector(selectCurrentNoteId);
  const selectedNote = useSelector(selectNoteById(selectedNoteId || ''));
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

  return (
    <Box className={styles.noteEditorSection}>
      <Typography
        contentEditable={!!selectedNote}
        onInput={handleInput}
        onBlur={handleBlur}
        variant="h6"
        component="h1"
      >
        {selectedNote ? selectedNote.name : 'Select a note to view or edit'}
      </Typography>
    </Box>
  )
}

export default NoteEditorSection