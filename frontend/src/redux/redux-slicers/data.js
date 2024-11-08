import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  datas : []
}

export const counterSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    cleanDatas: (state) => {
      state.datas = [];
    },
    setDatas: (state, property) => {
      state.datas += property.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { cleanDatas, setDatas } = counterSlice.actions

export default counterSlice.reducer;