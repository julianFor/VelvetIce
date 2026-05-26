import { Link, useLocation } from 'react-router-dom'

import {
  FaIceCream,
  FaBoxOpen
} from 'react-icons/fa'

function Navbar({
  session,
  abrirLogin,
  cerrarSesion
}) {

  const location = useLocation()

  function active(path) {

    return location.pathname === path
      ? 'text-[#6D213C]'
      : 'text-[#1F1F1F]'
  }

  return (

    <nav className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-between items-center py-8">

      <div>

        <h1 className="text-3xl font-black text-[#6D213C]">

          Velvet Ice

        </h1>

        <p className="text-sm text-gray-500">

          Luxury Ice Cream

        </p>

      </div>

      <div className="flex items-center flex-wrap justify-center gap-4 lg:gap-7">

        <Link
          className={`font-semibold transition hover:text-[#6D213C] ${active('/')}`}
          to="/"
        >
          Home
        </Link>

        <Link
          className={`font-semibold transition hover:text-[#6D213C] ${active('/productos')}`}
          to="/productos"
        >
          Productos
        </Link>

        {session && (

          <>
          
            <Link
              className={`font-semibold transition hover:text-[#6D213C] ${active('/ingredientes')}`}
              to="/ingredientes"
            >

              Ingredientes

            </Link>

            <Link
              className={`flex items-center gap-2 font-semibold transition hover:text-[#6D213C] ${active('/admin/productos')}`}
              to="/AdminProductos"
            >

              <FaBoxOpen />

              Admin Productos

            </Link>

          </>

        )}

        {session ? (

          <button
            onClick={cerrarSesion}
            className="bg-[#1F1F1F] hover:bg-black transition text-white px-6 py-3 rounded-2xl font-semibold shadow-lg"
          >

            Salir

          </button>

        ) : (

          <button
            onClick={abrirLogin}
            className="bg-[#6D213C] hover:bg-[#52172d] transition text-white px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center gap-2"
          >

            <FaIceCream />

            Login

          </button>

        )}

      </div>

    </nav>

  )
}

export default Navbar