import { useEffect, useState } from 'react'

import { supabase } from '../../lib/supabase'

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaLayerGroup,
  FaChevronRight,
  FaCheck,
  FaFlask
} from 'react-icons/fa'

// ── Utilidad: clases de input ─────────────────────────────────────────────────

const inputCls =
  'w-full border border-gray-200 focus:border-[#C9A66B] rounded-2xl p-4 outline-none transition text-[#1F1F1F] placeholder-gray-300 bg-white'

const labelCls =
  'block text-[10px] uppercase tracking-[0.25em] text-[#6D213C] font-bold mb-1.5'

// ── Modal principal: crear / editar producto ──────────────────────────────────

function ModalProducto({ editando, onClose, onGuardado }) {

  const inicial = {
    nombre: '',
    precio_publico: '',
    tipo: 'copa',
    vaso: '',
    volumen_onzas: ''
  }

  const [formulario, setFormulario] = useState(
    editando ? { ...editando } : inicial
  )

  const [guardando, setGuardando] = useState(false)

  function campo(key, value) {
    setFormulario(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGuardando(true)

    if (editando) {
      const { error } = await supabase
        .from('productos')
        .update({
          nombre: formulario.nombre,
          precio_publico: formulario.precio_publico,
          tipo: formulario.tipo,
          vaso: formulario.vaso,
          volumen_onzas: formulario.volumen_onzas
        })
        .eq('id', editando.id)

      if (error) console.error(error)

    } else {
      const { error } = await supabase
        .from('productos')
        .insert([formulario])

      if (error) console.error(error)
    }

    setGuardando(false)
    onGuardado()
    onClose()
  }

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >

      <div
        className="bg-white rounded-[2.5rem] w-full max-w-xl p-9 shadow-2xl"
        style={{ border: '1px solid rgba(201,166,107,0.2)' }}
        onClick={e => e.stopPropagation()}
      >

        {/* Cabecera */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="uppercase tracking-[0.3em] text-[10px] text-[#6D213C] font-bold">
              {editando ? 'Modificar' : 'Registrar'}
            </p>
            <h2 className="text-3xl font-black text-[#1F1F1F] mt-1">
              {editando ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className={labelCls}>Nombre</label>
            <input
              type="text"
              className={inputCls}
              placeholder="Ej. Copa Velvet Fresa"
              value={formulario.nombre}
              onChange={e => campo('nombre', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className={labelCls}>Precio público</label>
              <input
                type="number"
                className={inputCls}
                placeholder="0.00"
                value={formulario.precio_publico}
                onChange={e => campo('precio_publico', e.target.value)}
                required
              />
            </div>

            <div>
              <label className={labelCls}>Tipo</label>
              <select
                className={inputCls}
                value={formulario.tipo}
                onChange={e => campo('tipo', e.target.value)}
              >
                <option value="copa">Copa</option>
                <option value="malteada">Malteada</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className={labelCls}>Tipo de vaso</label>
              <input
                type="text"
                className={inputCls}
                placeholder="Ej. Vidrio largo"
                value={formulario.vaso}
                onChange={e => campo('vaso', e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Volumen (oz)</label>
              <input
                type="number"
                className={inputCls}
                placeholder="Ej. 12"
                value={formulario.volumen_onzas}
                onChange={e => campo('volumen_onzas', e.target.value)}
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="px-8 py-3 rounded-2xl text-sm font-semibold transition flex items-center gap-2"
              style={{ backgroundColor: '#6D213C', color: '#fff' }}
            >
              {guardando
                ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                : <FaCheck />
              }
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>

          </div>

        </form>

      </div>

    </div>

  )

}

// ── Modal: gestionar ingredientes del producto ────────────────────────────────

function ModalIngredientes({ producto, onClose }) {

  const [todosIngredientes, setTodosIngredientes] = useState([])
  const [asociados, setAsociados] = useState([])   // IDs asociados
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(null)  // ID del que se está toggling

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    setCargando(true)

    const [{ data: ings }, { data: asocs }] = await Promise.all([
      supabase.from('ingredientes').select('*').order('nombre'),
      supabase
        .from('producto_ingrediente')
        .select('ingrediente_id')
        .eq('producto_id', producto.id)
    ])

    setTodosIngredientes(ings ?? [])
    setAsociados((asocs ?? []).map(a => a.ingrediente_id))

    setCargando(false)
  }

  async function toggleIngrediente(ingId) {
    setGuardando(ingId)
    const estaAsociado = asociados.includes(ingId)

    if (estaAsociado) {
      await supabase
        .from('producto_ingrediente')
        .delete()
        .eq('producto_id', producto.id)
        .eq('ingrediente_id', ingId)

      setAsociados(prev => prev.filter(id => id !== ingId))

    } else {
      await supabase
        .from('producto_ingrediente')
        .insert([{ producto_id: producto.id, ingrediente_id: ingId }])

      setAsociados(prev => [...prev, ingId])
    }

    setGuardando(null)
  }

  const filtrados = todosIngredientes.filter(i =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const costoTotal = todosIngredientes
    .filter(i => asociados.includes(i.id))
    .reduce((acc, i) => acc + parseFloat(i.precio ?? 0), 0)

  const rentabilidad = producto.precio_publico
    ? (((parseFloat(producto.precio_publico) - costoTotal) / parseFloat(producto.precio_publico)) * 100).toFixed(1)
    : null

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >

      <div
        className="bg-white rounded-[2.5rem] w-full max-w-2xl flex flex-col shadow-2xl"
        style={{ maxHeight: '90vh', border: '1px solid rgba(201,166,107,0.2)' }}
        onClick={e => e.stopPropagation()}
      >

        {/* Cabecera */}
        <div className="flex-shrink-0 px-8 pt-8 pb-5"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>

          <div className="flex items-start justify-between">
            <div>
              <p className="uppercase tracking-[0.3em] text-[10px] text-[#6D213C] font-bold">
                Ingredientes
              </p>
              <h2 className="text-2xl font-black text-[#1F1F1F] mt-1">
                {producto.nombre}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          {/* KPIs rápidos */}
          {!cargando && (
            <div className="flex gap-3 mt-5">
              <div className="flex-1 rounded-2xl px-4 py-3 text-center"
                style={{ backgroundColor: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Seleccionados</p>
                <p className="text-xl font-black text-[#1F1F1F]">{asociados.length}</p>
              </div>
              <div className="flex-1 rounded-2xl px-4 py-3 text-center"
                style={{ backgroundColor: '#fff8f0', border: '1px solid rgba(201,166,107,0.2)' }}>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Costo</p>
                <p className="text-xl font-black text-[#1F1F1F]">
                  ${costoTotal.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div className="flex-1 rounded-2xl px-4 py-3 text-center"
                style={{ backgroundColor: rentabilidad > 0 ? '#f0faf4' : '#fff5f5', border: `1px solid ${rentabilidad > 0 ? 'rgba(46,125,50,0.15)' : 'rgba(220,38,38,0.15)'}` }}>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Rentabilidad</p>
                <p className="text-xl font-black" style={{ color: rentabilidad > 0 ? '#2e7d32' : '#dc2626' }}>
                  {rentabilidad !== null ? `${rentabilidad}%` : '—'}
                </p>
              </div>
            </div>
          )}

          {/* Buscador */}
          <div className="mt-4 flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3"
            style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <FaSearch className="text-gray-300 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar ingrediente…"
              className="w-full bg-transparent outline-none text-sm text-[#1F1F1F] placeholder-gray-300"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto px-8 py-5 space-y-2">

          {cargando ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-[#C9A66B] border-t-transparent animate-spin" />
              <span className="text-sm text-gray-400">Cargando ingredientes…</span>
            </div>
          ) : filtrados.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">
              No se encontraron ingredientes.
            </p>
          ) : filtrados.map(ing => {

            const seleccionado = asociados.includes(ing.id)
            const cargandoEste = guardando === ing.id

            return (

              <button
                key={ing.id}
                onClick={() => toggleIngrediente(ing.id)}
                disabled={cargandoEste}
                className="w-full flex items-center justify-between rounded-2xl px-5 py-4 transition text-left"
                style={{
                  backgroundColor: seleccionado ? 'rgba(109,33,60,0.05)' : '#fafafa',
                  border: seleccionado
                    ? '1.5px solid rgba(109,33,60,0.3)'
                    : '1.5px solid rgba(0,0,0,0.06)',
                  opacity: cargandoEste ? 0.6 : 1
                }}
              >

                <div className="flex items-center gap-4">

                  {/* Checkbox visual */}
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition"
                    style={{
                      backgroundColor: seleccionado ? '#6D213C' : '#fff',
                      border: seleccionado ? '2px solid #6D213C' : '2px solid #e5e7eb'
                    }}
                  >
                    {cargandoEste
                      ? <div className="w-3 h-3 rounded-full border-2 border-[#C9A66B] border-t-transparent animate-spin" />
                      : seleccionado && <FaCheck className="text-white text-[9px]" />
                    }
                  </div>

                  <div>
                    <p className="font-semibold text-sm text-[#1F1F1F]">{ing.nombre}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                      {[ing.tipo, ing.sabor].filter(Boolean).join(' · ')}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-5 text-right flex-shrink-0">

                  <div>
                    <p className="text-[10px] text-gray-400">Cal</p>
                    <p className="text-sm font-bold text-[#1F1F1F]">{ing.calorias ?? '—'}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400">Costo</p>
                    <p className="text-sm font-bold text-[#6D213C]">
                      ${parseFloat(ing.precio ?? 0).toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400">Inv.</p>
                    <p className="text-sm font-bold text-[#1F1F1F]">{ing.inventario ?? '—'}</p>
                  </div>

                </div>

              </button>

            )

          })}

        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-8 py-5"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl text-sm font-semibold transition"
            style={{ backgroundColor: '#1F1F1F', color: '#C9A66B', letterSpacing: '0.05em' }}
          >
            Listo
          </button>
        </div>

      </div>

    </div>

  )

}

// ── Componente principal ──────────────────────────────────────────────────────

function AdminProductos() {

  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')

  // modales
  const [modalProducto, setModalProducto] = useState(false)   // crear/editar
  const [editando, setEditando] = useState(null)
  const [modalIngredientes, setModalIngredientes] = useState(null) // producto seleccionado

  useEffect(() => {
    obtenerProductos()
  }, [])

  async function obtenerProductos() {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: false })

    if (error) console.error(error)
    else setProductos(data)
  }

  function abrirCrear() {
    setEditando(null)
    setModalProducto(true)
  }

  function abrirEditar(producto) {
    setEditando(producto)
    setModalProducto(true)
  }

  async function eliminarProducto(id) {
    if (!confirm('¿Eliminar este producto? También se eliminarán sus asociaciones con ingredientes.')) return

    await supabase.from('producto_ingrediente').delete().eq('producto_id', id)
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) console.error(error)
    else obtenerProductos()
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (

    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        <div>
          <p className="uppercase tracking-[0.3em] text-xs text-[#6D213C] font-bold">
            Panel Administrativo
          </p>
          <h1 className="text-5xl font-black text-[#1F1F1F] mt-3">
            Gestión de Productos
          </h1>
        </div>

        <button
          onClick={abrirCrear}
          className="bg-[#6D213C] hover:bg-[#52172d] text-white px-7 py-4 rounded-2xl flex items-center gap-3 font-semibold shadow-xl transition"
        >
          <FaPlus />
          Nuevo Producto
        </button>

      </div>

      {/* Buscador */}
      <div className="bg-white rounded-3xl p-5 shadow-md mb-8 border border-black/5 flex items-center gap-3">
        <FaSearch className="text-gray-300" />
        <input
          type="text"
          placeholder="Buscar producto…"
          className="w-full outline-none text-[#1F1F1F] placeholder-gray-300"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-3xl shadow-md border border-black/5">

        <table className="w-full">

          <thead style={{ backgroundColor: '#1F1F1F', color: '#fff' }}>
            <tr>
              <th className="text-left p-5 font-semibold text-sm">Nombre</th>
              <th className="text-left p-5 font-semibold text-sm">Tipo</th>
              <th className="text-left p-5 font-semibold text-sm">Precio</th>
              <th className="text-left p-5 font-semibold text-sm">Vaso</th>
              <th className="text-left p-5 font-semibold text-sm">Onzas</th>
              <th className="text-center p-5 font-semibold text-sm">Ingredientes</th>
              <th className="text-center p-5 font-semibold text-sm">Acciones</th>
            </tr>
          </thead>

          <tbody>

            {productosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                  No hay productos registrados.
                </td>
              </tr>
            ) : productosFiltrados.map(producto => (

              <tr
                key={producto.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >

                <td className="p-5 font-semibold text-[#1F1F1F]">
                  {producto.nombre}
                </td>

                <td className="p-5">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: producto.tipo === 'copa' ? '#fff8f0' : '#f5f0fa',
                      color: producto.tipo === 'copa' ? '#C9A66B' : '#6D213C'
                    }}
                  >
                    {producto.tipo}
                  </span>
                </td>

                <td className="p-5 font-semibold text-[#1F1F1F]">
                  ${parseFloat(producto.precio_publico).toLocaleString('es-CO')}
                </td>

                <td className="p-5 text-gray-500 text-sm">{producto.vaso || '—'}</td>

                <td className="p-5 text-gray-500 text-sm">
                  {producto.volumen_onzas ? `${producto.volumen_onzas} oz` : '—'}
                </td>

                {/* Botón ingredientes */}
                <td className="p-5">
                  <div className="flex justify-center">
                    <button
                      onClick={() => setModalIngredientes(producto)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition hover:shadow-md"
                      style={{
                        backgroundColor: '#fafafa',
                        border: '1.5px solid rgba(109,33,60,0.2)',
                        color: '#6D213C'
                      }}
                    >
                      <FaLayerGroup className="text-[#C9A66B]" />
                      Gestionar
                      <FaChevronRight className="text-[8px] opacity-50" />
                    </button>
                  </div>
                </td>

                {/* Acciones */}
                <td className="p-5">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => abrirEditar(producto)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition hover:scale-105"
                      style={{ backgroundColor: '#1F1F1F', color: '#C9A66B' }}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => eliminarProducto(producto.id)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition hover:scale-105 bg-red-600 hover:bg-red-700 text-white"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>

                  </div>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Modal crear/editar */}
      {modalProducto && (
        <ModalProducto
          editando={editando}
          onClose={() => setModalProducto(false)}
          onGuardado={obtenerProductos}
        />
      )}

      {/* Modal ingredientes */}
      {modalIngredientes && (
        <ModalIngredientes
          producto={modalIngredientes}
          onClose={() => setModalIngredientes(null)}
        />
      )}

    </div>

  )

}

export default AdminProductos