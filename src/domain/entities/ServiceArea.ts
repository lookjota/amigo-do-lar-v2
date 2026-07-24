/**
 * Representa a relação entre um Serviço e uma Cidade.
 *
 * Este arquivo não representa um serviço.
 * Também não representa uma cidade.
 *
 * Ele representa o vínculo entre ambos.
 *
 * No futuro essa entidade poderá armazenar:
 *
 * - preço por região
 * - tempo médio de atendimento
 * - disponibilidade
 * - equipe responsável
 * - observações locais
 */
export interface ServiceArea {
  serviceSlug: string;
  citySlug: string;
}