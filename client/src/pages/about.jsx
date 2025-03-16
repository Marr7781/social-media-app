    import { Link } from "react-router-dom";
    import { useState } from "react";
    import penguin from '../sources/penguin.png'

    function About() {
    const [isIndonesian, setIsIndonesian] = useState(false);

    const toggleLanguage = () => {
        setIsIndonesian(!isIndonesian);
    };

    const englishTranslations = {
        signIn: "Sign-In",
        about: "About",
        whatIsThis: "What is this?",
        description: "This personal project is a simple social media platform that created for developer learning purposes.",
        security: "For Security and Comfort Purposes",
        securityItem1: "Do not use the same password as other accounts (e.g., Gmail)",
        securityItem2: "Please maintain polite language.",
        translate: "Translate to Indonesian",
        translateBack: "Translate to English",
    };

    const indonesianTranslations = {
        signIn: "Masuk",
        about: "Tentang",
        whatIsThis: "Apa ini?",
        description: "Proyek pribadi ini adalah platform media sosial simpel yang dibuat untuk tujuan pembelajaran pengembang.",
        security: "Untuk Tujuan Keamanan dan Kenyamanan",
        securityItem1: "Jangan gunakan kata sandi yang sama dengan akun lain (misalnya, Gmail).",
        securityItem2: "Mohon jaga bahasa yang sopan.",
        translate: "Terjemahkan ke Bahasa Indonesia",
        translateBack: "Terjemahkan ke Bahasa Inggris",
    };

    const translations = isIndonesian ? indonesianTranslations : englishTranslations;

    return (
        <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-end mb-4">
            <button
                onClick={toggleLanguage}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            >
                {isIndonesian ? translations.translateBack : translations.translate}
            </button>
            </div>

                <div className='flex items-center ml-[5.5rem] my-[1.5rem]'>
                    <img className='w-[50px] h-[50px]' src={penguin} />
                    <h1 className='font-bold font-Poppins text-[29px]'>Mood</h1>`
                </div>

            <Link
            to="/register"
            className="mx-auto block w-64 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-lg text-center transition duration-300 ease-in-out"
            >
            {translations.signIn}
            </Link>

            <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                {translations.about}
            </h2>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">
                {translations.whatIsThis}
                </h3>
                <p className="text-gray-600">{translations.description}</p>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">
                {translations.security}
                </h3>
                <ul className="list-disc list-inside text-gray-600">
                <li>{translations.securityItem1}</li>
                <li>{translations.securityItem2}</li>
                </ul>
            </div>
            </div>
        </div>
        </div>
    );
    }

    export default About;