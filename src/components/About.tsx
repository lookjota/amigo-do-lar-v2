import img1 from "../assets/img1.jpg";

const About = () => {
  return (
    <div>
      <section className="py-20 px-6 bg-gray-50">
  <div className="max-w-6xl mx-auto">

    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900">
        Sobre a Lar & Soluções
      </h2>

      <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Cuidamos do seu lar com profissionalismo, qualidade e compromisso,
        oferecendo soluções completas para pequenos reparos, instalações e
        manutenções residenciais.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-12 items-center">

      {/* Texto */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Nossa Missão
        </h3>

        <p className="text-gray-600 leading-8 mb-6">
          Nosso objetivo é proporcionar tranquilidade aos nossos clientes,
          realizando cada serviço com responsabilidade, atenção aos detalhes e
          respeito pelo seu patrimônio.
        </p>

        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Profissionais qualificados</span>
          </li>

          <li className="flex items-center gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Atendimento rápido e eficiente</span>
          </li>

          <li className="flex items-center gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Qualidade garantida</span>
          </li>

          <li className="flex items-center gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <span>Preço justo e transparência</span>
          </li>
        </ul>
        <section id="atendimento" className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-6">
              Áreas de Atendimento
            </h2>

            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
              O <strong>Amigo do Lar</strong> atende residências em diversas regiões do
              Distrito Federal, realizando serviços de marido de aluguel em Brasília, 
              Águas Claras, Taguatinga, Guará, Ceilândia, Samambaia e demais regiões do Distrito Federal. 
              Nossa equipe executa instalações, pequenos reparos, serviços elétricos, hidráulicos e montagem de móveis com qualidade, 
              pontualidade e garantia.
            </p>

                      <div className="flex flex-wrap gap-3">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Taguatinga
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Riacho Fundo I
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Núcleo Bandeirante
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Candangolândia
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Águas Claras
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Guará
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Asa Sul
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Asa Norte
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Cruzeiro
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Sudoeste
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Noroeste
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Octogonal
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Lago Sul
            </span>

            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Lago Norte
            </span>
          </div>
          </div>
        </section>

        <div className="mt-10">



        </div>

        
      </div>

      {/* Imagem */}
      <div>
        <img
          src={img1}
          alt="Profissional realizando manutenção"
          className="rounded-2xl shadow-xl w-full object-cover"
        />
      </div>

    </div>

  </div>
</section>
    </div>
  )
}

export default About