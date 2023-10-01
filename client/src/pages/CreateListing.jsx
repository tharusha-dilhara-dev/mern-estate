import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'

function CreateListing() {
    const [files, setFiles] = useState({});
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading,setuploading] = useState(false);

    console.log(formData);

    const handleImageSubmit = async (e) => {

        if (files.length > 0 && files.length < 7 + formData.imageUrls.length < 7) {
            setuploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storageImage(files[i]));
            }
            Promise.all(promises).then((url) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(url) });
                setImageUploadError(false);
                setuploading(false);
            }).catch((error) => {
                setImageUploadError('Image upload faild (2 mb max per image)');
                setuploading(false);
            });

        } else {
            setImageUploadError('you can only upload 6 images per listing');
            setuploading(false);
        }
    }


    const storageImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const filename = new Date().getTime() + file.name;
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log('Upload is' + progress + '% done');
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            )
        });
    }


    const handleRemoveImage= (index) => {
        setFormData({
            ...formData,
            imageUrls:formData.imageUrls.filter((_,i) => i !== index),
        })
    }
    return (
        <main className='max-w-4xl p-3 mx-auto'>
            <h1 className='font-serif text-3xl text-center my-7'>Create a Listing</h1>
            <form className='flex flex-col gap-4 sm:flex-row'>
                <div className='flex flex-col flex-1 gap-4'>
                    <input type="text" placeholder='Name' className='p-3 border rounded-lg' id='name' maxLength='62' minLength='10' required />
                    <input type="text" placeholder='Description' className='p-3 border rounded-lg' id='des' required />
                    <input type="text" placeholder='Address' className='p-3 border rounded-lg' id='address' required />
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="sale" className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="rent" className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="parking" className='w-5' />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="rernished" className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="offer" className='w-5' />
                            <span>offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type="number" id="bedrooms" min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id="bathrooms" min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id="regularPrice" min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                <span className='text-xs'>($ / menth)</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id="discountPrice" min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                            <div className='flex flex-col items-center'>
                                <p>discount price</p>
                                <span className='text-xs'>($ / menth)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold '>
                        Images:
                        <span className='ml-2 font-normal text-gray-600'>The first image will be the cover (max 6)</span>
                    </p>
                    <div className='flex gap-4'>
                        <input onChange={(e) => setFiles(e.target.files)} className='w-full p-3 border border-gray-300 rounded' type="file" id="images" accept='image/*' multiple />
                        <button type='button' onClick={handleImageSubmit} className='p-3 text-green-700 uppercase border border-green-700 rounded hover:shadow-lg disabled:opacity-80' disabled={uploading}> {uploading ? 'Uploading...' : 'Upload'}</button>
                    </div>
                    <p className='text-sm text-red-700'>{imageUploadError && imageUploadError}</p>
                        <div className='flex flex-col'>
                            {formData.imageUrls.length > 0 && formData.imageUrls.map((url,index) => (
                                <div key={index} className='flex items-center justify-between'>
                                    <img  src={url} className='object-contain w-[300px] mt-4 rounded-lg' alt='image' />
                                    <button type='button' onClick={() =>handleRemoveImage(index)} className='p-3 text-red-700 uppercase border rounded-lg hover:opacity-95 w-[300px] h-[55px] flex items-center justify-center hover:shadow-lg  border-red-800'>Delete</button>
                                </div>
                            ))}
                        </div>
                    <button className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80'>Create Listing</button>
                </div>


            </form>
        </main>
    )
}

export default CreateListing