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
      CREATE TABLE IF NOT EXISTS pearls (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        friend TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        if (request.method === 'GET') {
            // 2. Fetch pearls
            const { rows } = await pool.query('SELECT * FROM pearls ORDER BY created_at DESC');
            return response.status(200).json(rows);
        } else if (request.method === 'POST') {
            // 3. Create pearl
            const { title, body, friend } = request.body;
            if (!title || !body || !friend) {
                return response.status(400).json({ error: 'Missing fields' });
            }

            const { rows } = await pool.query(
                'INSERT INTO pearls (title, body, friend) VALUES ($1, $2, $3) RETURNING *',
                [title, body, friend]
            );
            return response.status(201).json(rows[0]);
        } else {
            return response.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Database error:', error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
