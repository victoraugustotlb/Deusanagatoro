window.Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Lado Esquerdo: Marca e Slogan ou Descrição Curta */}
                <div className="footer-brand-section">
                    <h3 className="footer-logo">Pérolas Nagatoro</h3>
                    <p className="footer-tagline">Pérolas da Call do Servidor Deusa Nagatoro</p>
                </div>
                {/* Lado Direito: Copyright */}
                <div className="footer-legal-section">
                    <div className="footer-copyright">
                        &copy; {currentYear} Todos os direitos reservados.
                    </div>
                </div>
            </div>
        </footer>
    );
};