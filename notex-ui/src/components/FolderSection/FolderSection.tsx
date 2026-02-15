import { Box, Button, Dialog,
DialogActions, DialogContent, DialogTitle,
Divider, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentFolder } from '../../ducks/slice/uiSlice'
import styles from './styles.module.css';
import { selectCurrentFolderId, selectNewFolderCount } from '../../ducks/selector/uiSelector';
import { getRootFolders } from '../../ducks/selector/systemFolderSelector';
import FolderTreeNode from './FolderTreeNode';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import FolderOpenTwoToneIcon from '@mui/icons-material/FolderOpenTwoTone';
import FolderSpecialTwoToneIcon from '@mui/icons-material/FolderSpecialTwoTone';
import { Add } from '@mui/icons-material';
import { createFolder } from '../../ducks/slice/fileSystemSlice';

type Props = {}

type NewFolderDialogProps = {
  open: boolean,
  onClose: any,
  onChange: any,
  value: string,
  confirmClick: any,
}

const NewFolderDialog = ({
  open,
  onClose,
  onChange,
  value,
  confirmClick,

}: NewFolderDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        New Folder
      </DialogTitle>
      <DialogContent
        sx={{ minHeight: "100px", width: "350px" }}
      >
        <TextField
          fullWidth
          size='small'
          id='add-new-folder-text-field'
          onChange={onChange}
          value={value}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={confirmClick} disabled={value.length === 0}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
}

type DefaultFolderButtonCompType = {
  selectedFolder: string | null,
  folderName: string,
  folderId: string,
  onClick: any,
  Icon: any,
}

const DefaultFolderButtons = ({
  selectedFolder,
  folderName,
  folderId,
  onClick,
  Icon,
}: DefaultFolderButtonCompType) => {

  const isSelected = selectedFolder === folderId;
  return (
    <Box
      className={isSelected ? styles.activeFolderButton : styles.folderButton}
      onClick={onClick}
    >
      <Icon fontSize="small" sx={{ mr: 0.5}} />
      <Typography
        variant="body2"
        sx={{
          fontWeight: isSelected ? 500: 400,
        }}
      >
        {folderName}
      </Typography>
    </Box>
  )
}



const FolderSection = (props: Props) => {

  const [openDialog, setDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState<string>("New Folder");

  const dispatch = useDispatch();

  const selectedFolder = useSelector(selectCurrentFolderId);
  const rootFolders = useSelector(getRootFolders);

  const handleButtonClick = (folderName: string | null) => {
    dispatch(setCurrentFolder(folderName))
  };

  const handleClose = () => {
    setDialogOpen(false);
  }

  const handleAddNewFolderClick = () => {
    dispatch(createFolder(newFolderName, null));
    handleClose()
  }

  const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setNewFolderName(e.target.value)
  }

  return (
    <Box className={styles.folderSection}>
      <Typography variant="h6" component="h6"> Folders </Typography>
      <Divider sx={{ my: 0.5}}/>
      <DefaultFolderButtons
        selectedFolder={selectedFolder}
        onClick={() => handleButtonClick("all-notes")}
        folderName="All Notes"
        folderId='all-notes'
        Icon={FolderOpenTwoToneIcon}
      />
      <DefaultFolderButtons
        selectedFolder={selectedFolder}
        onClick={() => handleButtonClick("favorites")}
        folderName="Favorites"
        folderId="favorites"
        Icon={FolderSpecialTwoToneIcon}
      />
      <Divider sx={{ my: 0.5 }}/>
      {
        rootFolders && rootFolders.length > 0 && rootFolders.map((folder) => {
          return (
            <>
              <FolderTreeNode folder={folder} level={0} key={folder.id}/>
              <Divider sx={{ my: 0.5 }} />
            </>
          )
        })
      }
      <DefaultFolderButtons
        folderName="Trash"
        folderId='trash'
        onClick={() => handleButtonClick("trash")}
        selectedFolder={selectedFolder}
        Icon={DeleteTwoToneIcon}
      />
      <Divider sx={{ my: 0.5}} />
      <Box
        className={styles.folderButton}
        onClick={() => setDialogOpen(true)}
      >
        <Add fontSize="small" color="primary" sx={{ mr: 0.5 }}/> New Folder
      </Box>
      <Divider sx={{ my: 0.5}} />
      <NewFolderDialog
        open={openDialog}
        onClose={handleClose}
        confirmClick={handleAddNewFolderClick}
        value={newFolderName}
        onChange={handleFolderNameChange}
      />
    </Box>
  )
}

export default FolderSection