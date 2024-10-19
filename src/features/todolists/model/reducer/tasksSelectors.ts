import {RootState} from "../../../../app/store.ts";

export const selectTasks = (state: RootState) => state.tasks;