import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllNotes, selectFavorites, selectTrash, selectChildren } from '../../ducks/selector/fileSystemSelector';
import { selectCurrentFolderId } from '../../ducks/selector/uiSelector';
import { Box, Divider, Typography } from '@mui/material';
import NoteCard from './NoteCard';
import styles from './styles.module.css';

const NotesSection = () => {
  const selectedFolder = useSelector(selectCurrentFolderId);
  // Get notes based on selected folder
  let notes: any = [];
  const allNotes = useSelector(selectAllNotes);
  const favorites = useSelector(selectFavorites);
  const trash = useSelector(selectTrash);

  // For folder children
  const folderNotes = useSelector(
    selectedFolder && !['all-notes', 'favorites', 'trash'].includes(selectedFolder)
      ? selectChildren(selectedFolder, 'note')
      : () => []
  );

  if (selectedFolder === 'all-notes') {
    notes = allNotes;
  } else if (selectedFolder === 'favorites') {
    notes = favorites;
  } else if (selectedFolder === 'trash') {
    notes = trash;
  } else if (selectedFolder) {
    notes = folderNotes;
  }

  return (
    <Box className={styles.noteSection}>
      <Box>
        <Typography variant="h6" component="h6"> Notes </Typography>
      </Box>
      <Divider sx={{ my: 0.5}}/>
      {notes && notes.length > 0 ? (
        notes.map((note: { id: string, name: string, parentId: string }) => (
          <NoteCard
            key={note.id}
            title={note.name}
            folderId={note.parentId || ''}
          />
        ))
      ) : (
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          No notes found.
        </Typography>
      )}
    </Box>
  )
}

export default NotesSection