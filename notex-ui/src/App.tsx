import { Grid } from '@mui/material'
import './App.css'
import React from 'react';
import ToolBarSection from './components/ToolBarSection/ToolBarSection'
import FolderSection from './components/FolderSection/FolderSection'
import NotesSection from './components/NotesSection/NotesSection'
import NoteEditorSection from './components/NoteEditorSection/NoteEditorSection'
import './styles/theme.css';
import { useDispatch, useSelector } from 'react-redux'
import { selectFolderDialogOpen, selectIsFolderSidebarOpen, selectIsNoteEditorOpen, selectNewFolderName } from './ducks/selector/uiSelector'
import { setFolderDialogState, setNewFolderName, toggleFolderSidebar, toggleNotesSidebar } from './ducks/slice/uiSlice'
import { createFolder } from './ducks/slice/fileSystemSlice';
import NewFolderDialog from './components/FolderSection/NewFolderDialog';

function App() {

  const showFolderSidebar = useSelector(selectIsFolderSidebarOpen);
  const showNotesSidebar = useSelector(selectIsNoteEditorOpen);
  const folderDialogState = useSelector(selectFolderDialogOpen);
  const newFolderName = useSelector(selectNewFolderName);

  const dispatch = useDispatch();

  let noteEditorMd = 16;
  if (!showFolderSidebar && !showNotesSidebar) noteEditorMd = 24;
  if (!showFolderSidebar) noteEditorMd += 4;
  if (!showNotesSidebar) noteEditorMd += 4;

  const handleFolderDialogClose = () => {
    dispatch(setNewFolderName("New Folder"));
    dispatch(setFolderDialogState({
      open: false,
      parentId: null,
    }));
  }

  const handleAddNewFolderClick = () => {
    dispatch(createFolder(newFolderName, folderDialogState.parentId));
    handleFolderDialogClose();
  }

  const handleNewFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(setNewFolderName(e.target.value))
  }

  return (
    <>
      <Grid container columns={24}>
        <Grid size={{ xs: 24 }}>
          <ToolBarSection
            showFolderSidebar={showFolderSidebar}
            showNotesSidebar={showNotesSidebar}
            onCloseFolder={() => dispatch(toggleFolderSidebar())}
            onCloseNotes={() => dispatch(toggleNotesSidebar())}
          />
        </Grid>
        <Grid container size={{ xs: 24}}>
          {showFolderSidebar && (
            <Grid size={{ md: 4 }}>
              <FolderSection />
            </Grid>
          )}
          {showNotesSidebar && (
            <Grid size={{ md: 4 }}>
              <NotesSection />
            </Grid>
          )}
          <Grid size={{ md: noteEditorMd }}>
            <NoteEditorSection />
          </Grid>
        </Grid>
        <NewFolderDialog
          open={folderDialogState.open}
          onChange={handleNewFolderNameChange}
          onClose={handleFolderDialogClose}
          value={newFolderName}
          confirmClick={handleAddNewFolderClick}
        />
      </Grid>
    </>
  )
}

export default App
