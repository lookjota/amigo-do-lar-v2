import { PageSectionType } from "../entities/PageSectionType";

export const ServicePageModel = [

    {
        type: PageSectionType.HERO,
        required: true,
        order: 1,
    },

    {
        type: PageSectionType.BENEFITS,
        required: true,
        order: 2,
    },

    {
        type: PageSectionType.FAQ,
        required: false,
        order: 3,
    },

    {
        type: PageSectionType.CTA,
        required: true,
        order: 4,
    },

];