import { pageSectionRegistry } from "../../core/registry/pageSectionRegistry";

import type { PageSection } from "../../domain/entities/PageSection";

interface SectionRendererProps {
    section: PageSection;
}

export default function SectionRenderer({
    section,
}: SectionRendererProps) {

    const Component =
        pageSectionRegistry[section.type];

    if (!Component) {
        return null;
    }

    return (

        <Component section={section} />

    );

}