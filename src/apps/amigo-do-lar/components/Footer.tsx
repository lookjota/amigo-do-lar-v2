import { Link } from 'react-router-dom'
import { Container } from './Container'

export function Footer() {
  return (
    <footer className="amigo-footer">
      <Container>
        <div className="amigo-footer-grid">
          <div>
            <Link className="amigo-brand" to="/">
              <span aria-hidden="true">A</span>
              Amigo do Lar
            </Link>
            <p>
              Serviços residenciais confiáveis, organizados e executados com
              cuidado.
            </p>
          </div>
          <nav aria-label="Links institucionais">
            <Link to="/servicos">Serviços</Link>
            <Link to="/areas-atendidas">Áreas atendidas</Link>
            <Link to="/perguntas-frequentes">Perguntas frequentes</Link>
          </nav>
          <nav aria-label="Links legais">
            <Link to="/politica-de-privacidade">Política de privacidade</Link>
            <Link to="/termos-de-uso">Termos de uso</Link>
            <Link to="/contato">Contato</Link>
            <Link className="amigo-footer-admin-link" to="/admin/login">
              Área administrativa
            </Link>
          </nav>
        </div>
        <p className="amigo-copyright">
          © {new Date().getFullYear()} Amigo do Lar. Conteúdo informativo.
        </p>
      </Container>
    </footer>
  )
}
