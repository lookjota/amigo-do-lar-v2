// Hook do React Router.
// Permite capturar os parâmetros da URL.
import { useParams } from "react-router-dom";
// Nosso Repository de serviços.
import { ServiceRepository } from "../domain/repositories/ServiceRepository";
// Repository responsável pelas relações.
import { ServiceAreaRepository } from "../domain/repositories/ServiceAreaRepository";
// A página genérica.
import ServicePage from "../pages/ServicePage";
/**
 * DynamicPageFactory
 *
 * Responsável por interpretar a URL,
 * localizar as entidades do domínio
 * e entregar tudo para a página genérica.
 */
export default function DynamicPageFactory() {
 /**
     * Capturamos os parâmetros da URL.
     *
     * Exemplo:
     *
     * /brasilia/eletricista
     */
    const {
        citySlug,
        serviceSlug
    } = useParams();
    /**
     * Caso algum parâmetro esteja ausente,
     * retornamos uma mensagem simples.
     */
    if (!citySlug || !serviceSlug) {
        return <h1>Página inválida.</h1>;
    }
    /**
     * Buscamos o serviço.
     */
    const service = ServiceRepository.getBySlug(serviceSlug);
    /**
     * Caso o serviço não exista.
     */
    if (!service) {
        return <h1>Serviço não encontrado.</h1>;
    }
    /**
     * Verificamos se o serviço atende essa cidade.
     */
    const available = ServiceAreaRepository.exists(
        serviceSlug,
        citySlug
    );
    /**
     * Caso não exista atendimento.
     */
    if (!available) {
        return <h1>Serviço indisponível nessa região.</h1>;
    }
    /**
     * Tudo certo.
     *
     * Entregamos a entidade
     * para a página.
     */
    return (
        <ServicePage
            service={service}
            citySlug={citySlug}
        />
    );
}