import FriendUserCard from "./component/friend-user-card"
import Footer from "./component/footer"
import { useEffect, useState } from "react"
import axios from 'axios'

function FriendsChannel() {

    const [listFriendNameCard, setListFriendNameCard] = useState()

    const handleGetFriendsData = ()=> {
        axios.get('https://social-media-app-please3.vercel.app/getFriendsData', { withCredentials: true })
        .then(result=> {
            const resultData = result.data
            const promise = resultData.map(eachId => {
                return handleGetFriendsName(eachId)
            })
            Promise.all(promise) // wait until 'promise' variable is resolve
            .then(listName => {
                setListFriendNameCard(listName)
            })
            .catch(err => console.log(err))
        })
    }

    const handleGetFriendsName = (eachId)=> {
        return axios.get(`https://social-media-app-please3.vercel.app/getFriendsName?Id=${eachId}`)
        .then(result => result.data)
        .catch(err => console.log(err))
    }

    useEffect(()=> {
        handleGetFriendsData()
    }, [])
    return (
        <div className='bg-white py-[38px] px-[25px] min-h-[100vh]'>
            <h1 className="mb-[2rem] font-Poppins font-semibold text-center text-[1.5rem]">List Friends</h1>
        

        {listFriendNameCard? listFriendNameCard.map((eachName, index)=> {
            return <FriendUserCard name={eachName} key={index}/>
        }): null }
            <Footer />
        </div>
    )
}

export default FriendsChannel