import {ChangeEvent, useState} from "react";
import {TextField} from "@mui/material";

interface Props {
    value: string
    onChange: (value: string) => void;
}

export const EditableSpan = ({value, onChange}: Props) => {
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState(value)

    const activateEditModeHandler = () => {
        setEditMode(!editMode)
    }

    const deactivateEditModeHandler = () => {
        setEditMode(!editMode)
        onChange(title)
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
};
