import comment from '../../sources/comment.png';
import axios from 'axios';
import { useRef, useEffect, useState, useCallback } from 'react';
import CommentCard from './comment-card';
import manAvatar from '../../sources/man avatar.jpg';
import womenAvatar from '../../sources/women avatar.jpg';

function PostCard({ tweet, name, tweetId }) {
    const textareaRef = useRef(null);
    const cardRef = useRef(null);
    const commentRef = useRef(null);

    const [likeAmount, setLikeAmount] = useState();
    const [liked, setLiked] = useState(false);

    const [commentIWantToAdd, setCommentIWantToAdd] = useState('');
    const [viewComment, setViewComment] = useState(false);
    const [commentArray, setCommentArray] = useState([]);
    const [sumOfComment, setSumOfComment] = useState();
    const [seeOthersHeight, setSeeOthersHeight] = useState(0)

    const [profile, setProfile] = useState(true);

    const commentDivRef = useRef(null);
    const commentInputRef = useRef(null);
    const seeOthersRef = useRef(null);

    const [displayedComments, setDisplayedComments] = useState(5);
    const [showSeeOthers, setShowSeeOthers] = useState(false);
    const [remainingComments, setRemainingComments] = useState(0);
    const [shuffledComments, setShuffledComments] = useState([]);

    const handleGetLikeAmount = useCallback(() => {
    axios
        .get(`https://social-media-app-please3.vercel.app/getLike?tweetId=${tweetId}`)
        .then((res) => {
        setLikeAmount(res.data);
        })
        .catch((err) => console.log(err));
    }, [tweetId]);

    const handleDeleteLike = useCallback(() => {
        axios
        .put('https://social-media-app-please3.vercel.app/deleteLike', { tweetId: tweetId })
        .then((res) => {
            handleGetLikeAmount();
        })
        .catch((err) => console.log(err));
    }, [tweetId, handleGetLikeAmount]);

    const handleLike = useCallback(() => {
        axios
        .put('https://social-media-app-please3.vercel.app/postLike', { tweetId: tweetId })
        .then((res) => {
            handleGetLikeAmount();
        })
        .catch((err) => console.log(err));
    }, [tweetId, handleGetLikeAmount]);

    const handleAddComment = useCallback(() => {
        axios
        .post(`https://social-media-app-please3.vercel.app/addComment`, {
            commentIWantToAdd: commentIWantToAdd,
            tweetId: tweetId,
        }, { withCredentials: true })
        .then((res) => {
            setCommentArray((prevComments) => [
            ...prevComments,
            {
                commenterUserName: res.data.commenterUserName,
                content: commentIWantToAdd,
            },
            ]);
            setCommentIWantToAdd('');
            commentInputRef.current.style.height = 'auto'
        })
        .catch((err) => console.log(err));
    }, [commentIWantToAdd, tweetId]);

    const handleGetCommentProp = (event) => {
        setCommentIWantToAdd(event.target.value);
        if (commentInputRef.current) {
        commentInputRef.current.style.height = 'auto';
        commentInputRef.current.style.height = `${commentInputRef.current.scrollHeight}px`;
        }

        if (seeOthersRef.current) {
            setSeeOthersHeight(seeOthersRef.current.clientHeight);
        } 
        
        cardRef.current.style.height = `${
        220 +
        textareaRef.current.scrollHeight +
        commentInputRef.current.scrollHeight +
        commentDivRef.current.clientHeight + seeOthersHeight
    }px`
    }

    const handleViewComment = useCallback(() => {
        axios
        .get(`https://social-media-app-please3.vercel.app/getComment?tweetId=${tweetId}`)
        .then((result) => {
            setCommentArray(result.data);
            console.log(result.data)
        

            if (result.data.length > 5) {
                setRemainingComments(result.data.length - displayedComments);
                setShowSeeOthers(true);
            } else {
                setRemainingComments(0);
                setShowSeeOthers(false);
            }

            if (!viewComment && result.data.length > 0) { // Tambahkan ini
                const shuffled = shuffleArray([...result.data]);
                setShuffledComments(shuffled);
            }
        })
        .catch((err) => console.log(err));
        setViewComment(!viewComment);
    }, [tweetId, viewComment, setViewComment, displayedComments]);

    const handleGetSumOfComment = useCallback(() => {
        axios
        .get(`https://social-media-app-please3.vercel.app/getSumOfComment?tweetId=${tweetId}`)
        .then((result) => setSumOfComment(result.data))
        .catch((err) => console.log(err));
    }, [tweetId]);

    const handleGetFriendsGender = useCallback(() => {
        axios
        .get(`https://social-media-app-please3.vercel.app/getFriendsGender?name=${name}`)
        .then((result) => setProfile(result.data))
        .catch((err) => console.log(err));
    }, [name]);

    const handleSeeOthers = () => {
        const newDisplayedComments = displayedComments + 5;
        setDisplayedComments(newDisplayedComments);
        if (newDisplayedComments >= commentArray.length) {
        setShowSeeOthers(false);
        } else {
        setRemainingComments(commentArray.length - displayedComments);
        }
    };

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    useEffect(() => {

        if (commentArray.length <= 5) {
            setShowSeeOthers(false);
        } else {
            setShowSeeOthers(true);
            setRemainingComments(Math.max(0, commentArray.length - displayedComments))
        }

        if (viewComment === false) {
            setDisplayedComments(5);
            setRemainingComments(commentArray.length - displayedComments);
        }

        handleGetLikeAmount();
        handleGetSumOfComment();
        handleGetFriendsGender();

        if (textareaRef.current) {
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
        
        if (viewComment) {
            if (seeOthersRef.current) {
                setSeeOthersHeight(seeOthersRef.current.clientHeight);
            }

            setTimeout(()=> {
        cardRef.current.style.height = `${
            220 +
            textareaRef.current.scrollHeight +
            commentInputRef.current.scrollHeight +
            commentDivRef.current.clientHeight + seeOthersHeight
        }px`
    
        
        }, 1)

        } else if (cardRef.current && textareaRef.current) {
        cardRef.current.style.height = `${150 + textareaRef.current.scrollHeight}px`;
        }
    }, [
        viewComment,
        commentArray,
    
        displayedComments,
        handleGetLikeAmount,
        handleGetSumOfComment,
        handleGetFriendsGender,
        seeOthersRef.current,
        commentInputRef.current,
    ]);

    return(
        <div>
            <div
            ref={cardRef} 
            className="bg-white rounded-2xl mt-[3rem] px-[24px] py-[20px]">
                <div className="flex mb-[20px]">
                    <img 
                    className="w-[54px] h-[54px] rounded-full bg-slate-300 mr-[15px]"
                    src={profile? manAvatar : womenAvatar} 
                    />

                    <div>
                        <h1 className="font-Poppins">{name}</h1>
                        <h1 className="text-[0.8rem] text-[#6F6F6F]">1h ago</h1>
                    </div>

                </div>

                <textarea 
                    ref={textareaRef}
                    className="font-Poppins w-full outline-none resize-none p-[5px]"
                    type="text" 
                    value={tweet}
                    readOnly
                />
        
                <div className='flex'>
                    <div
                    onClick={()=> {
                        if(!liked){
                            handleLike()
                            setLiked(!liked)
                        } else {
                            handleDeleteLike()
                            setLiked(!liked)
                        }
                    }} 
                    className='flex'>
                        <span className='w-[24px] h-[24px] mr-[6px]'>{liked? '❤️' : '🤍'}</span>
                        <h1>{likeAmount}</h1>
                    </div>

                    <div 
                    onClick={handleViewComment}
                    className='flex ml-[3rem]'>
                        <img src={comment} className='w-[24px] h-[24px] mr-[6px]' />
                        <h1>{sumOfComment}</h1>
                    </div>
                </div>

                <div
                ref={commentRef}
                className='w-[100%] mt-[1rem]'>

                    {viewComment && 
                    <div>
                        <div ref={commentDivRef}>
                            {shuffledComments.slice(0, displayedComments).map((eachComment, index)=> {
                                return <CommentCard key={index} userName={eachComment.commenterUserName} content={eachComment.content} />
                            })}
                        </div>

                            {showSeeOthers && (
                                <button 
                                ref={seeOthersRef}
                                className='mb-[1rem] flex items-center justify-center px-[1rem] pt-[0.5rem] font-Poppins text-[0.9rem] w-full text-slate-600'
                                onClick={handleSeeOthers}>See {remainingComments} others</button>
                            )}

                        <div className="flex flex-row items-center border border-black rounded-2xl p-3">
                        <textarea
                            onChange={handleGetCommentProp}
                            ref={commentInputRef}
                            type="text"
                            value={commentIWantToAdd}
                            className="font-Poppins w-full outline-none resize-none rounded-2xl p-2 mr-3 text-sm text-gray-700"
                            placeholder="Comment something..."
                            rows="1" 
                            required
                            // Menetapkan jumlah baris awal
                        />
                        <button
                            onClick={handleAddComment}
                            className="font-Poppins bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
                        >
                            Send
                        </button>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default PostCard