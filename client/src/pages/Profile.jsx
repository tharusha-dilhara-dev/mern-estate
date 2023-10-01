import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { deleteUserError, deleteUserStart, deleteUserSuccess, signInFailure, signoutUserSuccess, updateUserError, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';
import { Link } from 'react-router-dom'

function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileerrors, setFileErrors] = useState(false);
  const [formdata, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  //firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  // console.log(formdata);
  // console.log(fileerrors);
  // console.log(filePerc);
  console.log(userListings);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);


  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      //  console.log(progress);
      setFilePerc(progress);
    }, (error) => {
      setFileErrors(true);
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then(
        (downloadURL) => {
          setFormData({ ...formdata, avatar: downloadURL });
        }
      )
    });
  };


  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value });
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formdata)
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(updateUserError(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserError(error.message));
    }
  }


  const handleDleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteUserError(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserError(error.message));
    }
  }


  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  }



  const handleShowListing = async (e) => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      showListingError(true);
    }
  }


  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-bold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="file" name="" id="" ref={fileRef} hidden accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
        <img onClick={() => fileRef.current.click()} src={formdata.avatar || currentUser.avatar} alt="profile" className='self-center object-cover w-24 h-24 rounded-full cursor-pointer' />
        <p className='self-center text-sm'>
          {fileerrors ?
            <span className='text-red-700'>Error Image Upload(image must be less than 2mb)</span> :
            filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePerc}`} </span>
            )
              :
              filePerc === 100 ? (
                <span className='text-green-700'>Image successfully uploaded!</span>
              ) : ('')
          }
        </p>
        <input type="text" defaultValue={currentUser.username} placeholder='username' className='p-3 border rounded-lg' id='username' onChange={handleChange} />
        <input type="email" defaultValue={currentUser.email} placeholder='email' className='p-3 border rounded-lg' id='email' onChange={handleChange} />
        <input type="password" placeholder='password' className='p-3 border rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link className='p-3 text-center text-white uppercase bg-green-700 rounded-lg hover:opacity-95' to='/create-listing' >Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign out</span>
      </div>
      <p className='mt-5 text-red-700'>{error ? error : ''}</p>
      <p className='mt-5 text-green-700'>{updateSuccess ? 'User is Updated successfully!' : ''}</p>
      <button onClick={handleShowListing} className='w-full text-green-700'>Show Listings</button>
      <p className='mt-5 text-red-700'>{showListingError ? 'Error showing listings' : ''}</p>
      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className='text-2xl font-semibold text-center mt-7'>Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='flex items-center justify-between gap-4 p-3 border rounded-lg'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrl[0]}
                  alt='listing cover'
                  className='object-contain w-16 h-16'
                />
              </Link>
              <Link
                className='flex-1 font-semibold truncate text-slate-700 hover:underline'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button onClick={() => handleListingDelete(listing._id)}className='text-red-700 uppercase'>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>}
    </div>
  )
}

export default Profile