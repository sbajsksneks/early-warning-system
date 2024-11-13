import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  datapantau : 1
}

export const counterSlice = createSlice({
  name: 'dataweb',
  initialState,
  reducers: {
    cleanDatas: (state) => {
      state.datapantau = null;
    },
    setDatas: (state, property) => {
      state.datapantau = property.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { cleanDatas, setDatas } = counterSlice.actions

export default counterSlice.reducer;