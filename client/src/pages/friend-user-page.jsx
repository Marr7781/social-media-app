import Footer from "./component/footer"
import setting from "../sources/setting.png"
import PostCardInUserPage from "./component/postcardinuserpage"
import back from "../sources/back.png"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import axios from 'axios'

import manAvatar from '../sources/man avatar.jpg'
import womenAvatar from '../sources/women avatar.jpg'

function FriendUserPage() {

    //follow management
    const [followed, setFollowed] = useState(false)

    const handleClick = ()=> {
        if(followed){
            axios.put('https://social-media-app-please3.vercel.app/deleteFollowList', {friendId: friendId}, { withCredentials: true })
            .then(res=> console.log(res.data))
            .catch(err=> console.log(err))

            setFollowed(!followed)
        } else {
            axios.post('https://social-media-app-please3.vercel.app/addFollowList', {friendId: friendId}, { withCredentials: true })
            .then(res=> console.log(res.data))
            .catch(err=> console.log(err))

            setFollowed(!followed)
        }
    }

    //get user profile data management
    const location = useLocation()
    const friendId = location.state

    const [reels, setReels] = useState([])
    const [name, setName] = useState()
    const [tweetAmount, setTweetAmount] = useState()

    //! NEED TO BE FIXED -29/01/25
    const handleGetUserProfile = ()=> {
        axios.get(`https://social-media-app-please3.vercel.app/getUserProfile?friendId=${friendId}`)
        .then(result => {
            if(result.data[0].tweetId){
                const name = result.data[0].username
                setReels(result.data)
                setName(name)

                handleGetIdFromName(name)
                handleGetFriendsGender(name)
                setTweetAmount(result.data.length)
            } else {
                const name = result.data[0].username

                setTweetAmount(0)
                setName(name)
                
                handleGetIdFromName(name)
                handleGetFriendsGender(name)

                setReels(null)
            }
        })
        .catch(err => console.log(err))
    }

    const handleCheckFollowing = ()=> {
        axios.get(`https://social-media-app-please3.vercel.app/checkFollowing?friendId=${friendId}`, { withCredentials: true })
        .then(result => {
            if (result.data === true) {
                setFollowed(true);
            } else if (result.data === "{}"){
                setFollowed(false);
            }
        })
        .catch(err=> console.log(err))
    }

    const [profile, setProfile] = useState(true)
    const handleGetFriendsGender = (name) => {
        axios.get(`https://social-media-app-please3.vercel.app/getFriendsGender?name=${name}`)
        .then(result => setProfile(result.data))
        .catch(err=> console.log(err))
    }

    //handle get amount of followers and following
    const [listFollowing, setListFollowing] = useState()
    const [listFollowers, setListFollowers] = useState()

    const handleGetAmountOfFriendsFollowing = (friendId) => {
        axios.get(`https://social-media-app-please3.vercel.app/getAmountOfFriendsFollowing?friendId=${friendId}`)
        .then(res => {
            if(res.data == null) {
                setListFollowing(0)
            } else {
                setListFollowing(res.data.friends.length)
            }
        })
        .catch(err=> console.log(err))
    }

    const handleGetAmountOfFriendsFollowers = (friendId) => {
        axios.get(`https://social-media-app-please3.vercel.app/getAmountOfFriendsFollowers?friendId=${friendId}`)
        .then(res => {
            const countingFollowers = res.data.filter(Boolean).length
            setListFollowers(countingFollowers)
        })
        .catch(err=> console.log(err))
    }

    const handleGetIdFromName = (name)=> {
        axios.get(`https://social-media-app-please3.vercel.app/getIdFromName?name=${name}`)
        .then(result=> {
            const friendId = result.data

            handleGetAmountOfFriendsFollowers(friendId)
            handleGetAmountOfFriendsFollowing(friendId)
        })
        .catch(err=> console.log(err))
    }

    useEffect(()=> {
        handleGetUserProfile()
        handleCheckFollowing()
    }, [handleClick])

    return (
        <div className="bg-[#105E8F] min-h-[100vh] py-[52px]">
        <div className="flex justify-between px-[38px]">
            <Link to='/home/search'>
                <img src={back} className='w-[24px] h-[24px]'/>
            </Link>
        </div>

        <div className="mt-[2rem] ml-[38px]">
            <h1 className="font-Poppins text-white text-[2.7rem] font-bold">{name}</h1>
        </div>

        {/* bar */}
        <div className="bg-slate-200 w-full min-h-[23rem] mt-[4rem] rounded-t-[2.5rem] px-[38px]">

            <div onClick={()=> handleClick()}>
                <button
                className="w-[103px] h-[33px] text-[#105E8F] font-Poppins bg-white rounded-2xl float-right relative top-[-3rem] flex justify-center items-center">{followed? "Followed" : "Follow"}</button>
            </div>

            <div className="w-[85px] h-[85px] bg-slate-400 relative top-[-2rem] rounded-2xl">
                <img
                className="rounded-2xl"
                src={profile? manAvatar : womenAvatar} alt="" />
            </div>

            <div className="flex justify-between mb-[1.5rem]">
                <div className="w-[80px] h-[80px] bg-white rounded-2xl flex justify-center items-center py-[20px]">
                    <div>
                        <h1 className="font-bold font-Poppins text-[25px] text-center p-0">{tweetAmount}</h1>
                        <h1 className="text-slate-600 text-[12px]">Tweets</h1>
                    </div>
                </div>

                <div className="w-[80px] h-[80px] bg-white rounded-2xl flex justify-center items-center py-[20px]">
                    <div>
                        <h1 className="font-bold font-Poppins text-[25px] text-center p-0">{listFollowers}</h1>
                        <h1 className="text-slate-600 text-[12px]">Followers</h1>
                    </div>
                </div>

                <div className="w-[80px] h-[80px] bg-white rounded-2xl flex justify-center items-center py-[20px]">
                    <div>
                        <h1 className="font-bold font-Poppins text-[25px] text-center p-0">{listFollowing}</h1>
                        <h1 className="text-slate-600 text-[12px]">Following</h1>
                    </div>
                </div>
            </div>

            <div className="pb-[3rem]">
                <h1 className="font-Poppins font-bold text-[17px]">My Tweets</h1>

                {reels? reels.map((eachReels, index)=> {
                    return <PostCardInUserPage tweet={eachReels.content} tweetId={eachReels.tweetId} key={index} />
                }) : <p className="text-center mt-[2rem] text-slate-600">There's no tweet being posted.</p>}
            </div>
        </div>

        <Footer />
    </div>
)
}

export default FriendUserPage