import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React from 'react'

type Props = {}

type CreateNewDialogProps = {
  title: string,
  open: boolean,
  onClose: any,
  onChange: any,
  value: string,
  confirmClick: any,
  type: "folder" | "note" | null,
}

const CreateNewDialog = ({
  title,
  open,
  onClose,
  onChange,
  value,
  confirmClick,
  type,
}: CreateNewDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent
        sx={{ minHeight: "100px", width: "350px" }}
      >
        <TextField
          fullWidth
          autoFocus
          size="small"
          id='create-new-text-field'
          label={type === "folder" ? "Folder Name" : "Note Title"}
          onChange={onChange}
          variant="standard"
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

export default CreateNewDialog