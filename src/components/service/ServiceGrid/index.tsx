import type { Service } from "../../../domain/entities/Service";

import ServiceCard from "../ServiceCard";

interface ServiceGridProps {
    services: Service[];
}

export default function ServiceGrid({
    services,
}: ServiceGridProps){
    return(
        <div
            className="
                grid
                md:grid-cols-2
                lg:grid-cols-3
                gap-6
            "
        >
            {
                services.map(service => (
                    <ServiceCard
                        key={service.slug}
                        service={service}
                    />
                ))
            }
        </div>
    );
}