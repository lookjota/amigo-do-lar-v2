import type { Service } from "../../../domain/entities/Service";

interface ServiceCardProps {
    service: Service;
}

export default function ServiceCard({
    service,
}: ServiceCardProps) {

    return (

        <article
            className="
                rounded-2xl
                border
                border-slate-200
                p-6
                shadow-sm
                hover:shadow-lg
                transition
            "
        >

            <h3 className="text-2xl font-semibold">

                {service.title}

            </h3>

            <p className="mt-4 text-slate-600">

                {service.description}

            </p>

        </article>

    );

}