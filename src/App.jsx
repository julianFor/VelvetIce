import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { useEffect, useState } from 'react'

import { Toaster } from 'react-hot-toast'

import { supabase } from './lib/supabase'

import Navbar from './components/Navbar'
import LoginModal from './components/LoginModal'

import Home from './pages/Home'
import Productos from './pages/Productos'
import Ingredientes from './pages/Ingredientes'
import AdminProductos from './pages/admin/AdminProductos'

function App() {

  const [session, setSession] = useState(null)

  const [mostrarLogin, setMostrarLogin] =
    useState(false)

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    obtenerSesion()

    const {
      data: listener
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        setSession(session)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }

  }, [])

  async function obtenerSesion() {

    const {
      data: { session }
    } = await supabase.auth.getSession()

    setSession(session)

    setLoading(false)
  }

  async function cerrarSesion() {

    await supabase.auth.signOut()
  }

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-[#6D213C]">

        Velvet Ice...

      </div>

    )
  }

  return (

    <BrowserRouter>

      <div className="min-h-screen bg-[#F7F4F2] px-6 lg:px-14">

        <Navbar
          session={session}
          abrirLogin={() =>
            setMostrarLogin(true)
          }
          cerrarSesion={cerrarSesion}
        />

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/productos"
            element={
              <Productos session={session} />
            }
          />

          <Route
            path="/ingredientes"
            element={
              session
                ? <Ingredientes />
                : <Navigate to="/" />
            }
          />

              <Route
          path="/AdminProductos"
          element={
            session
              ? <AdminProductos />
              : <Navigate to="/" />
          }
        />

        </Routes>
    

        <LoginModal
          isOpen={mostrarLogin}
          onClose={() =>
            setMostrarLogin(false)
          }
        />

        <Toaster position="top-right" />

      </div>

    </BrowserRouter>

  )
}

export default App