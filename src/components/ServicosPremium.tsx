import { motion } from "framer-motion";
import {
  Wrench,
  Plug,
  Sofa,
  Hammer,
  ShieldCheck,
} from "lucide-react";

const data = [
  {
    title: "Hidráulica",
    icon: Wrench,
    items: [
      "Troca de torneiras", 
      "Chuveiros", 
      "Pequenos reparos hidráulicos",
      "Reparo hidráulico",
      "Troca de sifão",
      "Reparo em vazamentos"
    ],
    color: "text-blue-600",
  },
  {
    title: "Elétrica",
    icon: Plug,
    items: ["Eletricista",
       "Eletricista Residencial",
       "Luminárias", 
       "Ventiladores de teto",
       "Troca de tomadas",
       "instalação de tomadas",
       "Troca de interruptores",
       "instalação de lustres",
       "instalação de luminárias",
       "troca de chuveiro"
      ],
    color: "text-yellow-600",
  },
  {
    title: "Instalações",
    icon: Hammer,
    items: [
      "Instalação suportes para TV", 
      "Prateleiras", 
      "Quadros", 
      "Instalação de cortina",
      "Instalação de persiana",
      "Instalação de nichos",
      "Instalação de espelhos"
    ],
    color: "text-emerald-600",
  },
  {
    title: "Marcenaria / Montagem",
    icon: Sofa,
    items: [
      "Montagem de móveis", 
      "Portas", 
      "Fechaduras",
      "Montagem de guarda-roupa",
      "Montagem de painel",
      "Montagem de rack",
      "Montagem de estante"
    ],
    color: "text-purple-600",
  },
  {
    title: "Manutenção",
    icon: ShieldCheck,
    items: [
      "Manutenção preventiva residencial", 
      "Marido de aluguel", 
      "Manutenção residencial", 
      "Pequenos reparos", 
      "Instalação residencial", 
      "Manutenção predial", 
      "Reforma residencial"
    ],
    color: "text-slate-600",
  },
  {
    title: "Pintura",
    icon: ShieldCheck,
    items: [
      "Pintura residencial",
      "Pintura de parede",
      "Pintura de apartamentos"
    ],
    color: "text-slate-600",
  },
];

const ServicosPremium = () => {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Serviços para o seu <span className="text-sky-600">lar</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
            Soluções completas com acabamento profissional, segurança e atenção aos detalhes.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((cat, i) => {
            const Icon = cat.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* HEADER CARD */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-slate-100 group-hover:scale-110 transition">
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {cat.title}
                  </h3>
                </div>

                {/* ITEMS */}
                <ul className="space-y-2">
                  {cat.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-slate-600 text-sm flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 mt-2 rounded-full bg-slate-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="px-8 py-4 rounded-2xl bg-sky-600 text-white font-semibold shadow-lg hover:bg-sky-700 hover:scale-105 transition">
            Solicitar orçamento
          </button>
          <p className="text-sm text-slate-500 mt-3">
            Atendimento rápido • Orçamento sem compromisso
          </p>
        </div>

      </div>
    </section>
  );
};

export default ServicosPremium;