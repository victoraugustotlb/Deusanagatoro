window.BooksPage = () => {
    const [selectedBook, setSelectedBook] = React.useState(null);

    // Temporary dummy data
    const books = [
        { id: 1, title: "O Senhor dos Anéis", author: "J.R.R. Tolkien", heightClass: "h-4", colorClass: "color-3" },
        { id: 2, title: "1984", author: "George Orwell", heightClass: "h-2", colorClass: "color-1" },
        { id: 3, title: "Dom Quixote", author: "Miguel de Cervantes", heightClass: "h-3", colorClass: "color-6" },
        { id: 4, title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", heightClass: "h-5", colorClass: "color-4" },
        { id: 5, title: "Duna", author: "Frank Herbert", heightClass: "h-4", colorClass: "color-2" },
        { id: 6, title: "Fundação", author: "Isaac Asimov", heightClass: "h-1", colorClass: "color-5" },
        { id: 7, title: "O Hobbit", author: "J.R.R. Tolkien", heightClass: "h-2", colorClass: "color-3" },
        { id: 8, title: "Harry Potter", author: "J.K. Rowling", heightClass: "h-3", colorClass: "color-7" },
        { id: 9, title: "A Revolução dos Bichos", author: "George Orwell", heightClass: "h-6", colorClass: "color-1" },
        { id: 10, title: "O Alquimista", author: "Paulo Coelho", heightClass: "h-2", colorClass: "color-3" },
        { id: 11, title: "Clean Code", author: "Robert C. Martin", heightClass: "h-3", colorClass: "color-6" },
        { id: 12, title: "Neuromancer", author: "William Gibson", heightClass: "h-4", colorClass: "color-8" },
    ];

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
                    <div className="bookshelf">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className={`book-spine ${book.colorClass} ${book.heightClass}`}
                                title={`${book.title} - ${book.author}`}
                                onClick={() => handleBookClick(book)}
                            >
                                {book.title}
                            </div>
                        ))}
                    </div>
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
                                <div className={`book-cover-card ${selectedBook.colorClass}`}>
                                    {selectedBook.title}
                                </div>
                            </div>

                            <div className="book-info-display">
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedBook.title}</h2>
                                <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2rem' }}>{selectedBook.author}</p>

                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '1rem' }}>Sobre</h3>
                                    <p style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
                                        Informações do livro serão adicionadas aqui em breve.
                                        Este espaço é reservado para a sinopse, avaliação pessoal,
                                        ou qualquer outro detalhe relevante sobre a obra.
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
