import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {filterButtonsContainerSx} from "./FilterTasksButton.styles.ts";
import {useAppDispatch} from "../../../../../../common/hooks/useAppDispatch.ts";
import { DomainTodolist } from "../../../../api/todolistsApi.types.ts"
import { todolistsApi } from "../../../../api/todolistsApi.ts"
import { FilterValuesType } from "../../../../lib/types/types.ts"

type Props = {
    todolist: DomainTodolist
}

export const FilterTasksButtons = ({todolist}: Props) => {
    const {filter, id} = todolist
    const dispatch = useAppDispatch();



    const handlerChangeFilter = (filter: FilterValuesType) => {
      dispatch(
        todolistsApi.util.updateQueryData(
          'getTodolists',
          undefined,
          state => {
            const index = state.findIndex(tl => tl.id === id)
            if (index !== -1) {
              state[index].filter = filter
            }
          }
        )
      )
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
