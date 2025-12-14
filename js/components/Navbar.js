window.Navbar = ({ onNavigate }) => (
    <nav className="navbar">
        <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Perolas da Call</a>
        <button className="btn-primary" onClick={() => onNavigate('add')}>Adicionar</button>
    </nav>
);
