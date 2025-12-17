window.Navbar = ({ onNavigate, onToggleTheme, theme, currentView }) => {
    // Estado para o menu de navegação (já existia)
    const [isNavOpen, setIsNavOpen] = React.useState(false);
    
    // NOVO: Estado para o menu de tema
    const [isThemeOpen, setIsThemeOpen] = React.useState(false);

    const navRef = React.useRef(null);
    const themeRef = React.useRef(null);

    // Lógica para fechar os menus ao clicar fora
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            // Fecha menu de navegação
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsNavOpen(false);
            }
            // Fecha menu de tema
            if (themeRef.current && !themeRef.current.contains(event.target)) {
                setIsThemeOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectView = (view) => {
        onNavigate(view);
        setIsNavOpen(false);
    };

    const handleThemeSelect = (selectedTheme) => {
        // Envia o tema escolhido para a função pai
        // OBS: Certifique-se que seu onToggleTheme aceita receber uma string ('light', 'dark', etc)
        onToggleTheme(selectedTheme); 
        setIsThemeOpen(false);
    };

    // Ícones SVG para reutilização
    const Icons = {
        Sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
        Moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
        System: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
    };

    return (
        <nav className="navbar">
            {/* Seletor de Views (Esquerda) */}
            <div className="custom-select-container" ref={navRef} style={{ width: 'auto', minWidth: '200px' }}>
                <div
                    className={`custom-select-trigger ${isNavOpen ? 'open' : ''}`}
                    onClick={() => setIsNavOpen(!isNavOpen)}
                    style={{ border: 'none', background: 'transparent', padding: '0.5rem 0' }}
                >
                    <span className="nav-brand" style={{ marginRight: '0.5rem' }}>
                        {currentView === 'books' ? 'Livros' : 'Pérolas da Call'}
                    </span>
                </div>
                {isNavOpen && (
                    <div className="custom-select-options" style={{ minWidth: '100%', backgroundColor: 'var(--bg-color)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        {currentView !== 'home' && (
                            <div className="custom-option" onClick={() => handleSelectView('home')}>Pérolas</div>
                        )}
                        {currentView !== 'books' && (
                            <div className="custom-option" onClick={() => handleSelectView('books')}>Livros</div>
                        )}
                    </div>
                )}
            </div>

            <div className="nav-actions">
                {/* NOVO: Dropdown de Tema (Substitui o toggle antigo) */}
                <div className="theme-dropdown-wrapper" ref={themeRef}>
                    <button 
                        className="btn-icon theme-trigger" 
                        onClick={() => setIsThemeOpen(!isThemeOpen)}
                        title="Alterar tema"
                    >
                        {/* Mostra ícone baseado no tema atual */}
                        {theme === 'light' ? <Icons.Sun /> : <Icons.Moon />}
                    </button>

                    {isThemeOpen && (
                        <div className="theme-dropdown-menu">
                            <button 
                                className={`theme-option ${theme === 'light' ? 'active' : ''}`} 
                                onClick={() => handleThemeSelect('light')}
                            >
                                <Icons.Sun />
                                <span>Light</span>
                            </button>
                            <button 
                                className={`theme-option ${theme === 'dark' ? 'active' : ''}`} 
                                onClick={() => handleThemeSelect('dark')}
                            >
                                <Icons.Moon />
                                <span>Dark</span>
                            </button>
                            <button 
                                className={`theme-option ${theme === 'system' ? 'active' : ''}`} 
                                onClick={() => handleThemeSelect('system')}
                            >
                                <Icons.System />
                                <span>System</span>
                            </button>
                        </div>
                    )}
                </div>

                <button
                    className="btn-primary"
                    onClick={() => {
                        if (currentView === 'books' || currentView === 'add-book') {
                            onNavigate('add-book');
                        } else {
                            onNavigate('add');
                        }
                    }}
                >
                    {currentView === 'books' || currentView === 'add-book' ? 'Adicionar Livro' : 'Adicionar'}
                </button>
            </div>
        </nav>
    );
};