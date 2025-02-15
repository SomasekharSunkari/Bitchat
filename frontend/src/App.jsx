import './App.css'
import { Route, Routes } from 'react-router-dom'
import Homepage from './components/Homepage'
import Chatpage from './components/Chatpage'
function App() {
  return (
    <div className='App'>

      <Routes>
        <Route path='/' exact element={<Homepage />} />
        <Route path='/chats' element={<Chatpage />} />
        {/* <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} /> */}
      </Routes>

    </div>
  )
}

export default App
