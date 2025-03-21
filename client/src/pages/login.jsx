import penguin from '../sources/penguin.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [name, setName] = useState()
    const [password, setPassword] = useState()
    const [nameError, setNameError] = useState()
    const [passwordError, setPasswordError] = useState()

    const navigate = useNavigate()

    const handleSubmit = (e)=> {
        e.preventDefault()
        setNameError("")
        setPasswordError("")
        axios.post("https://social-media-app-please3.vercel.app/login", {name, password}, { withCredentials: true })
        .then(res=> {
            if(res.data.message === "login success"){
                navigate('/home')
            } else if(res.data === "User not found."){
                setNameError(res.data)
            } else {
                setPasswordError(res.data)
            }
        })
        .catch(err=> console.log(err))
    }

    return (
        <div className="min-h-[100vh] bg-gradient-to-t from-[#2495DF] from-[50%] to-[#FFFF] px-[24px]">
            <div className='flex justify-center mt-[35px] h-[170px]'>
                <img src={penguin} alt="Penguin"/>
            </div>
            <h1 className='text-white text-[30px] font-semibold font-[Poppins] text-center tracking-[2px]'>Login</h1>

            <form onSubmit={handleSubmit}>
                <div className='mt-[30px]'>
                    <label className='text-white font-Poppins text-[15px]' htmlFor="input1name">Name: </label>
                    <br />

                    <input 
                    onChange={(e)=> setName(e.target.value)}
                    type="text" 
                    id="input1name" 
                    required={true}
                    className='outline-none text-white font-Poppins w-[304px] bg-transparent border-b-2 border-white mt-[10px]'/>

                    <p className='mb-[35px] font-Poppins text-red-600'>{nameError}</p>
                </div>
                
                <div>
                    <label className='text-white font-Poppins text-[15px]' htmlFor="input2pass">Password: </label>

                    <input 
                    onChange={(e)=> setPassword(e.target.value)}
                    type="password"
                    required={true}
                    id='input2pass' 
                    className='outline-none text-white font-Poppins w-[304px] bg-transparent border-b-2 border-white mt-[10px]' />
                    <p className='font-Poppins text-red-600'>{passwordError}</p>
                </div>

                <div className='mt-[8px]'>
                    <Link
                    to="/register"
                    className='text-white font-Poppins font-light'
                    >Don't have an account?</Link>
                </div>

                <div>
                    <button type='submit' className='mx-auto flex justify-center items-center w-[177px] h-[49px] mt-[2.3rem] bg-white rounded-[1.2rem] text-[#3ba9ec] font-bold text-[20px]'>Login</button>
                </div>
            </form>
        </div>
    );
}

export default Login