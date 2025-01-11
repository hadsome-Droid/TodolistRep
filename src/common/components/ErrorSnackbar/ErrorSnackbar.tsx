import { SyntheticEvent } from "react"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import { useAppSelector } from "../../../common/hooks/useAppSelector.ts"
import { selectAppError } from "../../../app/appSelectors.ts"
import { useAppDispatch } from "../../../common/hooks/useAppDispatch.ts"
import { setAppError } from "../../../app/appSlice.ts"

export const ErrorSnackbar = () => {
  const error = useAppSelector(selectAppError)
  const dispatch = useAppDispatch()

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    dispatch(setAppError({error: null }))
  }

  return (
    <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
      <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  )
}
