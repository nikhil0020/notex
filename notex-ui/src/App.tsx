import { Grid } from '@mui/material'
import './App.css'
import React from 'react';
import ToolBarSection from './components/ToolBarSection/ToolBarSection'
import FolderSection from './components/FolderSection/FolderSection'
import NotesSection from './components/NotesSection/NotesSection'
import NoteEditorSection from './components/NoteEditorSection/NoteEditorSection'
import './styles/theme.css';
import { useDispatch, useSelector } from 'react-redux'
import { selectIsFolderSidebarOpen, selectIsNoteEditorOpen } from './ducks/selector/uiSelector'
import { toogleFolderSidebar, toogleNotesSidebar } from './ducks/slice/uiSlice'

function App() {

  const showFolderSidebar = useSelector(selectIsFolderSidebarOpen);
  const showNotesSidebar = useSelector(selectIsNoteEditorOpen);

  const dispatch = useDispatch();

  let noteEditorMd = 16;
  if (!showFolderSidebar && !showNotesSidebar) noteEditorMd = 24;
  if (!showFolderSidebar) noteEditorMd += 4;
  if (!showNotesSidebar) noteEditorMd += 4;

  return (
    <>
      <Grid container columns={24}>
        <Grid size={{ xs: 24 }}>
          <ToolBarSection
            showFolderSidebar={showFolderSidebar}
            showNotesSidebar={showNotesSidebar}
            onCloseFolder={() => dispatch(toogleFolderSidebar())}
            onCloseNotes={() => dispatch(toogleNotesSidebar())}
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
      </Grid>
    </>
  )
}

export default App
