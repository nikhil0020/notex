import React from 'react'
import FolderTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import { Box, Typography } from '@mui/material'
import styles from './styles.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectFolderById } from '../../ducks/selector/fileSystemSelector';
import { selectCurrentNoteId } from '../../ducks/selector/uiSelector';
import { setCurrentNote } from '../../ducks/slice/uiSlice';

type NoteProps = {
  id: string
  title: string
  folderId: string
}

const NoteCard = ({ id, title, folderId} : NoteProps) => {

  const noteFolder = useSelector(selectFolderById(folderId));
  const selectedNote = useSelector(selectCurrentNoteId);

  const dispatch = useDispatch();

  const handleOnClick = () => {
    dispatch(setCurrentNote(id));
  }

  return (
    <Box className={`${styles.noteCard} ${ selectedNote === id ? styles.noteCardActive : ''}`} onClick={handleOnClick}>
      <Typography variant="inherit" sx={{ fontSize: "15px", fontWeight: 600 }} component="h6"> {title} </Typography>
      {/* <Typography variant="caption" component="p">
        { description?.length > 100 ? description.slice(0, 100) + '...' : description}
      </Typography> */}
      <Typography variant="subtitle2" component="p" sx={{ alignItems: "center", display: "flex"}}>
        <FolderTwoToneIcon fontSize="small" sx={{ mr: 0.5 }} /> {noteFolder?.name}
      </Typography>
    </Box>
  )
}

export default NoteCard