import { Box, Typography } from '@mui/material'
import React from 'react'
import styles from './styles.module.css';
import FolderTwoToneIcon from '@mui/icons-material/FolderTwoTone';

type NoteProps = {
  title: string;
  description: string;
  folder: string;
}

const NoteCard = ({ title, description, folder} : NoteProps) => {
  return (
    <Box className={styles.noteCard}>
      <Typography variant="body2" component="h6"> {title} </Typography>
      <Typography variant="caption" component="p">
        { description?.length > 100 ? description.slice(0, 100) + '...' : description}
      </Typography>
      <Typography variant="subtitle2" component="p" sx={{ alignItems: "center", display: "flex"}}>
        <FolderTwoToneIcon fontSize="small" sx={{ mr: 0.5 }} /> {folder}
      </Typography>
    </Box>
  )
}

const NotesSection = () => {
  return (
    <Box className={styles.noteSection}>
      <Box>
        <Typography variant="h6" component="h6"> Notes </Typography>
        
      </Box>
      <NoteCard title="My First Note" description="This is the description of my first note." folder="Personal" />
    </Box>
  )
}

export default NotesSection