    import Footer from './component/footer.jsx';
    import searchicon from '../sources/search.png';
    import UserCard from './component/user-card.jsx';
    import axios from 'axios';
    import { useEffect, useState } from 'react';

    function SearchUser() {
    const [displayNameOnSearchPage, setDisplayNameOnSearchPage] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handleGet = () => {
        axios
        .get('https://social-media-app-please3.vercel.app/getNameInSearchPage')
        .then((res) => {
            setDisplayNameOnSearchPage(res.data);
        })
        .catch((err) => console.log(err));
    };

    useEffect(() => {
        handleGet();
    }, []);

    useEffect(() => {
        if (searchTerm) {
        const filtered = displayNameOnSearchPage.filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
        } else {
        setFilteredUsers(displayNameOnSearchPage);
        }
    }, [searchTerm, displayNameOnSearchPage]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="bg-white py-[38px] px-[25px] min-h-[100vh] pb-[10rem]">
        {/* search bar */}
        <div className="flex h-[50px] py-[14px] px-[17px] bg-slate-200 rounded-xl">
            <img src={searchicon} className="w-[23px] h-[23px] mr-[1rem]" alt="search icon" />
            <input
            className="w-full outline-none text-[14px] bg-transparent font-Poppins text-slate-500"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            />
        </div>

        {/* card */}
        {filteredUsers.length > 0 ? (
            filteredUsers.map((eachData, index) => {
            return <UserCard name={eachData.name} friendId={eachData.userId} key={index} />;
            })
        ) : searchTerm && displayNameOnSearchPage.length>0 ? (
        <div className='flex justify-center mt-[5rem]'>
            <p className='font-Poppins flex'>No matching users found.</p>
        </div>
        ) : (displayNameOnSearchPage.length === 0 && !searchTerm ? (<p>Loading Users...</p>) : null )}

        <Footer />
        </div>
    );
    }

    export default SearchUser;