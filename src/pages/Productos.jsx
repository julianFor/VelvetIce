import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

import {
  FaCrown,
  FaHeart,
  FaRegHeart,
  FaTimes,
  FaLeaf,
  FaFire,
  FaFlask,
  FaGlassWhiskey,
  FaLayerGroup,
  FaCheckCircle,
  FaShoppingBag
} from 'react-icons/fa'

// ── Modal de detalle ─────────────────────────────────────────────────────────

function ProductoModal({ producto, onClose }) {

  const [ingredientes, setIngredientes] = useState([])
  const [cargando, setCargando] = useState(true)

  const [vendiendo, setVendiendo] = useState(false)
  const [mensajeVenta, setMensajeVenta] = useState('')
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {

    if (!producto) return

    async function obtenerIngredientes() {

      setCargando(true)

      const { data, error } = await supabase
        .from('producto_ingrediente')
        .select(`
          ingrediente_id,
          ingredientes (
            id,
            nombre,
            precio,
            calorias,
            inventario,
            es_vegetariano,
            es_sano,
            tipo,
            sabor
          )
        `)
        .eq('producto_id', producto.id)

      if (error) {
        console.error(error)
      } else {
        setIngredientes(data.map(d => d.ingredientes))
      }

      setCargando(false)
    }

    obtenerIngredientes()

  }, [producto])

  if (!producto) return null

  const totalCalorias = ingredientes.reduce(
    (acc, ing) => acc + (ing?.calorias ?? 0), 0
  )

  const costoIngredientes = ingredientes.reduce(
    (acc, ing) => acc + (parseFloat(ing?.precio) ?? 0), 0
  )

  const rentabilidad = producto.precio_publico
    ? (((parseFloat(producto.precio_publico) - costoIngredientes) / parseFloat(producto.precio_publico)) * 100).toFixed(1)
    : null

  const esVegetariano = ingredientes.length > 0 && ingredientes.every(i => i?.es_vegetariano)
  const esSano = ingredientes.length > 0 && ingredientes.every(i => i?.es_sano)

  async function realizarVenta() {

    setMensajeVenta('')
    setVendiendo(true)

    try {

      // VALIDAR INVENTARIO
      for (const ingrediente of ingredientes) {

        if (ingrediente.inventario < cantidad) {

          setMensajeVenta(
            `Inventario insuficiente para ${ingrediente.nombre}`
          )

          setVendiendo(false)
          return
        }
      }

      // DESCONTAR INVENTARIO
      for (const ingrediente of ingredientes) {

        const nuevoInventario =
          ingrediente.inventario - cantidad

        const { error: errorInventario } = await supabase
          .from('ingredientes')
          .update({
            inventario: nuevoInventario
          })
          .eq('id', ingrediente.id)

        if (errorInventario) {
          console.error(errorInventario)
        }
      }

      // OBTENER SESIÓN
      const { data: sessionData } = await supabase.auth.getSession()

      const userId =
        sessionData?.session?.user?.id || null

      // CREAR VENTA
      const { error: errorVenta } = await supabase
        .from('ventas')
        .insert([
          {
            producto_id: producto.id,
            user_id: userId,
            cantidad: cantidad,
            total:
              parseFloat(producto.precio_publico) * cantidad
          }
        ])

      if (errorVenta) {
        console.error(errorVenta)
        setMensajeVenta('Error registrando la venta')
      } else {

        // ACTUALIZAR INVENTARIO EN FRONT
        const nuevosIngredientes = ingredientes.map(i => ({
          ...i,
          inventario: i.inventario - cantidad
        }))

        setIngredientes(nuevosIngredientes)

        setMensajeVenta(
          `Venta realizada correctamente x${cantidad}`
        )
      }

    } catch (error) {

      console.error(error)
      setMensajeVenta('Ocurrió un error inesperado')

    }

    setVendiendo(false)
  }

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0,0,0,0.55)'
      }}
      onClick={onClose}
    >

      <div
        className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        style={{
          border: '1px solid rgba(201,166,107,0.25)'
        }}
        onClick={e => e.stopPropagation()}
      >

        {/* Imagen */}
        <div className="relative h-56 overflow-hidden flex-shrink-0">

          <img
            className="w-full h-full object-cover"
            src={
              producto.tipo === 'copa'
                ? 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=1200&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?q=80&w=1200&auto=format&fit=crop'
            }
            alt={producto.nombre}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(31,31,31,0.8) 0%, transparent 55%)'
            }}
          />

          <div className="absolute bottom-0 left-0 p-7">

            <p className="uppercase tracking-[0.35em] text-[10px] text-[#C9A66B] font-bold mb-1">
              {producto.tipo}
            </p>

            <h2 className="text-3xl font-black text-white leading-tight">
              {producto.nombre}
            </h2>

          </div>

          <div
            className="absolute top-5 right-16 px-4 py-2 rounded-2xl text-sm font-bold shadow-lg"
            style={{
              backgroundColor: '#1F1F1F',
              color: '#C9A66B'
            }}
          >
            ${parseFloat(producto.precio_publico).toLocaleString()}
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition hover:scale-105"
            style={{
              backgroundColor: 'rgba(255,255,255,0.9)'
            }}
          >
            <FaTimes className="text-[#1F1F1F]" />
          </button>

        </div>

        {/* Contenido */}
        <div className="overflow-y-auto flex-1 p-7 space-y-7">

          {!cargando && (esVegetariano || esSano) && (

            <div className="flex gap-3 flex-wrap">

              {esVegetariano && (
                <span
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32'
                  }}
                >
                  <FaLeaf /> 100% Vegetariano
                </span>
              )}

              {esSano && (
                <span
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: '#e3f2fd',
                    color: '#1565c0'
                  }}
                >
                  <FaCheckCircle /> Opción Saludable
                </span>
              )}

            </div>

          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            <div
              className="rounded-2xl p-4 flex flex-col items-center gap-1 text-center"
              style={{
                backgroundColor: '#fff8f0',
                border: '1px solid rgba(201,166,107,0.2)'
              }}
            >
              <FaFire className="text-[#C9A66B] text-xl" />

              <p className="text-2xl font-black text-[#1F1F1F]">
                {cargando ? '—' : totalCalorias}
              </p>

              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                Calorías
              </p>

            </div>

            <div
              className="rounded-2xl p-4 flex flex-col items-center gap-1 text-center"
              style={{
                backgroundColor: '#fafafa',
                border: '1px solid rgba(0,0,0,0.07)'
              }}
            >
              <FaFlask className="text-[#6D213C] text-xl" />

              <p className="text-2xl font-black text-[#1F1F1F]">
                {cargando
                  ? '—'
                  : `$${costoIngredientes.toLocaleString('es-CO')}`}
              </p>

              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                Costo
              </p>

            </div>

            <div
              className="rounded-2xl p-4 flex flex-col items-center gap-1 text-center"
              style={{
                backgroundColor: '#f0faf4',
                border: '1px solid rgba(46,125,50,0.15)'
              }}
            >
              <FaCrown className="text-[#2e7d32] text-xl" />

              <p className="text-2xl font-black text-[#1F1F1F]">
                {cargando || rentabilidad === null
                  ? '—'
                  : `${rentabilidad}%`}
              </p>

              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                Rentabilidad
              </p>

            </div>

            <div
              className="rounded-2xl p-4 flex flex-col items-center gap-1 text-center"
              style={{
                backgroundColor: '#f5f0fa',
                border: '1px solid rgba(109,33,60,0.1)'
              }}
            >
              <FaGlassWhiskey className="text-[#6D213C] text-xl" />

              <p className="text-xl font-black text-[#1F1F1F]">
                {producto.volumen_onzas
                  ? `${producto.volumen_onzas} oz`
                  : '—'}
              </p>

              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                {producto.vaso || 'Presentación'}
              </p>

            </div>

          </div>

          {/* Venta */}
          <div
            className="rounded-[2rem] p-6"
            style={{
              background:
                'linear-gradient(135deg,#1F1F1F 0%, #3a1d28 100%)'
            }}
          >

            <div className="flex items-center gap-3 mb-5">

              <div className="w-12 h-12 rounded-2xl bg-[#C9A66B] flex items-center justify-center">
                <FaShoppingBag className="text-[#1F1F1F]" />
              </div>

              <div>
                <p className="text-[#C9A66B] text-xs uppercase tracking-[0.3em]">
                  Sistema de ventas
                </p>

                <h3 className="text-white font-black text-xl">
                  Compra
                </h3>
              </div>

            </div>

            <div className="flex gap-4 items-center">

              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) =>
                  setCantidad(Number(e.target.value))
                }
                className="bg-white/10 border border-white/10 text-white px-5 py-3 rounded-2xl w-28 outline-none"
              />

              <button
                onClick={realizarVenta}
                disabled={vendiendo}
                className="flex-1 bg-[#C9A66B] hover:opacity-90 transition py-3 rounded-2xl font-bold text-[#1F1F1F]"
              >
                {vendiendo
                  ? 'Procesando venta...'
                  : 'Realizar venta'}
              </button>

            </div>

            {mensajeVenta && (

              <div
                className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
                  mensajeVenta.includes('correctamente')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {mensajeVenta}
              </div>

            )}

          </div>

          {/* Ingredientes */}
          <div>

            <div className="flex items-center gap-2 mb-4">

              <FaLayerGroup className="text-[#6D213C]" />

              <h3 className="text-base font-black text-[#1F1F1F] uppercase tracking-widest text-xs">
                Ingredientes
              </h3>

            </div>

            {cargando ? (

              <div className="flex items-center gap-3 py-6 justify-center">

                <div className="w-5 h-5 rounded-full border-2 border-[#C9A66B] border-t-transparent animate-spin" />

                <span className="text-sm text-gray-400">
                  Cargando ingredientes…
                </span>

              </div>

            ) : ingredientes.length === 0 ? (

              <p className="text-sm text-gray-400 py-4 text-center">
                No hay ingredientes registrados.
              </p>

            ) : (

              <div className="space-y-3">

                {ingredientes.map((ing, idx) => (

                  <div
                    key={ing?.id ?? idx}
                    className="flex items-center justify-between rounded-2xl px-5 py-3"
                    style={{
                      backgroundColor: '#fafafa',
                      border: '1px solid rgba(0,0,0,0.06)'
                    }}
                  >

                    <div>

                      <p className="font-semibold text-sm text-[#1F1F1F]">
                        {ing?.nombre}
                      </p>

                      <p className="text-[10px] uppercase tracking-wider text-gray-400">
                        {ing?.tipo}
                        {ing?.sabor
                          ? ` · ${ing.sabor}`
                          : ''}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-xs text-gray-400">
                        Inventario
                      </p>

                      <p className="font-bold text-[#6D213C]">
                        {ing?.inventario}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-7 py-5 border-t border-black/5">

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl text-sm font-semibold transition"
            style={{
              backgroundColor: '#1F1F1F',
              color: '#C9A66B',
              letterSpacing: '0.05em'
            }}
          >
            Cerrar
          </button>

        </div>

      </div>

    </div>

  )

}

// ── Componente principal ─────────────────────────────────────────────────────

function Productos() {

  const [productos, setProductos] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  useEffect(() => {
    obtenerProductos()
  }, [])

  async function obtenerProductos() {

    const { data, error } = await supabase
      .from('productos')
      .select('*')

    if (error) {
      console.log(error)
    } else {
      setProductos(data)
    }
  }

  function toggleFavorito(id) {

    if (favoritos.includes(id)) {
      setFavoritos(
        favoritos.filter(favorito => favorito !== id)
      )
    } else {
      setFavoritos([...favoritos, id])
    }
  }

  return (

    <div className="max-w-7xl mx-auto">

      <div className="mb-14 flex justify-between items-end">

        <div>

          <p className="uppercase tracking-[0.35em] text-xs text-[#6D213C] font-semibold">
            Velvet Collection
          </p>

          <h1 className="text-4xl lg:text-5xl font-black text-[#1F1F1F] mt-3">
            Productos Exclusivos
          </h1>

        </div>

        <div className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-md border border-[#C9A66B]/20">

          <FaCrown className="text-[#C9A66B]" />

          <span className="text-sm text-gray-600">
            Gourmet Selection
          </span>

        </div>

      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {productos.map((producto) => (

          <div
            key={producto.id}
            className="group bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition duration-500 border border-black/5"
          >

            <div className="relative overflow-hidden">

              <img
                className="h-52 w-full object-cover group-hover:scale-105 transition duration-700"
                src={
                  producto.tipo === 'copa'
                    ? 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=1200&auto=format&fit=crop'
                    : 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?q=80&w=1200&auto=format&fit=crop'
                }
                alt={producto.nombre}
              />

              <button
                onClick={() => toggleFavorito(producto.id)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition"
              >

                {favoritos.includes(producto.id)
                  ? <FaHeart className="text-[#6D213C] text-lg" />
                  : <FaRegHeart className="text-[#6D213C] text-lg" />
                }

              </button>

            </div>

            <div className="p-5">

              <div className="flex justify-between items-start gap-3">

                <div>

                  <p className="uppercase text-[10px] tracking-[0.3em] text-[#6D213C] font-bold mb-2">
                    {producto.tipo}
                  </p>

                  <h2 className="text-xl font-bold text-[#1F1F1F] leading-snug">
                    {producto.nombre}
                  </h2>

                </div>

                <div className="bg-[#1F1F1F] text-[#C9A66B] px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm">
                  ${producto.precio_publico}
                </div>

              </div>

              <div className="mt-6">

                <button
                  onClick={() =>
                    setProductoSeleccionado(producto)
                  }
                  className="w-full border border-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-white transition py-3 rounded-2xl text-sm font-semibold text-[#1F1F1F]"
                >
                  Ver detalle
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {productoSeleccionado && (

        <ProductoModal
          producto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
        />

      )}

    </div>

  )

}

export default Productos