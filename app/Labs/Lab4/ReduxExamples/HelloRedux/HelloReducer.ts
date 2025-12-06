import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  message: "Hello World from the HelloReducer",
};
const helloSlice = createSlice({
  name: "hello",
  initialState,
  reducers: {},
});
export default helloSlice.reducer;