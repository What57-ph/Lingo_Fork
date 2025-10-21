import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addAnswer, addMultipleAnswers, deleteAnswer, getAllAnswers, getOneAnswer, updateAnswer, updateResource } from "../service/TestService";


const initialState = [];

export const modifyResourceContent = createAsyncThunk(
    "resource/update",
    async ({ id, resource }) => {
        return await updateResource(id, resource);
    }
)

const resourceSlice = createSlice({
    name: "resource",
    initialState,
    reducers: {

        [modifyResourceContent.fulfilled]: (state, action) => {
            const index = state.findIndex(resource => resource.id === action.payload.id);
            state[index] = {
                ...state[index],
                ...action.payload
            };
        },
    }
})

const { reducer } = resourceSlice;
export default reducer;