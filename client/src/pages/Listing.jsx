import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';


import SimpleImageSlider from "react-simple-image-slider";


import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,

    FaShare,
} from 'react-icons/fa';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [width, setWidth] = useState(window.innerWidth);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();
    const [copied, setCopied] = useState(false);

    const [contact, setContact] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                console.log(data);
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);
    console.log(loading);


    // Update the width when the window is resized
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    // Add an event listener to listen for window resize
    window.addEventListener('resize', handleResize);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


    return (
        <main>
            {loading && <p className='text-2xl text-center my-7'>Loading...</p>}
            {error && (
                <p className='text-2xl text-center my-7'>Something went wrong!</p>
            )}
            {listing && !loading && !error && (
                <div>
                    {/* <Swiper navigation>
                        {listing.imageUrl.map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    className='h-[550px]'
                                    style={{
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: 'cover',
                                        background: 'gray'
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper> */}
                    {/* {listing.imageUrl.map((url) => (
                        <img src={url} alt="" />
                    ))} */}

                    <div className='flex items-center justify-center'>
                    <SimpleImageSlider 
                        width={width}
                        height={304}
                        images={listing.imageUrl}
                        showBullets={true}
                        showNavs={true}
                    />
                    </div>

                    
                    <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                        <FaShare
                            className='text-slate-500'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>
                    {copied && (
                        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                            Link copied!
                        </p>
                    )}
                    <div className='flex flex-col max-w-4xl gap-4 p-3 mx-auto my-7'>
                        <p className='text-2xl font-semibold'>
                            {listing.name} - ${' '}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString('en-US')
                                : listing.regulerPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className='flex items-center gap-2 mt-6 text-sm text-slate-600'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </p>
                        <div className='flex gap-4'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (
                                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                    ${+listing.regulerPrice - +listing.discountPrice} OFF
                                </p>
                            )}
                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listing.des}
                        </p>
                        <ul className='flex flex-wrap items-center gap-4 text-sm font-semibold text-green-900 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBed className='text-lg' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} beds `
                                    : `${listing.bathrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} baths `
                                    : `${listing.bathrooms} bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                {/* <Faparking className='text-lg' /> */}
                                {listing.parking ? 'parking spot' : 'No parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaChair className='text-lg' />
                                {listing.furnished ? 'furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        {currentUser && listing.userRef !== currentUser._id && !contact && (
                            <button
                                onClick={() => setContact(true)}
                                className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95'
                            >
                                Contact landlord
                            </button>
                        )}
                        {contact && <Contact listing={listing} />}
                    </div>
                </div>
            )}
        </main>
    );
}