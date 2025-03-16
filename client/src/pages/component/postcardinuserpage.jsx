import heart from '../../sources/heart.png'
import comment from '../../sources/comment.png'
import axios from 'axios'

import { useRef, useEffect, useState } from 'react'

function PostCardInUserPage({tweet, tweetId}){

    const textareaRef = useRef(null)
    const cardRef = useRef(null)

    const [likeAmount, setLikeAmount] = useState()
    const [sumOfComment, setSumOfComment] = useState()

    const handleGetLikeAmount = () => {
        axios.get(`https://social-media-app-please3.vercel.app/getLike?tweetId=${tweetId}`)
        .then(res => {
            setLikeAmount(res.data)
        })
        .catch(err=> console.log(err))
    }

    const handleGetSumOfComment = () => {
        axios.get(`https://social-media-app-please3.vercel.app/getSumOfComment?tweetId=${tweetId}`)
        .then(result => setSumOfComment(result.data))
        .catch(err=> console.log(err))
    }

    useEffect(()=> {
        handleGetLikeAmount()
        handleGetSumOfComment()
    }, [])

    return(
        <div>
            <div
            ref={cardRef} 
            className="bg-white rounded-2xl mt-[1.5rem] px-[24px] py-[20px]">

                <h1 className='text-slate-500 font-Poppins text-[10px] float-right'>1h ago</h1>

                <textarea 
                    ref={textareaRef}
                    className="font-Poppins w-full outline-none resize-none"
                    type="text" 
                    value={tweet}
                    readOnly
                />
        
                <div className='flex'>
                    <div className='flex'>
                        <span className='w-[24px] h-[24px] mr-[6px]'>❤️</span>
                        <h1>{likeAmount}</h1>
                    </div>

                    <div className='flex ml-[3rem]'>
                        <img src={comment} className='w-[24px] h-[24px] mr-[6px]' />
                        <h1>{sumOfComment}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCardInUserPage