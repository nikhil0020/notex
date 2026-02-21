import { Grid, IconButton } from '@mui/material';
import React from 'react';
import styles from './styles.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useDispatch, useSelector } from 'react-redux';
import { selectCreateNewDialogState, selectCurrentFolderId, selectCurrentNoteId, selectFocusedBlockId } from '../../ducks/selector/uiSelector';
import { setCreateNewDialogState, setFocusedBlock, setSelectedTool } from '../../ducks/slice/uiSlice';
import Toolbar from '../NoteEditorSection/Toolbar';
import { getEditor } from '../NoteEditorSection/EditorRegistry';
import { NotebookPen, Type } from 'lucide-react';
import { addBlockToNote } from '../../ducks/slice/fileSystemSlice';
import { addTextBlock, type BlockType } from '../../ducks/slice/blocksSlice';

type Props = {
  folderWidth: number,
  resetFolderSidebarWidth: () => void,
}

const ToolBarSection = (props: Props) => {
  const selectedFolderId = useSelector(selectCurrentFolderId);
  const createNewDialogState = useSelector(selectCreateNewDialogState);
  const focusedBlockId = useSelector(selectFocusedBlockId);
  const selectedNoteId = useSelector(selectCurrentNoteId);

  const editor = focusedBlockId ? getEditor(focusedBlockId) : null;
  
  const dispatch = useDispatch();

  const handleCreateNewNote = () => {
    let parentId = "notes";
    if (selectedFolderId) {
      parentId = ["notes", "favorites", "all-notes", "trash", null].includes(selectedFolderId) ? "notes" : selectedFolderId;
    }
    dispatch(setCreateNewDialogState({
      title: "New Note",
      open: true,
      type: "note",
      parentId: parentId,
      value: createNewDialogState.value
    }))
  }

  // const handleAddNewBlock = (type: BlockType) => {
  //     if (!selectedNoteId) return;

  //     if (type === "text") {
  //       const textBlockAction = addTextBlock(selectedNoteId);
  //       dispatch(textBlockAction);
  //       dispatch(addBlockToNote({
  //         noteId: selectedNoteId,
  //         blockId: textBlockAction.payload.id,
  //       }));

  //       dispatch(setFocusedBlock(textBlockAction.payload.id));
  //     }

  //     if (type === "draw") {
  //       // TODO
  //     }
  // }

  const handleToolChange = (type: BlockType) => {
    dispatch(setSelectedTool(type));
  }

  return (
    <Grid container className={styles.toolbarSection}>
      <Grid size={{ md: 3 }}>
        {
          props.folderWidth === 0 && (
            <IconButton onClick={() => props.resetFolderSidebarWidth()}>
              <MenuIcon fontSize="small" />
            </IconButton>
          )
        }
        <IconButton
          onClick={handleCreateNewNote}
        >
          <NoteAddIcon fontSize="small" />
        </IconButton>
        {
          selectedNoteId && (
            <>
              <IconButton onClick={() => handleToolChange("text")}>
                <Type size="16" />
              </IconButton>
              <IconButton onClick={() => handleToolChange("draw")}>
                <NotebookPen size="16" />
              </IconButton>
            </>
          )
        }
      </Grid>
      <Grid size={{ md: 9 }} display="flex" alignItems="center" justifyContent="flex-end">
        <Toolbar editor={editor || null} />
      </Grid>
    </Grid>
  )
}

export default ToolBarSection