window.Navbar = ({ onNavigate, onToggleTheme, theme }) => (
    <nav className="navbar">
        <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Perolas da Call</a>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button
                className="btn-primary"
                onClick={onToggleTheme}
                style={{ backgroundColor: theme === 'light' ? '#334155' : '#e2e8f0', color: theme === 'light' ? '#fff' : '#0f172a' }}
            >
                Correr
            </button>
            <button className="btn-primary" onClick={() => onNavigate('add')}>Adicionar</button>
        </div>
    </nav>
);
