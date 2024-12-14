
import AddCircleIcon from '@mui/icons-material/AddCircle';
// import {Button} from "./Button.tsx";

import {ChangeEvent, KeyboardEvent, useState} from "react";
import {TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";

type Props = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = ({addItem, disabled}: Props) => {
    const [title, setTitle] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handlerAddItem = () => {
        if (title.trim() !== '') {
            addItem(title.trim())
            setTitle('')
        } else {
            setError('Title is required')
        }
    }

    const changeItemHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
    }

    const addItemOnKeyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (event.key === 'Enter') {
            handlerAddItem()
        }
    }

    return (
        <div>
            <TextField
                className={error ? 'error' : ''}
                label="New Task"
                variant={"filled"}
                onChange={changeItemHandler}
                onKeyUp={addItemOnKeyUpHandler}
                value={title}
                size={"small"}
                error={!!error}
                helperText={error}
                disabled={disabled}
            />
            <IconButton color={'primary'} onClick={handlerAddItem} disabled={disabled}>
                <AddCircleIcon />
            </IconButton>
        </div>
    );
};
