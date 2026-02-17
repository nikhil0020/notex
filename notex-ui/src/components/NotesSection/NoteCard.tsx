import React from 'react'
import FolderTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import { Box, IconButton, Typography } from '@mui/material'
import styles from './styles.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectFolderById } from '../../ducks/selector/fileSystemSelector';
import { selectCurrentNoteId } from '../../ducks/selector/uiSelector';
import { setCurrentNote } from '../../ducks/slice/uiSlice';
import { Favorite } from '@mui/icons-material';
import { toggleFavorite } from '../../ducks/slice/fileSystemSlice';

type NoteProps = {
  id: string
  title: string
  folderId: string
  isFavorite: boolean
}

const NoteCard = ({ id, title, folderId, isFavorite } : NoteProps) => {

  const noteFolder = useSelector(selectFolderById(folderId));
  const selectedNote = useSelector(selectCurrentNoteId);

  const dispatch = useDispatch();

  const handleOnClick = () => {
    dispatch(setCurrentNote(id));
  }

  const handleToogleFavorite = () => {
    dispatch(toggleFavorite(id));
  };

  return (
    <Box className={`${styles.noteCard} ${ selectedNote === id ? styles.noteCardActive : ''}`} onClick={handleOnClick}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Typography variant="subtitle1" component="h6" sx={{ fontWeight: 500, mr: 0.}}>
          {title}
        </Typography>
        <Typography variant="caption" component="p" sx={{ ml: 1, color: 'text.secondary' }}>
          <IconButton
            size="small"
            sx={{ ml: 0.5 }}
            onClick={handleToogleFavorite}
          >
            <Favorite fontSize="small" sx={{ color: isFavorite ? "warning.main" : "text.secondary" }} />
          </IconButton>
        </Typography>
      </Box>
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