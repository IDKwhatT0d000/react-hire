import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import CandidateDetails from './components/CardDetails'
import Profile from './components/pages/Profile'
import Leaderboard from './components/pages/Leaderboard'
import Inbox from './components/pages/Inbox'
import Landing from './components/pages/Landing'
import Main from './components/Main'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/main" element={<Main></Main>}>
          <Route path="landing" element={<Landing></Landing>}></Route>
          <Route path="profile" element={<Profile></Profile>}></Route>
          <Route path="inbox" element={<Inbox></Inbox>}></Route>
          <Route path="leaderboard" element={<Leaderboard></Leaderboard>}></Route>
        </Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/candidate/:id" element={<CandidateDetails></CandidateDetails>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
