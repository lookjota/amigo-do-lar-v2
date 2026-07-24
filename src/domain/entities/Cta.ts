/**
 * CTA (Call To Action)
 *
 * Representa a principal ação
 * que desejamos que o usuário execute.
 */
export interface Cta {

  /**
   * Título da seção.
   */
  title: string;

  /**
   * Texto de apoio.
   */
  description: string;

  /**
   * Texto do botão.
   */
  buttonText: string;

  /**
   * Destino da ação.
   *
   * Pode ser:
   * - WhatsApp
   * - Telefone
   * - Formulário
   */
  buttonLink: string;

}