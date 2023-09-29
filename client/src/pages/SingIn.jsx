import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { signInFailure, signInstart,signInSuccess } from '../redux/user/userSlice';


function SingIn() {
  const [formdata, setFormData] = useState({});
  const {loading,error} =useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //handle set input status
  const handlechange = (e) => {
    setFormData({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  //handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInstart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formdata)
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(data.message));
    }
  };


  console.log(formdata);


  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sing in</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='email' className='p-3 border rounded-lg' id='email' onChange={handlechange} required />
        <input type="password" placeholder='password' className='p-3 border rounded-lg' id='password' onChange={handlechange} required />
        <button disabled={loading} className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign in'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='mt-5 text-red-500' >{error}</p>}
    </div>
  )
}

export default SingIn