window.Navbar = ({ onNavigate, onToggleTheme, theme }) => {
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
                    <span className="nav-brand" style={{ marginRight: '0.5rem' }}>Perolas da Call</span>
                    <div className="arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
                {isOpen && (
                    <div className="custom-select-options" style={{ minWidth: '100%' }}>
                        <div
                            className="custom-option"
                            onClick={() => handleSelect('home')}
                        >
                            Pérolas
                        </div>
                        <div
                            className="custom-option"
                            onClick={() => handleSelect('books')}
                        >
                            Livros
                        </div>
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
                <button className="btn-primary" onClick={() => onNavigate('add')}>Adicionar</button>
            </div>
        </nav>
    );
};
