import { Grid } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectAllNotes } from '../../ducks/selector/systemFolderSelector'

type Props = {}

const AllNotes = (props: Props) => {

  const allNotes = useSelector(selectAllNotes)

  return (
    <Grid container>
      All Notes
    </Grid>
  )
}

export default AllNotes