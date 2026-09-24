import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import Cart from './pages/Cart'
import DebounceDemo from './pages/DebounceDemo'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Products from './pages/Products'
import Todos from './pages/Todos'
import UserDetail from './pages/UserDetail'
import Users from './pages/Users'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/debounce-demo" element={<DebounceDemo />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
