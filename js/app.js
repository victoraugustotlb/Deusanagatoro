const { useState, useEffect } = React;

window.App = () => {
    const [currentView, setCurrentView] = useState('home');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [filter, setFilter] = useState('Todos');

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

    return (
        <React.Fragment>
            <window.Navbar
                onNavigate={handleNavigate}
                onToggleTheme={handleToggleTheme}
                theme={theme}
            />
            <div className="container">
                {currentView === 'home' ? (
                    <React.Fragment>
                        <header>
                            <h1>As pérolas de 2026 já estão aqui</h1>
                            <p className="subtitle">Disclaimer: utilize de forma moderada, database limitada!</p>
                        </header>

                        <div style={{ maxWidth: '300px', margin: '0 0 2rem 0' }}>
                            <window.CustomSelect
                                value={filter}
                                onChange={setFilter}
                                options={['Todos', ...window.FRIENDS]}
                                label="Filtrar por nome"
                            />
                        </div>

                        <main>
                            <window.PostGrid
                                data={filter === 'Todos' ? data : data.filter(post => post.friend === filter)}
                                loading={loading}
                                error={error}
                                onDelete={handleDeletePost}
                            />
                        </main>
                    </React.Fragment>
                ) : (
                    <window.AddPost
                        onCancel={() => handleNavigate('home')}
                        onSubmit={handleSubmitPost}
                    />
                )}
            </div>
            <window.Footer />
        </React.Fragment>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<window.App />);
