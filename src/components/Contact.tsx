import { useState } from "react";

const Contact = () => {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [messageText, setMessageText] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

  const message = `
    🏠 Lar & Soluções

    👤 Nome: ${name}
    📞 Telefone: ${phone}
    🛠️ Serviço: ${service}

    📝 Mensagem:
    ${messageText}
    `;

      const phoneNumber = "5561995646646"; // seu número aqui

      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank");
    };
  return (
    <section className="w-full py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Fale com a <span className="text-sky-600">gente</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
            Solicite um orçamento rápido ou tire suas dúvidas. Resposta ágil via WhatsApp ou formulário.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* INFO / CTA */}
          <div className="space-y-6">

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Atendimento rápido
              </h3>
              <p className="text-slate-500 text-sm">
                Respondemos sua solicitação o mais rápido possível com solução clara e objetiva.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Orçamento sem compromisso
              </h3>
              <p className="text-slate-500 text-sm">
                Avaliamos seu problema e entregamos a melhor solução com transparência.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Atendimento residencial completo
              </h3>
              <p className="text-slate-500 text-sm">
                Hidráulica, elétrica, montagem e manutenção geral.
              </p>
            </div>

            {/* WHATSAPP CTA */}
            <a
              href="https://wa.me/5561995646646"
              target="_blank"
              rel="noreferrer"
              className="block text-center px-6 py-4 rounded-2xl bg-green-500 text-white font-semibold shadow-lg hover:bg-green-600 hover:scale-[1.02] transition"
            >
              Falar no WhatsApp
            </a>

          </div>

          {/* FORM */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

            <h3 className="text-xl font-semibold text-slate-800 mb-6">
              Solicitar orçamento
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

             <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border"
            />

              <input
                type="tel"
                placeholder="Seu telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              >
                <option>Tipo de serviço</option>
                <option>Elétrica</option>
                <option>Hidráulica</option>
                <option>Montagem</option>
                <option>Manutenção geral</option>
              </select>

              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-700 hover:scale-[1.02] transition"
              >
                Enviar solicitação
              </button>

            </form>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;