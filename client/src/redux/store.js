import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import userReduser from './user/userSlice'

export const store = configureStore({
  reducer: {user:userReduser},
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});