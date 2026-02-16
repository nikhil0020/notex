import { Box, Divider, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentFolder, setCreateNewDialogState } from '../../ducks/slice/uiSlice'
import styles from './styles.module.css';
import { selectCreateNewDialogState, selectCurrentFolderId } from '../../ducks/selector/uiSelector';
import { getRootFolders } from '../../ducks/selector/systemFolderSelector';
import FolderTreeNode from './FolderTreeNode';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import FolderOpenTwoToneIcon from '@mui/icons-material/FolderOpenTwoTone';
import FolderSpecialTwoToneIcon from '@mui/icons-material/FolderSpecialTwoTone';
import { Add } from '@mui/icons-material';

type Props = {}

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
  const selectedFolder = useSelector(selectCurrentFolderId);
  const rootFolders = useSelector(getRootFolders);
  const newDialogState = useSelector(selectCreateNewDialogState);
  
  const dispatch = useDispatch();
  const handleButtonClick = (folderName: string | null) => {
    dispatch(setCurrentFolder(folderName))
  };

  const handleAddNewFolderClick = () => {
    dispatch(setCreateNewDialogState({
      title: "New Folder",
      value: newDialogState.value,
      open: true,
      parentId: null,
      type: "folder"
    }))
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
      <DefaultFolderButtons
        selectedFolder={selectedFolder}
        onClick={() => handleButtonClick("notes")}
        folderName="Notes"
        folderId="notes"
        Icon={FolderOpenTwoToneIcon}
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
        onClick={handleAddNewFolderClick}
      >
        <Add fontSize="small" color="primary" sx={{ mr: 0.5 }}/>
        <Typography
            variant="body2"
          >
            Add New Folder
          </Typography>
      </Box>
      <Divider sx={{ my: 0.5}} />
    </Box>
  )
}

export default FolderSection