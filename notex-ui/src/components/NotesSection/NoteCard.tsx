import React from 'react'
import FolderTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import { Box, Typography } from '@mui/material'
import styles from './styles.module.css';
import { useSelector } from 'react-redux';
import { selectFolderById } from '../../ducks/selector/fileSystemSelector';

type NoteProps = {
  title: string;
  folderId: string;
}

const NoteCard = ({ title, folderId} : NoteProps) => {

  const noteFolder = useSelector(selectFolderById(folderId));

  return (
    <Box className={styles.noteCard}>
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