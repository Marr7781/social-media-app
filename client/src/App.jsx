//pages
import About from "./pages/about"
import SignIn from "./pages/sign-in"
import Login from "./pages/login"
import Home from "./pages/home"
import UserPage from "./pages/userpage"
import SearchUser from "./pages/search-user"
import FriendUserPage from "./pages/friend-user-page"
import FriendsChannel from "./pages/friends-channel"
import CAF from "./pages/CAF"

//routing
import { BrowserRouter, Routes, Route, Router } from "react-router-dom"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<About />}/>
        <Route path="/register" element={<SignIn />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/home/user" element={<UserPage />}/>
        <Route path="/home/search" element={<SearchUser />} />
        <Route path="/home/search/friend-user-page" element={<FriendUserPage />} />
        <Route path="/home/friends" element={<FriendsChannel />} />

        <Route path="/CAF" element={<CAF />} /> 

      </Routes>
    </BrowserRouter>
  )
}

export default App
