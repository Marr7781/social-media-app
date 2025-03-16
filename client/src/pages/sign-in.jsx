///sources
import penguin from '../sources/penguin.png';

//routing
import { Link, useNavigate } from 'react-router-dom';

//axios
import axios from 'axios';

//react hook form
import { useForm } from 'react-hook-form';

function SignIn() { 

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const navigate = useNavigate()

    const postData = (data)=> {
        axios.post(`https://social-media-app-please3.vercel.app/register`, {name: data.name , password: data.password})
        .then(res=> {
            if(res.data === `This username is already used.`){
                alert(res.data)
            } else {
                navigate('/login')
            }
        })
        .catch(err=> console.log(err))
    }

    return (
        <div className="min-h-[100vh] bg-gradient-to-t from-[#2495DF] from-[50%] to-[#FFFF] px-[24px]">
            <div className='flex justify-center mt-[35px] h-[170px]'>
                <img src={penguin} alt="Penguin"/>
            </div>
            <h1 className='text-white text-[30px] font-semibold font-[Poppins] text-center tracking-[2px]'>Sign-In</h1>

            <form onSubmit={handleSubmit(postData)}>
                <div className='mt-[30px]'>
                    <label className='text-white font-Poppins text-[15px]' htmlFor="input1name">Name: </label>
                    <br />

                    <input 
                    {...register("name", {
                        required: `Name is required.`,
                        minLength: {
                            value: 3,
                            message: `Min length is 3.`,
                        },
                        maxLength: {
                            value: 25,
                            message: `Max length is 25.`,
                        }
                    })}
                    type="text" 
                    id="input1name" 
                    className='outline-none text-white font-Poppins w-[304px] bg-transparent border-b-2 border-white mt-[10px]'/>
                    <p className='mb-[35px] text-red-600 font-Poppins'>{errors.name?.message}</p>
                </div>
                
                <div>
                    <label className='text-white font-Poppins text-[15px]' htmlFor="input2pass">Password: </label>
                    <input 
                    {...register("password", {
                        required: `Password is required.`,
                        minLength: {
                            value: 4,
                            message: `Min length is 4.`,
                        },
                        maxLength: {
                            value: 30,
                            message: `Max length is 30.`
                        }
                    })}
                    type="password"
                    id='input2pass' 
                    className='outline-none text-white font-Poppins w-[304px] bg-transparent border-b-2 border-white mt-[10px]' />
                    <p className='text-red-600 font-Poppins'>{errors.password?.message}</p>
                </div>

                <div className='mt-[8px]'>
                    <Link
                    to="/login"
                    className='text-white font-Poppins font-light'
                    >Already have an account?</Link>
                </div>

                    <button type='submit' className='mx-auto flex justify-center items-center w-[177px] h-[49px] mt-[2.3rem] bg-white rounded-[1.2rem] text-[#3ba9ec] font-bold text-[20px]'>Sign-In</button>
            </form>
        </div>
    );
}

export default SignIn