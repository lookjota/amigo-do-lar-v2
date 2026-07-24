// Importamos a entidade do domínio.
// Ela representa um serviço real da aplicação.
import type { Service } from "../../domain/entities/Service";

/**
 * Props recebidas pela página genérica de serviços.
 *
 * A página não busca informações.
 * Ela apenas recebe dados prontos.
 */
export interface ServicePageProps {

  /**
   * Serviço que será exibido.
   */
  service: Service;

  /**
   * Cidade utilizada na URL.
   */
  citySlug: string;

}