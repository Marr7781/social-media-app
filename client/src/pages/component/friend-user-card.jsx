import manAvatar from '../../sources/man avatar.jpg'
import womenAvatar from '../../sources/women avatar.jpg'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function FriendUserCard({name, friendId}) {

        const [profile, setProfile] = useState(true)
        const handleGetFriendsGender = () => {
            axios.get(`https://social-media-app-please3.vercel.app/getFriendsGender?name=${name}`)
            .then(result => setProfile(result.data))
            .catch(err=> console.log(err))
        }

        useEffect(()=> {
            handleGetFriendsGender()
        }, [])

    return (
        <div
        className=" mt-[2rem] w-full h-[63px] bg-slate-200 rounded-xl flex space-x-[18px] items-center px-[20px] py-[10px]">
            <div className="w-[42px] h-[42px] rounded-full bg-white">
                <img
                className='rounded-full'
                src={profile? manAvatar : womenAvatar} alt="" />
            </div>
                <h1 className="font-Poppins text-[17px]">{name}</h1>
        </div>
    )
}

export default FriendUserCard