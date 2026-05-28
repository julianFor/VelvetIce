import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

import Modal from 'react-modal'

import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch
} from 'react-icons/fa'

import toast, { Toaster } from 'react-hot-toast'

Modal.setAppElement('#root')

function Ingredientes({ session }) {

  const [ingredientes, setIngredientes] = useState([])

  const [busqueda, setBusqueda] = useState('')

  const [modalCrear, setModalCrear] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)

  const [ingredienteActual, setIngredienteActual] =
    useState(null)

  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [calorias, setCalorias] = useState('')
  const [inventario, setInventario] = useState('')

  const [rol, setRol] = useState('publico')

  useEffect(() => {

    obtenerIngredientes()

    if (session?.user?.email) {
      obtenerRol()
    } else {
      setRol('publico')
    }

  }, [session])

  async function obtenerRol() {

    const email =
      session?.user?.email?.toLowerCase()

    if (
      email ===
      'drubiano@uniandes.edu.co'
    ) {

      setRol('admin')

    } else if (
      email ===
      'drubiano000@gmail.com'
    ) {

      setRol('empleado')

    } else if (
      email ===
      'drubiano@live.com'
    ) {

      setRol('cliente')

    } else {

      setRol('publico')

    }
  }

  async function obtenerIngredientes() {

    const { data, error } = await supabase
      .from('ingredientes')
      .select('*')
      .order('id')

    if (!error) {
      setIngredientes(data)
    }
  }

  function validarPermiso() {

    // SOLO ADMIN Y EMPLEADO

    if (
      rol !== 'admin' &&
      rol !== 'empleado'
    ) {

      toast.error(
        'No tienes permisos para gestionar ingredientes'
      )

      return false
    }

    return true
  }

  async function crearIngrediente() {

    if (!validarPermiso()) return

    const { error } = await supabase
      .from('ingredientes')
      .insert([
        {
          nombre,
          precio,
          calorias,
          inventario,
          tipo: 'base'
        }
      ])

    if (!error) {

      toast.success(
        'Ingrediente creado correctamente'
      )

      cerrarModales()
      obtenerIngredientes()

    } else {

      toast.error(
        'Error creando ingrediente'
      )
    }
  }

  async function editarIngrediente() {

    if (!validarPermiso()) return

    const { error } = await supabase
      .from('ingredientes')
      .update({
        nombre,
        precio,
        calorias,
        inventario
      })
      .eq('id', ingredienteActual.id)

    if (!error) {

      toast.success(
        'Ingrediente actualizado'
      )

      cerrarModales()
      obtenerIngredientes()

    } else {

      toast.error(
        'Error actualizando ingrediente'
      )
    }
  }

  async function eliminarIngrediente(id) {

    if (!validarPermiso()) return

    const confirmar = confirm(
      '¿Eliminar ingrediente?'
    )

    if (!confirmar) return

    const { error } = await supabase
      .from('ingredientes')
      .delete()
      .eq('id', id)

    if (!error) {

      toast.success(
        'Ingrediente eliminado'
      )

      obtenerIngredientes()

    } else {

      toast.error(
        'Error eliminando ingrediente'
      )
    }
  }

  function abrirEditar(ingrediente) {

    if (!validarPermiso()) return

    setIngredienteActual(ingrediente)

    setNombre(ingrediente.nombre)
    setPrecio(ingrediente.precio)
    setCalorias(ingrediente.calorias)
    setInventario(ingrediente.inventario)

    setModalEditar(true)
  }

  function cerrarModales() {

    setModalCrear(false)
    setModalEditar(false)

    setNombre('')
    setPrecio('')
    setCalorias('')
    setInventario('')

    setIngredienteActual(null)
  }

  const ingredientesFiltrados =
    ingredientes.filter((ingrediente) =>
      ingrediente.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    )

  return (

    <div className="max-w-7xl mx-auto pb-20">

      <Toaster position="top-right" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">

        <div>

          <p className="uppercase tracking-[0.3em] text-sm text-[#6D213C] font-semibold">

            Dashboard Premium

          </p>

          <h1 className="text-5xl font-black text-[#1F1F1F] mt-3">

            Ingredientes

          </h1>

        </div>

        <button
          onClick={() => {

            if (!validarPermiso()) return

            setModalCrear(true)
          }}
          className="bg-[#6D213C] hover:bg-[#52172d] transition text-white px-7 py-4 rounded-2xl font-semibold flex items-center gap-3 shadow-xl"
        >

          <FaPlus />

          Nuevo Ingrediente

        </button>

      </div>

      <div className="bg-white rounded-[2rem] p-5 shadow-md border border-black/5 mb-10 flex items-center gap-4">

        <FaSearch className="text-gray-400" />

        <input
          className="w-full outline-none text-lg"
          type="text"
          placeholder="Buscar ingrediente..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
        />

      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {ingredientesFiltrados.map((ingrediente) => (

          <div
            key={ingrediente.id}
            className="bg-white rounded-[2rem] p-6 shadow-md border border-black/5 hover:shadow-xl transition"
          >

            <div className="flex justify-between items-start">

              <div>

                <p className="uppercase text-[10px] tracking-[0.3em] text-[#6D213C] font-bold mb-2">

                  Ingrediente

                </p>

                <h2 className="text-2xl font-bold text-[#1F1F1F]">

                  {ingrediente.nombre}

                </h2>

              </div>

              <div className="bg-[#1F1F1F] text-[#C9A66B] px-3 py-2 rounded-xl text-xs font-bold">

                ${ingrediente.precio}

              </div>

            </div>

            <div className="mt-5 space-y-2 text-gray-600">

              <p>
                🔥 {ingrediente.calorias} calorías
              </p>

              <p>
                📦 Stock:
                {' '}
                {ingrediente.inventario}
              </p>

            </div>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() =>
                  abrirEditar(ingrediente)
                }
                className="flex-1 bg-[#1F1F1F] hover:bg-black transition text-white py-3 rounded-xl flex justify-center"
              >

                <FaEdit />

              </button>

              <button
                onClick={() =>
                  eliminarIngrediente(
                    ingrediente.id
                  )
                }
                className="flex-1 bg-[#6D213C] hover:bg-[#52172d] transition text-white py-3 rounded-xl flex justify-center"
              >

                <FaTrash />

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL CREAR */}

      <Modal
        isOpen={modalCrear}
        onRequestClose={cerrarModales}
        className="bg-white max-w-md mx-auto mt-24 p-8 rounded-[2rem] outline-none"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center"
      >

        <h2 className="text-3xl font-black mb-8 text-[#1F1F1F]">

          Nuevo Ingrediente

        </h2>

        <div className="space-y-5">

          <div>

            <label className="text-sm font-semibold text-gray-600 block mb-2">

              Nombre del ingrediente

            </label>

            <input
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#6D213C]"
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-semibold text-gray-600 block mb-2">

              Precio

            </label>

            <input
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#6D213C]"
              type="number"
              value={precio}
              onChange={(e) =>
                setPrecio(e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-semibold text-gray-600 block mb-2">

              Calorías

            </label>

            <input
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#6D213C]"
              type="number"
              value={calorias}
              onChange={(e) =>
                setCalorias(e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-semibold text-gray-600 block mb-2">

              Cantidad en inventario

            </label>

            <input
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#6D213C]"
              type="number"
              value={inventario}
              onChange={(e) =>
                setInventario(e.target.value)
              }
            />

          </div>

          <button
            onClick={crearIngrediente}
            className="w-full bg-[#6D213C] hover:bg-[#52172d] transition text-white py-4 rounded-2xl font-semibold"
          >

            Crear Ingrediente

          </button>

        </div>

      </Modal>

      {/* MODAL EDITAR */}

      <Modal
        isOpen={modalEditar}
        onRequestClose={cerrarModales}
        className="bg-white max-w-md mx-auto mt-24 p-8 rounded-[2rem] outline-none"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center"
      >

        <h2 className="text-3xl font-black mb-8 text-[#1F1F1F]">

          Editar Ingrediente

        </h2>

        <div className="space-y-5">

          <div>

            <label className="text-sm font-semibold text-gray-600 block mb-2">

              Nombre del ingrediente

            </label>

            <input
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#6D213C]"
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-semibold text-gray-600 block mb-2">

              Precio

            </label>

            <input
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#6D213C]"
              type="number"
              value={precio}
              onChange={(e) =>
                setPrecio(e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-semibold text-gray-600 block mb-2">

              Calorías

            </label>

            <input
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#6D213C]"
              type="number"
              value={calorias}
              onChange={(e) =>
                setCalorias(e.target.value)
              }
            />

          </div>

          <div>

            <label className="text-sm font-semibold text-gray-600 block mb-2">

              Cantidad en inventario

            </label>

            <input
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#6D213C]"
              type="number"
              value={inventario}
              onChange={(e) =>
                setInventario(e.target.value)
              }
            />

          </div>

          <button
            onClick={editarIngrediente}
            className="w-full bg-[#1F1F1F] hover:bg-black transition text-white py-4 rounded-2xl font-semibold"
          >

            Guardar Cambios

          </button>

        </div>

      </Modal>

    </div>

  )
}

export default Ingredientes