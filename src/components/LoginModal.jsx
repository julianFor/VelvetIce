import { useState } from 'react'

import Modal from 'react-modal'

import toast from 'react-hot-toast'

import { supabase } from '../lib/supabase'

Modal.setAppElement('#root')

function LoginModal({
  isOpen,
  onClose
}) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function iniciarSesion(e) {

    e.preventDefault()

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    if (error) {

      toast.error('Credenciales incorrectas')

    } else {

      toast.success('Bienvenido')

      onClose()

      window.location.reload()
    }
  }

  return (

    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white max-w-md mx-auto mt-40 p-10 rounded-[2.5rem] outline-none"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
    >

      <div className="text-center mb-8">

        <p className="uppercase tracking-[0.3em] text-sm text-[#6D213C] font-semibold">

          Velvet Access

        </p>

        <h1 className="text-4xl font-black text-[#1F1F1F] mt-4">

          Iniciar Sesión

        </h1>

      </div>

      <form
        onSubmit={iniciarSesion}
        className="space-y-5"
      >

        <input
          className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#6D213C]"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#6D213C]"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="w-full bg-[#6D213C] hover:bg-[#52172d] transition text-white py-4 rounded-2xl font-semibold shadow-xl"
        >

          Ingresar

        </button>

      </form>

    </Modal>

  )
}

export default LoginModal