import { ChangeEvent, useState } from "react"
import { TextField } from "@mui/material"

interface Props {
  value: string
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const EditableSpan = ({ value, onChange, disabled }: Props) => {
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState(value)

  const activateEditModeHandler = () => {
    if (!disabled) {
      setEditMode(!editMode)
    }
  }

  const deactivateEditModeHandler = () => {
    if (!disabled) {
      setEditMode(!editMode)
      onChange(title)
    }
  }

  const changeTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
  }

  return (
    <>
      {!editMode
        ? (<span onDoubleClick={activateEditModeHandler}>{value}</span>)
        : (
          // <input value={title} autoFocus onBlur={deactivateEditModeHandler} onChange={changeTitleHandler}/>
          <TextField
            variant={"filled"}
            onBlur={deactivateEditModeHandler}
            onChange={changeTitleHandler}
            autoFocus
            value={title}
            size={"small"}
          />
        )
      }
    </>
  )
}
