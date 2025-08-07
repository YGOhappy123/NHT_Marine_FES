import { createSlice } from '@reduxjs/toolkit'
import cookies from '@/libs/cookies'

export interface AuthState {
    isLogged: boolean
    user: IStaff | null
}

const initialState: AuthState = {
    isLogged: false,
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, { payload }: { payload: IStaff }) => {
            state.user = payload
        },
        setLogged: (state, { payload }: { payload: boolean }) => {
            state.isLogged = payload
        },
        signOut: () => {
            cookies.remove('access_token_fes', { path: '/' })
            cookies.remove('refresh_token_fes', { path: '/' })
            return initialState
        }
    }
})

export const { setUser, setLogged, signOut } = authSlice.actions
export default authSlice.reducer
