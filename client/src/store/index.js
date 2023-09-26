import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = { user: {} }

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        set(state, actions) {
        },
        get(state, actions) {
        },
        clear(state, actions) {
        },
    }
})

const store = configureStore({
    reducer:
        userSlice.reducer
})
export const userActions = userSlice.actions;
export default store;