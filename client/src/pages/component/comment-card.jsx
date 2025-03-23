import { useState, useRef, useEffect } from 'react'
import manAvatar from '../../sources/man avatar.jpg'
import womenAvatar from '../../sources/women avatar.jpg'
import axios from 'axios'

const CommentCard = ({userName, content})=> {

    const commentCardRef = useRef(null)

    const [profile, setProfile] = useState(true)
    const handleGetFriendsGender = () => {
        axios.get(`https://social-media-app-please3.vercel.app/getFriendsGender?name=${userName}`)
        .then(result => setProfile(result.data))
        .catch(err=> console.log(err))
    }

    useEffect(() => {
        handleGetFriendsGender()

        if (commentCardRef.current) {
            commentCardRef.current.style.height = 'auto';
            commentCardRef.current.style.height = `${commentCardRef.current.scrollHeight}px`;
        }
    }, [content]); 

    return (
        <div className="mb-[1rem] border border-slate-700 px-[10px] py-[10px] rounded-2xl">

            <div className="flex">
                <img src={profile? manAvatar : womenAvatar} className="w-[2.5rem] h-[2.5rem] rounded-full"/>

                <div className='ml-[0.5rem]'>
                    <div className='flex'>
                        <h1 className="font-Poppins text-[0.85rem] font-semibold">{userName}</h1>
                        
                        <h1 className="ml-[0.5rem] text-[0.8rem] text-[#6F6F6F]">1h ago</h1>
                    </div>

                    <textarea
                    rows={1}
                    cols={30}
                    ref={commentCardRef}
                    className="outline-none resize-none font-Poppins text-[1rem] py-[5px]"
                    value={content}
                    readOnly/>
                </div>
            </div>

        </div>
    )
}

export default CommentCard