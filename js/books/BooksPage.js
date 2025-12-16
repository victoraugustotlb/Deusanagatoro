window.BooksPage = () => {
    const [selectedBook, setSelectedBook] = React.useState(null);
    const [books, setBooks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('/api/books');
                if (!response.ok) throw new Error('Failed to fetch books');
                const data = await response.json();

                // Process books to add randomized visual properties if not present
                const processedBooks = data.map((book, index) => ({
                    ...book,
                    // Use database values if they exist, otherwise fallback to random/defaults
                    heightClass: book.height_class || `h-${(index % 6) + 1}`,
                    colorClass: book.color_class || `color-${(index % 8) + 1}`
                }));

                setBooks(processedBooks);
            } catch (err) {
                console.error("Error loading books:", err);
                // Fallback to empty or error state - for now just empty
                // In a real app we might show a toast
                setError("Could not load books.");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleBookClick = (book) => {
        setSelectedBook(book);
    };

    const handleClose = () => {
        setSelectedBook(null);
    };

    return (
        <React.Fragment>
            <header>
                <h1>Livros</h1>
                <p className="subtitle">Uma coleção de livros recomendados</p>
            </header>

            <main>
                <div className="bookshelf-container">
                    {loading ? (
                        <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Carregando biblioteca...</div>
                    ) : error ? (
                        <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>
                            {error}
                            <br /><small>(Se estiver rodando localmente sem o servidor da API, isso é esperado)</small>
                        </div>
                    ) : (
                        <div className="bookshelf">
                            {books.length === 0 && (
                                <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem', width: '100%' }}>
                                    Nenhum livro na estante ainda.
                                </div>
                            )}
                            {books.map((book) => (
                                <div
                                    key={book.id}
                                    className={`book-spine ${!book.spine_url ? book.colorClass : ''} ${book.heightClass}`}
                                    title={`${book.title} - ${book.author}`}
                                    onClick={() => handleBookClick(book)}
                                    style={book.spine_url ? {
                                        backgroundImage: `url(${book.spine_url})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        color: 'transparent', /* Hide text if spine image exists? Or keep for readability? Let's keep transparent text if image */
                                        textShadow: 'none'
                                    } : {}}
                                >
                                    {/* If we have a spine URL, we might want to hide the text or style it differently. 
                                        For now, if spine_url is present, we'll assume the image has the title or we just hide the text to show the image cleanly.
                                    */}
                                    {!book.spine_url && book.title}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedBook && (
                    <div className="book-detail-overlay" onClick={(e) => {
                        // Close if clicking the backdrop
                        if (e.target === e.currentTarget) handleClose();
                    }}>
                        <div className="book-detail-content">
                            <button className="close-btn" onClick={handleClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            <div className="book-cover-display">
                                <div
                                    className={`book-cover-card ${!selectedBook.cover_url ? selectedBook.colorClass : ''}`}
                                    style={selectedBook.cover_url ? {
                                        backgroundImage: `url(${selectedBook.cover_url})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        color: 'transparent',
                                        textShadow: 'none'
                                    } : {}}
                                >
                                    {!selectedBook.cover_url && selectedBook.title}
                                </div>
                            </div>

                            <div className="book-info-display">
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedBook.title}</h2>
                                <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2rem' }}>{selectedBook.author}</p>

                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '1rem' }}>Sobre</h3>
                                    <p style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
                                        {selectedBook.description || "Informações do livro serão adicionadas aqui em breve."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </React.Fragment>
    );
};
