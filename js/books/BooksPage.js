window.BooksPage = () => {
    // Temporary dummy data
    const books = [
        { id: 1, title: "O Senhor dos Anéis", author: "J.R.R. Tolkien" },
        { id: 2, title: "1984", author: "George Orwell" },
        { id: 3, title: "Dom Quixote", author: "Miguel de Cervantes" },
        { id: 4, title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry" },
        { id: 5, title: "Duna", author: "Frank Herbert" },
        { id: 6, title: "Fundação", author: "Isaac Asimov" },
        { id: 7, title: "O Hobbit", author: "J.R.R. Tolkien" },
        { id: 8, title: "Harry Potter", author: "J.K. Rowling" },
        { id: 9, title: "A Revolução dos Bichos", author: "George Orwell" },
        { id: 10, title: "O Alquimista", author: "Paulo Coelho" },
    ];

    // Helper to get random class for height and color
    const getRandomClass = (prefix, max) => {
        return `${prefix}-${Math.floor(Math.random() * max) + 1}`;
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
                                className={`book-spine ${getRandomClass('color', 8)} ${getRandomClass('h', 6)}`}
                                title={`${book.title} - ${book.author}`}
                                onClick={() => alert(`Você clicou em: ${book.title}`)}
                            >
                                {book.title}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </React.Fragment>
    );
};
