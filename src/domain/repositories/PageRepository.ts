import { homePage } from "../data/pages/homePage";
import type { Page } from "../entities/Page";

const pages: Page[] = [

  homePage,

];

export class PageRepository {

  /**
   * Retorna todas as páginas.
   */
  static getAll(): Page[] {

    return pages;

  }

  /**
   * Procura uma página pelo slug.
   */
  static getBySlug(slug: string): Page | undefined {

    return pages.find(page => page.slug === slug);

  }

  /**
   * Retorna a Home.
   */
  static getHome(): Page {

    return homePage;

  }

}