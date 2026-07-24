import type { Page } from "../entities/Page";
import type { Service } from "../entities/Service";

export class PageFactory {

    static fromService(
        service: Service
    ): Page {

        return {

            slug: service.slug,

            title: service.title,

            seo: service.seo,

            sections: service.sections,

        };

    }

}