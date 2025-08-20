import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ILogData, AuthState } from '../Interfaces/interfaces'

const userData = localStorage.getItem('user');

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  LogData: userData && userData !== 'undefined' ? JSON.parse(userData) : null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<{ token: string, user: ILogData } | null>) {
      if (action.payload) {
        state.token = action.payload.token
        state.LogData = action.payload.user
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      } else {
        state.token = null
        state.LogData = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
  },
})

export const { setToken } = authSlice.actions
export default authSlice.reducer
