import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React from 'react'

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
          autoFocus
          size='small'
          id='add-new-folder-text-field'
          onChange={onChange}
          value={value}
          slotProps={{
            input: {
              onFocus: (e) => e.target.select(),
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={confirmClick} disabled={value.length === 0}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewFolderDialog