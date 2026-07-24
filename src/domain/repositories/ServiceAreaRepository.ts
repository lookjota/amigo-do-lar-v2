// Importamos a entidade que representa um relacionamento.
// Ela define o formato dos objetos que o Repository manipula.
import type { ServiceArea } from "../entities/ServiceArea";

// Importamos nossa fonte de dados temporária.
// No futuro isso poderá ser substituído por uma API Spring Boot.
import { serviceAreasData } from "../data/serviceAreasData";



/**
 * Repository responsável pelos relacionamentos
 * entre Serviços e Cidades.
 *
 * Ele responde perguntas como:
 *
 * - Um serviço atende determinada cidade?
 * - Quais cidades possuem um serviço?
 * - Quais serviços existem em uma cidade?
 */
export class ServiceAreaRepository {

  /**
   * Retorna todos os relacionamentos existentes.
   */
  static getAll(): ServiceArea[] {
    return serviceAreasData;
  }

  /**
   * Verifica se um determinado serviço
   * existe em determinada cidade.
   *
   * Exemplo:
   *
   * eletricista
   * brasilia
   */
  static exists(
    serviceSlug: string,
    citySlug: string
  ): boolean {

    return serviceAreasData.some(area =>

      area.serviceSlug === serviceSlug &&

      area.citySlug === citySlug

    );

  }

}
