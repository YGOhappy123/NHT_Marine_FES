import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import authReducer from '@/slices/authSlice'

const persistConfig = {
    key: 'nht_marine_fes',
    version: 1,
    storage,
    whitelist: ['auth']
}

const combinedReducers = combineReducers({
    auth: authReducer
})

export const store = configureStore({
    reducer: persistReducer(persistConfig, combinedReducers),

    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
    }
})

export type RootState = ReturnType<typeof combinedReducers>
export type AppDispatch = typeof store.dispatch
