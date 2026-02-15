import { Menu, MenuItem, Paper } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createFolder } from '../../ducks/slice/fileSystemSlice'
import { Add } from '@mui/icons-material'
import { setFolderDialogState } from '../../ducks/slice/uiSlice'

type Props = {
  folderId: string,
  anchorEl: any,
  setAnchorEl: any,
}

const FolderMenu = ({
  folderId,
  anchorEl,
  setAnchorEl
}: Props) => {

  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleAddNewFolderClick = () => {
    dispatch(setFolderDialogState({ open: true, parentId: folderId }))
    handleClose()
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      <Paper elevation={0} sx={{ width: 200 }}>
        <MenuItem
          onClick={handleAddNewFolderClick}
          dense
          >
          <Add fontSize='small' sx={{ mr: 1 }} />
          Add New Folder
        </MenuItem>
      </Paper>
    </Menu>
  )
}

export default FolderMenu