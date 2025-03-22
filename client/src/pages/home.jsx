import { useState, useRef, useEffect } from "react"
import { Link } from 'react-router-dom'

//sources
import penguin from '../sources/penguin.png'
import setting from '../sources/setting.png'
import manAvatar from '../sources/man avatar.jpg'
import womenAvatar from '../sources/women avatar.jpg'

//component
import PostCard from './component/postcard.jsx'
import Footer from "./component/footer.jsx"

//axios
import axios from "axios"

function Home() {
    //inputcard 

    const [tweet, setTweet] = useState()
    const [tweetColor, setTweetColor] = useState(false)

    const [tweetPostCardList, setTweetPostCardList] = useState([])

    const [reels, setReels] = useState([])

    const textareaRef = useRef(null)
    const cardRef = useRef(null)

    const resizeTextArea = ()=> {
        if(textareaRef.current){
                textareaRef.current.style.height = 'auto'
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`

                cardRef.current.style.height = 150 - 54 + textareaRef.current.scrollHeight + `px`

                //150px represents the card default height
                //54px represents the textarea default height
        }}

    const handleLogout = ()=> {
        axios.post('https://social-media-app-please3.vercel.app/logout',)
        .then(res=> console.log(res.data))
        .catch(err=> console.log(err))
    }

        const handleSubmit = async (e) => {
            e.preventDefault();
            
            try {
        
            const response = await axios.post(
                'https://social-media-app-please3.vercel.app/home',
                { tweet },
                { withCredentials: true }
            );
        
            console.log(response.data);
    
            setTweet("");
            textareaRef.current.value = null;
            textareaRef.current.style.height = 'auto';
            cardRef.current.style.height = '150px';
        
            window.location.reload();
        
            } catch (err) {
            console.log(err);
            }
        };
        
    //tempat dimana kita ngespawn tweet di home, pas pertama kali render
    //mengacak urutan di dalam array
    function shuffleArray(array) {
        const newArray = [...array]; // Membuat salinan array agar tidak mengubah array asli
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Menukar elemen
        }
        return newArray;
    }

    const handlePost = ()=> {
        axios.get('https://social-media-app-please3.vercel.app/gettweetcontent')
        .then(res=> {
            const shuffledArray = shuffleArray(res.data)
        
            setReels(shuffledArray)
            console.log(res.data)
        })
        .catch(err => console.log(err))
    } 

    const [profile, setProfile] = useState(true)

    //! COOKIE ADDED
    const handleGetGender = () => {
        axios.get('https://social-media-app-please3.vercel.app/getGender', { withCredentials: true })
        .then(result => setProfile(result.data))
        .catch(err=> console.log(err))
    }

    const [settings, setSettings] = useState(false)

    useEffect(()=> {
        resizeTextArea()
        handlePost()
        handleGetGender()
    }, [])

    return (
        //! header 
        <div className='bg-slate-200 min-h-[100vh] px-[12px] pt-[27px] pb-[70px]'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                    <img className='w-[50px] h-[50px]' src={penguin} />
                    <h1 className='font-bold font-Poppins text-[29px]'>Mood</h1>`
                </div>
                
                <img
                onClick={()=> setSettings(!settings)}
                src={setting} className='w-[24px] h-[24px] mr-[5px]'/>

{settings ? (
        <div className="bg-white rounded-md shadow-md fixed top-[4rem] right-[1rem] w-[12rem] p-4 z-50 transition-all duration-300 ease-in-out">
            <div className="flex flex-col space-y-2">
                <Link
                to="/CAF"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
                >
                Critics and Feedback
                </Link>
                <Link
                onClick={handleLogout}
                to="/register"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
                >
                Logout
                </Link>
            </div>
            </div>
        ) : null}
            </div>
            
        {/* //! input card */}
            <form
            onSubmit={handleSubmit}
            ref={cardRef}
            className="bg-white rounded-2xl mt-[4rem] px-[24px] py-[20px]">
                <div className="flex mb-[20px]">
                    <img 
                    className="w-[54px] h-[54px] rounded-full bg-slate-300 mr-[15px]"
                    src={profile? manAvatar : womenAvatar}
                    />

                    <textarea 
                    ref={textareaRef}
                    onChange={(e)=> {
                        setTweet(textareaRef.current.value)
                        resizeTextArea()
                        setTweetColor(e.target.value.length > 0)
                    }}
                    style={{
                        'color': tweetColor? "black" : "#9E9E9C"
                    }}
                    className="font-Poppins w-full outline-none resize-none p-[5px]"
                    type="text" 
                    placeholder="Write something..." 
                    required={true}
                    />
                </div>
        
                    <button 
                    type="submit"
                    className="w-[88px] h-[36px] bg-[#105E8F] text-white font-Poppins font-bold float-end"
                    >Post</button>
            </form>

        {/* //! post card */}
            <div>
                <ul>
                    {reels.map((eachReels, index) => {
                        return (
                            <li key={index}>
                                <PostCard tweetId={eachReels.tweetId} tweet={eachReels.content} name={eachReels.userName} />
                            </li>
                        )
                    })}
                </ul>
            </div>
            
            <Footer />
        </div>  
    )
}

export default Home