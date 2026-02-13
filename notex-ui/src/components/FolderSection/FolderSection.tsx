import { Box, Divider, Typography } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentFolder } from '../../ducks/slice/uiSlice'
import styles from './styles.module.css';
import { selectCurrentFolderId } from '../../ducks/selector/uiSelector';

type Props = {}



const FolderSection = (props: Props) => {

  const dispatch = useDispatch();

  const selectedFolder = useSelector(selectCurrentFolderId);

  const handleButtonClick = (folderName: string | null) => {
    dispatch(setCurrentFolder(folderName))
  };

  return (
    <Box className={styles.folderSection}>
      <Typography variant="h6" component="h6"> Folders </Typography>
      <Divider sx={{ my: 0.5}}/>
      <Box
        className={selectedFolder === "all-notes" ? styles.activeFolderButton : styles.folderButton}
        onClick={() => handleButtonClick("all-notes")}
      >
        All Notes
      </Box>
      <Box
        className={selectedFolder === "favorites" ? styles.activeFolderButton : styles.folderButton}
        onClick={() => handleButtonClick("favorites")}
      >
        Favorites
      </Box>
      <Divider sx={{ my: 0.5 }}/>
    </Box>

  )
}

export default FolderSection