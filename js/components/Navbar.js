window.Navbar = ({ onNavigate, onToggleTheme, theme }) => (
    <nav className="navbar">
        <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Perolas da Call</a>
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
