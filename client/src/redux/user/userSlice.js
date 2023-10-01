import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error:null,
    loading:null
};


const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInstart: (state) =>{
            state.loading=true;
        },
        signInSuccess: (state,action)=>{
            state.loading=false;
            state.currentUser=action.payload;
            state.error=null;
        },
        signInFailure: (state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        updateUserStart: (state)=>{
            state.loading=true;
        },
        updateUserSuccess: (state,action)=>{
            state.loading=false;
            state.currentUser=action.payload;
            state.error=null;
        },
        updateUserError: (state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        deleteUserStart: (state)=>{
            state.loading=true;
        },
        deleteUserSuccess: (state,action)=>{
            state.loading=false;
            state.currentUser=null;
            state.error=null;
        },
        deleteUserError: (state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
    }
});



export const {signInstart,signInSuccess,signInFailure,updateUserStart,updateUserSuccess,updateUserError,deleteUserStart,deleteUserSuccess,deleteUserError} = userSlice.actions;

export default userSlice.reducer;