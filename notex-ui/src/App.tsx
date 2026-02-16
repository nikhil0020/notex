import { Grid } from '@mui/material'
import './App.css'
import React from 'react';
import ToolBarSection from './components/ToolBarSection/ToolBarSection'
import FolderSection from './components/FolderSection/FolderSection'
import NotesSection from './components/NotesSection/NotesSection'
import NoteEditorSection from './components/NoteEditorSection/NoteEditorSection'
import './styles/theme.css';
import { useDispatch, useSelector } from 'react-redux'
import { selectCreateNewDialogState, selectIsFolderSidebarOpen, selectIsNoteEditorOpen } from './ducks/selector/uiSelector'
import { setCreateNewDialogState, toggleFolderSidebar, toggleNotesSidebar } from './ducks/slice/uiSlice'
import CreateNewDialog from './common/CreateNewDialog';
import { createFolder, createNote } from './ducks/slice/fileSystemSlice';

function App() {

  const showFolderSidebar = useSelector(selectIsFolderSidebarOpen);
  const showNotesSidebar = useSelector(selectIsNoteEditorOpen);
  const createNewDialogState = useSelector(selectCreateNewDialogState);

  const dispatch = useDispatch();

  let noteEditorMd = 16;
  if (!showFolderSidebar && !showNotesSidebar) noteEditorMd = 24;
  if (!showFolderSidebar) noteEditorMd += 4;
  if (!showNotesSidebar) noteEditorMd += 4;

  const handleFolderDialogClose = () => {
    dispatch(setCreateNewDialogState({
      open: false,
      title: "",
      value: "",
      parentId: null,
      type: null,
    }));
  }

  const handleCreateFolderConfirmClick = () => {
    if (createNewDialogState.type === "folder") {
      dispatch(createFolder(createNewDialogState.value, createNewDialogState.parentId));
    }

    if (createNewDialogState.type === "note" && createNewDialogState.parentId) {
      dispatch(createNote(createNewDialogState.value, createNewDialogState.parentId));
    }
    handleFolderDialogClose();
  }

  const handleNewFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(setCreateNewDialogState({
      ...createNewDialogState,
      value: e.target.value,
    }))
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
        <CreateNewDialog
          title={createNewDialogState.title}
          open={createNewDialogState.open}
          onChange={handleNewFolderNameChange}
          onClose={handleFolderDialogClose}
          value={createNewDialogState.value}
          confirmClick={handleCreateFolderConfirmClick}
          type={createNewDialogState.type}
        />
      </Grid>
    </>
  )
}

export default App
