import {
  FaStar,
  FaIceCream,
  FaCrown,
  FaLeaf,
  FaHeart,
  FaArrowRight,
  FaQuoteLeft
} from 'react-icons/fa'

function Home() {

  return (

    <div className="max-w-7xl mx-auto pb-24">

      {/* HERO */}
      <section className="grid lg:grid-cols-2 gap-16 items-center min-h-[88vh] relative overflow-hidden">

        {/* decoración fondo */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#6D213C]/10 rounded-full blur-3xl -z-10" />

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C9A66B]/10 rounded-full blur-3xl -z-10" />

        {/* texto */}
        <div>

          <div className="inline-flex items-center gap-3 bg-white border border-[#6D213C]/10 shadow-sm px-5 py-3 rounded-full">

            <FaCrown className="text-[#C9A66B]" />

            <span className="uppercase tracking-[0.25em] text-xs font-bold text-[#6D213C]">

              Experiencia Gourmet

            </span>

          </div>

          <h1 className="text-6xl lg:text-7xl font-black leading-[1] mt-8 text-[#1F1F1F]">

            El arte
            <br />

            <span className="text-[#6D213C]">
              del helado
            </span>

          </h1>

          <p className="text-gray-600 text-lg mt-8 leading-relaxed max-w-xl">

            Velvet Ice transforma ingredientes premium en
            experiencias únicas. Helados artesanales,
            malteadas exclusivas y sabores inspirados
            en la alta cocina moderna.

          </p>

          {/* stats */}
          <div className="flex flex-wrap gap-5 mt-10">

            <div className="bg-white rounded-3xl px-6 py-5 shadow-md border border-black/5 min-w-[140px]">

              <p className="text-3xl font-black text-[#6D213C]">
                25+
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Sabores exclusivos
              </p>

            </div>

            <div className="bg-white rounded-3xl px-6 py-5 shadow-md border border-black/5 min-w-[140px]">

              <p className="text-3xl font-black text-[#6D213C]">
                100%
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Artesanal
              </p>

            </div>

            <div className="bg-white rounded-3xl px-6 py-5 shadow-md border border-black/5 min-w-[140px]">

              <p className="text-3xl font-black text-[#6D213C]">
                Premium
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Ingredientes top
              </p>

            </div>

          </div>

          {/* botones */}
          <div className="flex flex-wrap gap-4 mt-10">

            <button className="bg-[#6D213C] hover:bg-[#52172d] transition text-white px-8 py-4 rounded-2xl font-semibold shadow-xl text-sm flex items-center gap-3">

              Explorar menú

              <FaArrowRight />

            </button>

            <button className="border border-[#C9A66B] bg-white hover:bg-[#C9A66B]/10 transition px-8 py-4 rounded-2xl font-semibold text-sm">

              Ver colección premium

            </button>

          </div>

        </div>

        {/* imágenes */}
        <div className="relative flex justify-center items-center">

          {/* glow */}
          <div className="absolute w-[500px] h-[500px] bg-[#6D213C]/10 blur-3xl rounded-full" />

          {/* imagen principal */}
          <img
            className="relative z-20 w-[320px] lg:w-[420px] rounded-[3rem] shadow-2xl object-cover border-8 border-white rotate-[-4deg]"
            src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop"
            alt="Helado premium"
          />

          {/* imagen flotante */}
          <img
            className="absolute bottom-[-30px] left-0 z-30 w-44 h-44 rounded-[2rem] object-cover shadow-2xl border-4 border-white rotate-[8deg]"
            src="https://images.unsplash.com/photo-1579954115563-e72bf1381629?q=80&w=1200&auto=format&fit=crop"
            alt="Malteada"
          />

          {/* card flotante */}
          <div className="absolute top-10 -right-6 z-30 bg-white rounded-3xl shadow-2xl p-5 border border-black/5 w-52">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-[#6D213C] flex items-center justify-center">

                <FaIceCream className="text-white" />

              </div>

              <div>

                <p className="font-black text-[#1F1F1F]">
                  Velvet Special
                </p>

                <p className="text-xs text-gray-400">
                  Edición limitada
                </p>

              </div>

            </div>

            <div className="flex items-center gap-1 mt-4 text-[#C9A66B]">

              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />

              <span className="ml-2 text-sm text-gray-500">
                5.0
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6 mt-16">

        <div className="bg-white rounded-[2rem] p-8 shadow-md border border-black/5 hover:shadow-xl transition">

          <div className="w-16 h-16 rounded-3xl bg-[#6D213C]/10 flex items-center justify-center mb-6">

            <FaLeaf className="text-[#6D213C] text-2xl" />

          </div>

          <h3 className="text-2xl font-black text-[#1F1F1F]">

            Ingredientes frescos

          </h3>

          <p className="text-gray-500 mt-4 leading-relaxed">

            Seleccionamos ingredientes premium
            para garantizar sabores únicos
            y una textura excepcional.

          </p>

        </div>

        <div className="bg-[#1F1F1F] rounded-[2rem] p-8 shadow-md text-white relative overflow-hidden">

          <div className="absolute top-0 right-0 w-44 h-44 bg-[#C9A66B]/10 rounded-full blur-3xl" />

          <div className="relative z-10">

            <div className="w-16 h-16 rounded-3xl bg-[#C9A66B] flex items-center justify-center mb-6">

              <FaCrown className="text-[#1F1F1F] text-2xl" />

            </div>

            <h3 className="text-2xl font-black">

              Experiencia de lujo

            </h3>

            <p className="text-gray-300 mt-4 leading-relaxed">

              Un concepto elegante inspirado
              en la alta cocina y los postres
              más sofisticados del mundo.

            </p>

          </div>

        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-md border border-black/5 hover:shadow-xl transition">

          <div className="w-16 h-16 rounded-3xl bg-[#C9A66B]/20 flex items-center justify-center mb-6">

            <FaHeart className="text-[#6D213C] text-2xl" />

          </div>

          <h3 className="text-2xl font-black text-[#1F1F1F]">

            Hecho con pasión

          </h3>

          <p className="text-gray-500 mt-4 leading-relaxed">

            Cada receta busca crear una experiencia
            memorable desde la primera cucharada.

          </p>

        </div>

      </section>

      {/* TESTIMONIAL */}
      <section className="mt-24">

        <div className="bg-gradient-to-r from-[#6D213C] to-[#1F1F1F] rounded-[3rem] p-10 lg:p-16 text-white relative overflow-hidden">

          <div className="absolute top-0 right-0 w-72 h-72 bg-[#C9A66B]/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-3xl">

            <FaQuoteLeft className="text-[#C9A66B] text-5xl mb-6" />

            <h2 className="text-3xl lg:text-5xl font-black leading-tight">

              “Probablemente la mejor experiencia
              de helados premium en la ciudad.”

            </h2>

            <p className="mt-6 text-gray-300 text-lg">

              Velvet Ice combina diseño,
              gastronomía y tecnología en una
              experiencia moderna y elegante.

            </p>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="mt-24 border-t border-black/5 pt-10 flex flex-col md:flex-row justify-between gap-8">

        <div>

          <h3 className="text-3xl font-black text-[#6D213C]">

            Velvet Ice

          </h3>

          <p className="text-gray-500 mt-3 max-w-sm">

            Luxury Ice Cream Experience.
            Alta cocina convertida en postre.

          </p>

        </div>

        <div className="flex gap-10">

          <div>

            <p className="font-bold text-[#1F1F1F] mb-4">
              Navegación
            </p>

            <div className="space-y-2 text-gray-500 text-sm">

              <p>Home</p>
              <p>Productos</p>
              <p>Ingredientes</p>

            </div>

          </div>

          <div>

            <p className="font-bold text-[#1F1F1F] mb-4">
              Contacto
            </p>

            <div className="space-y-2 text-gray-500 text-sm">

              <p>Bogotá, Colombia</p>
              <p>velvetice@premium.com</p>
              <p>+57 300 000 0000</p>

            </div>

          </div>

        </div>

      </footer>

    </div>

  )
}

export default Home