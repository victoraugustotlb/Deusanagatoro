window.Navbar = ({ onNavigate, onToggleTheme, theme }) => {
    const [showPopup, setShowPopup] = React.useState(false);

    return (
        <nav className="navbar">
            <div style={{ position: 'relative' }}>
                <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); setShowPopup(!showPopup); }}>
                    Perolas da Call
                </a>
                {showPopup && (
                    <div className="nav-popup">
                        <div className="nav-popup-item" onClick={() => { onNavigate('home'); setShowPopup(false); }}>
                            Pérolas
                        </div>
                        <div className="nav-popup-item" onClick={() => { onNavigate('books'); setShowPopup(false); }}>
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
