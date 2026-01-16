import BooksPage from './views/BooksPage'
import AddBookPage from './views/AddBookPage'
import SingleBookPage from './views/SingleBookPage'
import LoginPage from './views/LoginPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from './store/userSlice'

import './App.scss'

function App() {

  const user = useSelector(selectUser);

  return (
    <>
      {
        user.activeUser ?
        <BrowserRouter>
          <Routes>
            <Route index element={<BooksPage/>}/>
            <Route path='add-book' element={<AddBookPage/>}/>
            <Route path='book/:id' element={<SingleBookPage/>} />
          </Routes>
        </BrowserRouter> :
        <LoginPage/>
      }
    </>
  )

}

export default App
