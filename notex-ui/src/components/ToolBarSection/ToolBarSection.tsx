import { Button, ButtonGroup, Grid, IconButton } from '@mui/material';
import React, { type ElementType } from 'react';
import styles from './styles.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import DrawIcon from '@mui/icons-material/Draw';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useDispatch, useSelector } from 'react-redux';
import { selectCreateNewDialogState, selectCurrentFolderId } from '../../ducks/selector/uiSelector';
import { setCreateNewDialogState } from '../../ducks/slice/uiSlice';

type Props = {
  folderWidth: number,
  resetFolderSidebarWidth: () => void,
}

type StyledGroupButtonProps = {
  name: string;
  Icon: ElementType;
  handleFormatSelection: (name: string) => void;
};

const StyledGroupButton = ({ name, Icon, handleFormatSelection }: StyledGroupButtonProps) => {
  return (
    <Button size="small" variant="text" onClick={() => handleFormatSelection(name)}>
      <Icon sx={{ mr: 1 }} fontSize="small" /> {name}
    </Button>
  )
}

const ToolBarSection = (props: Props) => {
  

  const selectedFolderId = useSelector(selectCurrentFolderId);
  const createNewDialogState = useSelector(selectCreateNewDialogState);
  
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

  const handleFormatSelection = (name: string) => {

  }

  return (
    <Grid container className={styles.toolbarSection}>
      <Grid size={{ md: 1 }}>
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
      </Grid>
      <Grid size={{ md: 10 }} display="flex" alignItems="center" justifyContent="flex-end">
        
      </Grid>
    </Grid>
  )
}

export default ToolBarSection