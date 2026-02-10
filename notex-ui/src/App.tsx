import { Grid } from '@mui/material'
import './App.css'
import ToolBarSection from './components/ToolBarSection/ToolBarSection'
import FolderSection from './components/FolderSection/FolderSection'
import NotesSection from './components/NotesSection/NotesSection'
import NoteEditorSection from './components/NoteEditorSection/NoteEditorSection'
import './styles/theme.css';
import { useState } from 'react'

function App() {
  const [showFolder, setShowFolder] = useState(true);
  const [showNotes, setShowNotes] = useState(true);

  // Calculate NoteEditorSection size
  let noteEditorMd = 8;
  if (!showFolder && !showNotes) noteEditorMd = 12;
  else if (!showFolder || !showNotes) noteEditorMd = 9;

  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12 }}>
          <ToolBarSection
            showFolder={showFolder}
            showNotes={showNotes}
            onCloseFolder={() => setShowFolder(false)}
            onCloseNotes={() => setShowNotes(false)}
          />
        </Grid>
        <Grid container size={{ xs: 12}}>
          {showFolder && (
            <Grid size={{ md: 2 }}>
              <FolderSection />
            </Grid>
          )}
          {showNotes && (
            <Grid size={{ md: 2 }}>
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
