import Image from "../assets/head0.png";

const Hero = () => {
  return (
    <section className="w-full min-h-[calc(100vh-4rem)] flex items-center bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* TEXTO */}
        <div className="text-center md:text-left">
{/* 
          <p className="text-sky-600 font-semibold tracking-wide uppercase text-sm mb-3">
            Lar & Soluções
          </p> */}

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            Seu amigo do lar para serviços feitos com{" "}
            <span className="text-sky-600">confiança</span>
          </h1>

          <h2 className="mt-6 text-lg text-slate-600 leading-relaxed">
            
Marido de Aluguel em Brasília para Reparos e Manutenção Residencial

            
Amigo do Lar | Manutenção Residencial com Qualidade e Confiança

          </h2>

          {/* BOTÕES */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">

            <a href="#servicos" className="px-8 py-4 rounded-2xl bg-sky-600 text-white font-semibold shadow-lg hover:bg-sky-700 hover:scale-[1.03] transition">
              Ver serviços
            </a>

            <a href="#contato" className="px-8 py-4 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition">
              Solicitar orçamento
            </a>

          </div>

          {/* MINI BENEFÍCIOS */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start text-sm text-slate-500">
            <span>✔ Atendimento rápido</span>
            <span>✔ Profissionais experientes</span>
            <span>✔ Garantia de qualidade</span>
          </div>

        </div>

        {/* IMAGEM */}
        <div className="relative flex justify-center">

          <div className="absolute -inset-4 bg-gradient-to-tr from-sky-200 to-transparent blur-2xl opacity-50 rounded-3xl"></div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <img
              src={Image}
              alt="Serviços residenciais"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;

