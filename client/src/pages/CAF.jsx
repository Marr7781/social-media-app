    import React, { useState } from 'react';
    import back from '../sources/back.png'
    import { Link } from 'react-router-dom'

    import axios from 'axios'

    function CAF() {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Tambahkan logika untuk mengirim feedback di sini

        axios.post('https://social-media-app-please3.vercel.app/CAF', {CAF: feedback}, { withCredentials: true })
        .catch(err=> console.log(err))

        setFeedback(''); // Reset textarea setelah submit
        alert("Thanks for your feedback!")
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

        <Link to='/home' className='absolute top-[2rem] left-[2rem]'>
            <img src={back} alt="Back" className='w-[24px] h-[24px]'/>
        </Link>

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            CRITICS & FEEDBACK
            </h1>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label
                htmlFor="feedback"
                className="block text-gray-700 text-sm font-bold mb-2"
                >
                Your Feedback
                </label>
                <textarea
                required={true}
                id="feedback"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 resize-none h-48"
                placeholder="Enter your critics and feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
                Submit Feedback
            </button>
            </form>
        </div>
        </div>
    );
    }

    export default CAF;