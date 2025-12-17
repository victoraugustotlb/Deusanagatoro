window.Navbar = ({ onNavigate, onToggleTheme, theme, currentView }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (view) => {
        onNavigate(view);
        setIsOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="custom-select-container" ref={dropdownRef} style={{ width: 'auto', minWidth: '200px' }}>
                <div
                    className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ border: 'none', background: 'transparent', padding: '0.5rem 0' }}
                >
                    <span className="nav-brand" style={{ marginRight: '0.5rem' }}>
                        {currentView === 'books' ? 'Livros' : 'Perolas da Call'}
                    </span>
                </div>
                {isOpen && (
                    <div className="custom-select-options" style={{ minWidth: '100%', backgroundColor: 'var(--bg-color)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        {currentView !== 'home' && (
                            <div
                                className="custom-option"
                                onClick={() => handleSelect('home')}
                                style={{
                                    background: 'var(--accent-gradient)',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: '700',
                                    letterSpacing: '-0.02em',
                                    fontSize: '1.2rem'
                                }}
                            >
                                Pérolas
                            </div>
                        )}
                        {currentView !== 'books' && (
                            <div
                                className="custom-option"
                                onClick={() => handleSelect('books')}
                                style={{
                                    background: 'var(--accent-gradient)',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: '700',
                                    letterSpacing: '-0.02em',
                                    fontSize: '1.2rem'
                                }}
                            >
                                Livros
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="nav-actions">
                <div className="theme-toggle-wrapper">
                    <label className="theme-switch" title="Alternar tema">
                        <input
                            type="checkbox"
                            checked={theme === 'light'}
                            onChange={onToggleTheme}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span className="theme-label">{theme === 'light' ? 'Modo Claro' : 'Modo Escuro'}</span>
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
