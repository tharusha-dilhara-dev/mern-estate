import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';


function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileerrors, setFileErrors] = useState(false);
  const [formdata, setFormData] = useState({});

  //firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  // console.log(formdata);
  // console.log(fileerrors);
  // console.log(filePerc);


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


  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-bold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
        <input type="text" placeholder='username' className='p-3 border rounded-lg' id='username' />
        <input type="email" placeholder='email' className='p-3 border rounded-lg' id='email' />
        <input type="password" placeholder='password' className='p-3 border rounded-lg' id='password' />
        <button className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}

export default Profile