import { 
  Button, 
  ButtonGroup, 
  Grid, 
  IconButton, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Divider,
  Tooltip
} from '@mui/material';
import React, { type ElementType, useRef } from 'react';
import styles from './styles.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import DrawIcon from '@mui/icons-material/Draw';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectCreateNewDialogState, 
  selectCurrentFolderId, 
  selectCurrentNoteId,
  selectFocusedBlockId 
} from '../../ducks/selector/uiSelector';
import { setCreateNewDialogState, setFocusedBlock } from '../../ducks/slice/uiSlice';
import { addTextBlock, addHandwritingBlock, addImageBlock } from '../../ducks/slice/blocksSlice';
import { addBlockToNote } from '../../ducks/slice/fileSystemSlice';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const selectedFolderId = useSelector(selectCurrentFolderId);
  const currentNoteId = useSelector(selectCurrentNoteId);
  const focusedBlockId = useSelector(selectFocusedBlockId);
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

  const handleCreateTextBlock = () => {
    if (!currentNoteId) return;
    
    const textBlockAction = addTextBlock(currentNoteId);
    dispatch(textBlockAction);
    dispatch(addBlockToNote({ noteId: currentNoteId, blockId: textBlockAction.payload.id }));
    dispatch(setFocusedBlock(textBlockAction.payload.id));
  }

  const handleCreateHandwritingBlock = () => {
    if (!currentNoteId) return;
    
    const handwritingBlockAction = addHandwritingBlock(currentNoteId);
    dispatch(handwritingBlockAction);
    dispatch(addBlockToNote({ noteId: currentNoteId, blockId: handwritingBlockAction.payload.id }));
    dispatch(setFocusedBlock(handwritingBlockAction.payload.id));
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentNoteId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const imageBlockAction = addImageBlock(currentNoteId, url, img.width, img.height);
        dispatch(imageBlockAction);
        dispatch(addBlockToNote({ noteId: currentNoteId, blockId: imageBlockAction.payload.id }));
        dispatch(setFocusedBlock(imageBlockAction.payload.id));
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleFormat = (format: string, value?: string | number) => {
    if (!focusedBlockId) return;
    
    // Get the Quill instance from the focused block
    // This will be handled by the TextBlock component
    const event = new CustomEvent('quill-format', {
      detail: { format, value }
    });
    window.dispatchEvent(event);
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
        <Tooltip title="New Note">
          <IconButton onClick={handleCreateNewNote}>
            <NoteAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Grid>
      
      <Grid size={{ md: 11 }} display="flex" alignItems="center" gap={1} flexWrap="wrap">
        {/* Block Creation */}
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Add Text Block">
            <Button 
              startIcon={<TextFieldsIcon />}
              onClick={handleCreateTextBlock}
              disabled={!currentNoteId}
            >
              Text
            </Button>
          </Tooltip>
          <Tooltip title="Add Handwriting Block">
            <Button 
              startIcon={<DrawIcon />}
              onClick={handleCreateHandwritingBlock}
              disabled={!currentNoteId}
            >
              Draw
            </Button>
          </Tooltip>
          <Tooltip title="Add Image">
            <Button 
              startIcon={<ImageIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={!currentNoteId}
              component="label"
            >
              Image
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Text Formatting */}
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Bold">
            <IconButton 
              size="small"
              onClick={() => handleFormat('bold')}
              disabled={!focusedBlockId}
            >
              <FormatBoldIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton 
              size="small"
              onClick={() => handleFormat('italic')}
              disabled={!focusedBlockId}
            >
              <FormatItalicIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton 
              size="small"
              onClick={() => handleFormat('underline')}
              disabled={!focusedBlockId}
            >
              <FormatUnderlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        {/* Font Size */}
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Size</InputLabel>
          <Select
            label="Size"
            defaultValue=""
            disabled={!focusedBlockId}
            onChange={(e) => handleFormat('size', e.target.value)}
          >
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="">Normal</MenuItem>
            <MenuItem value="large">Large</MenuItem>
            <MenuItem value="huge">Huge</MenuItem>
          </Select>
        </FormControl>

        {/* Font Family */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Font</InputLabel>
          <Select
            label="Font"
            defaultValue=""
            disabled={!focusedBlockId}
            onChange={(e) => handleFormat('font', e.target.value)}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="arial">Arial</MenuItem>
            <MenuItem value="helvetica">Helvetica</MenuItem>
            <MenuItem value="times">Times New Roman</MenuItem>
            <MenuItem value="courier">Courier New</MenuItem>
            <MenuItem value="verdana">Verdana</MenuItem>
            <MenuItem value="georgia">Georgia</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default ToolBarSection