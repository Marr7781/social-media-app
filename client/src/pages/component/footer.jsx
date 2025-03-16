import home from '../../sources/home.png'
import user from '../../sources/user.png'
import search from '../../sources/search.png'
import friends from '../../sources/friends.png'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <div className="h-[60px] bg-white bottom-0 left-0 fixed w-full flex justify-between items-center px-[31px]">
            <Link to="/home" className='w-[24px] h-[24px]'>
                <img src={home} />
            </Link>
            <Link to="/home/search" className='w-[24px] h-[24px]'>
                <img src={search} />
            </Link>
            <Link to="/home/friends" className='w-[27px] h-[27px]'>
                <img src={friends} />
            </Link>
            <Link to="/home/user" className='w-[24px] h-[24px]'>
                <img src={user} />
            </Link>
        </div>
    )
}

export default Footer
