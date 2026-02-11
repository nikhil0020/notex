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
  let noteEditorMd = 12;
  if (!showFolder && !showNotes) noteEditorMd = 18;
  else if (!showFolder || !showNotes) noteEditorMd = 15;

  return (
    <>
      <Grid container columns={18}>
        <Grid size={{ xs: 18 }}>
          <ToolBarSection
            showFolder={showFolder}
            showNotes={showNotes}
            onCloseFolder={() => setShowFolder(false)}
            onCloseNotes={() => setShowNotes(false)}
          />
        </Grid>
        <Grid container size={{ xs: 18}}>
          {showFolder && (
            <Grid size={{ md: 2 }}>
              <FolderSection />
            </Grid>
          )}
          {showNotes && (
            <Grid size={{ md: 3 }}>
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
