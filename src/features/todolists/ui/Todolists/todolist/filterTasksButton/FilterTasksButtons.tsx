import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
    changeTodolistFilterAC,
    FilterValuesType,
    TodolistType
} from "../../../../model/reducer/todolists/todolists-reducer.ts";
import {filterButtonsContainerSx} from "./FilterTasksButton.styles.ts";
import {useAppDispatch} from "../../../../../../common/hooks/useAppDispatch.ts";

type Props = {
    todolist: TodolistType
}

export const FilterTasksButtons = ({todolist}: Props) => {
    const {filter, id} = todolist
    const dispatch = useAppDispatch();



    const handlerChangeFilter = (filter: FilterValuesType) => {
        dispatch(changeTodolistFilterAC({id, filter}))
    }

    return (
        <Box sx={filterButtonsContainerSx}>
            <Button
                variant={filter === 'all' ? 'outlined' : 'text'}
                color={'inherit'}
                onClick={() => handlerChangeFilter('all')}
            >
                All
            </Button>
            <Button
                variant={filter === 'active' ? 'outlined' : 'text'}
                color={'primary'}
                onClick={() => handlerChangeFilter('active')}
            >
                Active
            </Button>
            <Button
                variant={filter === 'completed' ? 'outlined' : 'text'}
                color={'secondary'}
                onClick={() => handlerChangeFilter('completed')}
            >
                Completed
            </Button>
        </Box>
    );
};
