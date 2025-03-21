import Footer from "./component/footer"
import setting from "../sources/setting.png"
import PostCardInUserPage from "./component/postcardinuserpage"
import axios from 'axios'
import { useEffect, useState, useLayoutEffect, useRef } from "react"
import manAvatar from "../sources/man avatar.jpg"
import womenAvatar from "../sources/women avatar.jpg"

function UserPage(){

    const [userName, setUserName] = useState()
    const [tweetContentAmount, setTweetContentAmount] = useState()

    const [reels, setReels] = useState([])

    const [listFollowing, setListFollowing] = useState()

    const handleGetAmountOfFollowing = () => {
        axios.get(`https://social-media-app-please3.vercel.app/getAmountOfFollowing`, { withCredentials: true })
        .then(res => {
            if(res.data == null) {
                setListFollowing(0)
            } else {
                setListFollowing(res.data.friends.length)
            }
        
        })
        .catch(err=> console.log(err))
    }

    const [listFollowers, setListFollowers] = useState()
    const handleGetAmountOfFollowers = () => {
        axios.get(`https://social-media-app-please3.vercel.app/getAmountOfFollowers`, { withCredentials: true })
        .then(res => {
            const countingFollowers = res.data.filter(Boolean).length
            setListFollowers(countingFollowers)
        })
        .catch(err=> console.log(err))
    }

    const handleChangeProfile = () => {
        axios.put('https://social-media-app-please3.vercel.app/changeProfile', {}, { withCredentials: true })
        .then(result => {
            setProfile(!profile)
        })
        .catch(err=> console.log(err))
    }

    const handleGetGender = () => {
        axios.get('https://social-media-app-please3.vercel.app/getGender', { withCredentials: true })
        .then(result => setProfile(result.data))
        .catch(err=> console.log(err))
    }

//get username in userpage
//! COOKIE ADDED
    const handleGetName = ()=> {
        axios.get('https://social-media-app-please3.vercel.app/getName', { withCredentials: true })
        .then(result => {
            if(Object.keys(result.data).length === 0){
                console.log(result.data)
            } else {
                setUserName(result.data)
            }
        })
        .catch(err=> console.log(err))
    }

    const [profile, setProfile] = useState(true)

    useEffect(()=> {
        axios.get('https://social-media-app-please3.vercel.app/userpage', { withCredentials: true })
        .then(result => {
            setReels(result.data)            
            setTweetContentAmount(result.data.length)
        })
        .catch(err=> {
            console.log(err)
        })

        handleGetAmountOfFollowing()
        handleGetAmountOfFollowers()
        handleGetName()
        handleGetGender()
    }, [])

    return (
        <div className="bg-[#105E8F] min-h-[100vh] py-[52px]">

            <div className="mt-[2rem] ml-[38px]">
                <h1 className="font-Poppins text-white">Welcome back!</h1>
                <h1 className="font-Poppins text-white text-[2.7rem] font-bold">{userName}</h1>
            </div>

            {/* bar */}
            <div className="bg-slate-200 w-full min-h-[23rem] mt-[4rem] rounded-t-[2.5rem] px-[38px]">

                <div className="flex">
                    <div
                    className="w-[85px] h-[85px] relative top-[-2rem] rounded-2xl">
                        <img
                        className="rounded-xl"
                        src={profile? manAvatar : womenAvatar} alt="" />
                        <button
                        onClick={handleChangeProfile}
                        className="w-[5rem] mt-[0.5rem]  h-[1.5rem] rounded-full border border-black text-[14px]">Change</button>
                    </div>
                </div>

                <div className="flex justify-between mb-[1.5rem] mt-[1rem]">
                    <div className="w-[80px] h-[80px] bg-white rounded-2xl flex justify-center items-center py-[20px]">
                        <div>
                            <h1 className="font-bold font-Poppins text-[25px] text-center p-0">{tweetContentAmount}</h1>
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

                    {reels? reels.map((eachTweetData, index) => {
                        return <PostCardInUserPage tweet={eachTweetData.content} tweetId={eachTweetData.tweetId} key={index}/>
                    }) : null}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default UserPage