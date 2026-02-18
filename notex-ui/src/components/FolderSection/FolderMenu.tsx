import { Menu, MenuItem, Paper } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Add } from '@mui/icons-material'
import { setCreateNewDialogState } from '../../ducks/slice/uiSlice'
import { selectCreateNewDialogState } from '../../ducks/selector/uiSelector'

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

  const newDialogState = useSelector(selectCreateNewDialogState);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleAddNewFolderClick = () => {
    handleClose()
    dispatch(setCreateNewDialogState({
      title: "New Folder",
      value: newDialogState.value,
      open: true,
      parentId: folderId,
      type: "folder"
    }))
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