import { ServiceRepository } from "../../../domain/repositories/ServiceRepository";
import ServiceGrid from "../ServiceGrid";

export default function ServicesSection() {

    const services =
        ServiceRepository.getAll();

    return (

        <section className="py-20">

            <div className="max-w-6xl mx-auto px-6">
                <header className="mb-12">
                    <h2 className="text-4xl font-bold">
                        Nossos Serviços
                    </h2>
                    <p className="mt-4 text-slate-600">
                        Conheça todos os serviços disponíveis.
                    </p>
                </header>

                <ServiceGrid
                    services={services}
                />

            </div>
        </section>
    );
}