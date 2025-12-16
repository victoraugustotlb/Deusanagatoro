import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default async function handler(request, response) {
    try {
        // 1. Create table if it doesn't exist
        await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        cover_url TEXT,
        spine_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        if (request.method === 'GET') {
            // 2. Fetch books
            const { rows } = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
            return response.status(200).json(rows);
        } else if (request.method === 'POST') {
            // 3. Create book
            const { title, author, cover_url, spine_url } = request.body;
            if (!title || !author) {
                return response.status(400).json({ error: 'Missing title or author' });
            }

            const { rows } = await pool.query(
                'INSERT INTO books (title, author, cover_url, spine_url) VALUES ($1, $2, $3, $4) RETURNING *',
                [title, author, cover_url || null, spine_url || null]
            );
            return response.status(201).json(rows[0]);
        } else if (request.method === 'DELETE') {
            // 4. Delete book
            const { id } = request.query;
            if (!id) {
                return response.status(400).json({ error: 'Missing ID' });
            }

            await pool.query('DELETE FROM books WHERE id = $1', [id]);
            return response.status(200).json({ success: true });
        } else {
            return response.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Database error:', error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
