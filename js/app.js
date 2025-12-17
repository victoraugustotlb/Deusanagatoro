const { useState, useEffect } = React;

window.App = () => {
    const [currentView, setCurrentView] = useState('home');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [filter, setFilter] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState(''); // filtro de busca por texto
    const [sortOrder, setSortOrder] = useState('Mais recentes'); // filtro de data

    // Apply theme on mount and change
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleToggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    // Fetch data from our Serverless API
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/posts');

            if (!response.ok) {
                // Determine if it's a server error or network error
                const errorText = await response.text();
                throw new Error(`Server Error: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
            // Fallback for local development/broken connection
            setError("Could not load pearls. (If running locally, this is expected if API is not emulated)");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleNavigate = (view) => {
        setCurrentView(view);
    };

    const handleSubmitPost = async ({ title, body, friend }) => {
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, body, friend }),
            });

            if (!response.ok) {
                throw new Error('Failed to save post');
            }

            const newPost = await response.json();

            // Update UI with new post (optimistic or robust)
            setData([newPost, ...data]);
            setCurrentView('home');
        } catch (err) {
            alert('Failed to save pearl: ' + err.message);
        }
    };

    const handleDeletePost = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta pérola?')) return;

        try {
            const response = await fetch(`/api/posts?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            setData(data.filter(post => post.id !== id));
        } catch (err) {
            alert('Failed to delete pearl: ' + err.message);
        }
    };

    const handleSubmitBook = async ({ title, author, cover_url, spine_url }) => {
        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author, cover_url, spine_url }),
            });

            if (!response.ok) throw new Error('Failed to save book');

            // Force reload of books page data? 
            // For now, simpler to just navigate back. BooksPage will refetch on mount.
            setCurrentView('books');
        } catch (err) {
            alert('Failed to save book: ' + err.message);
        }
    };

    // LÓGICA DE FILTRAGEM E ORDENAÇÃO
    const getProcessedData = () => {
        let processed = [...data];

        // Filtro por Nome (Amigo)
        if (filter !== 'Todos') {
            processed = processed.filter(post => post.friend === filter);
        }

        // Filtro por Texto (Título ou Conteúdo)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            processed = processed.filter(post => 
                (post.title && post.title.toLowerCase().includes(term)) || 
                (post.body && post.body.toLowerCase().includes(term))
            );
        }

        // Ordenação por Data
        processed.sort((a, b) => {
            const dateA = new Date(a.date || a.created_at || 0);
            const dateB = new Date(b.date || b.created_at || 0);

            if (sortOrder === 'Mais recentes') {
                return dateB - dateA; // Decrescente
            } else {
                return dateA - dateB; // Crescente
            }
        });
        return processed;
    };

    const filteredData = getProcessedData();

    return (
        <React.Fragment>
            <window.Navbar
                onNavigate={handleNavigate}
                onToggleTheme={handleToggleTheme}
                theme={theme}
                currentView={currentView}
            />
            <div className="container">
                {currentView === 'home' && (
                    <React.Fragment>
                        <header>
                            <h1>As pérolas de 2026 já estão aqui</h1>
                            <p className="subtitle">Disclaimer: utilize de forma moderada, database limitada!</p>
                        </header>
                        {/* ÁREA DE FILTROS */}
                        <div className="filters-toolbar">
                            {/* Busca por Texto com Ícone */}
                            <div className="filter-group">
                                <label className="filter-label">Pesquisar</label>
                                <div className="input-icon-wrapper">
                                    {/* Ícone de Lupa SVG */}
                                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    
                                    <input
                                        type="text"
                                        className="styled-input"
                                        placeholder="Título ou conteúdo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Filtro por Nome */}
                            <div className="filter-group">
                                <label className="filter-label">Filtrar por Autor</label>
                                {/* O CustomSelect deve se adaptar ao CSS global que alteramos */}
                                <window.CustomSelect
                                    value={filter}
                                    onChange={setFilter}
                                    options={['Todos', ...window.FRIENDS]}
                                />
                            </div>

                            {/* Ordenação Por data */}
                            <div className="filter-group">
                                <label className="filter-label">Filtro de data</label>
                                <window.CustomSelect
                                    value={sortOrder}
                                    onChange={setSortOrder}
                                    options={['Mais recentes', 'Mais antigos']}
                                />
                            </div>
                        </div>

                        <main>
                            {/* Passamos a variável processada aqui ao invés de filtrar inline */}
                            <window.PostGrid
                                data={filteredData}
                                loading={loading}
                                error={error}
                                onDelete={handleDeletePost}
                            />
                        </main>
                    </React.Fragment>
                )}

                {currentView === 'add' && (
                    <window.AddPost
                        onCancel={() => handleNavigate('home')}
                        onSubmit={handleSubmitPost}
                    />
                )}

                {currentView === 'books' && (
                    <window.BooksPage />
                )}

                {currentView === 'add-book' && (
                    <window.AddBook
                        onCancel={() => handleNavigate('books')}
                        onSubmit={handleSubmitBook}
                    />
                )}
            </div>
            <window.Footer />
        </React.Fragment>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<window.App />);
