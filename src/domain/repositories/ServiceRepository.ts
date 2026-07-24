import { servicesData } from "../data/servicesData";
import type { Service } from "../entities/Service";

export class ServiceRepository {

  // Retorna todos os servicos cadastrados
  static getAll(): Service[] {
    return servicesData;
  }


  /**
   * Procura um serviço pelo slug.
   *
   * Exemplo:
   * "eletricista"
   */
  static getBySlug(slug: string): Service | undefined {
    return servicesData.find(
      service => service.slug === slug
    )
  }
}