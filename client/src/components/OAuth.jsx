import React from 'react';
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';


function OAuth() {

    const dispatch =useDispatch();
    const navigate=useNavigate();
    const handleGooleclick = async () =>{
        try {
            const provider=new GoogleAuthProvider();
            const auth=getAuth(app);

            const result=await signInWithPopup(auth,provider);
            
            const res=await fetch('/api/auth/google',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
            });
            const data=await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
            
        } catch (error) {
            console.log('could not sign in with google' , error);
        }
    }


    
  return (
    <button onClick={handleGooleclick} type='button' className='p-3 text-white uppercase bg-red-700 rounded-lg hover:opacity-95'>OAuth</button>
  )
}

export default OAuth