import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';
import { Pool } from 'pg';
// Import CommonJS module in ESM
import discordUtils from '../js/discord-utils.js';
const { InstallGlobalCommands, ALL_COMMANDS } = discordUtils;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export const config = {
    api: {
        bodyParser: false,
    },
};

async function buffer(readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req, res) {
    // 1. SETUP ROUTE: Allow GET request to /api/discord?setup=true to register commands
    if (req.method === 'GET') {
         if (req.query.setup === 'true') {
            try {
                const appId = process.env.APPLICATION_ID_BOT;
                if (!appId) return res.status(500).json({ error: 'APPLICATION_ID_BOT not set' });
                
                const success = await InstallGlobalCommands(appId, ALL_COMMANDS);
                if (success) {
                    return res.status(200).json({ message: 'Commands registered successfully!' });
                } else {
                    return res.status(500).json({ error: 'Failed to register commands. Check server logs.' });
                }
            } catch (error) {
                 return res.status(500).json({ error: error.message });
            }
         }
         return res.status(404).send('Not Found');
    }

    // 2. INTERACTION HANDLER (POST)
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const rawBodyBuffer = await buffer(req);
    const rawBody = rawBodyBuffer.toString('utf-8');

    const isValidRequest = verifyKey(
        rawBody,
        signature,
        timestamp,
        process.env.PUBLIC_KEY_BOT
    );

    if (!isValidRequest) {
        return res.status(401).send('Bad Request Signature');
    }

    const message = JSON.parse(rawBody);

    if (message.type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    if (message.type === InteractionType.APPLICATION_COMMAND) {
        if (message.data.name === 'perola') {
            const amigoOption = message.data.options.find(opt => opt.name === 'amigo');
            const conteudoOption = message.data.options.find(opt => opt.name === 'conteudo');
            
            const friend = amigoOption ? amigoOption.value : 'Anônimo';
            const body = conteudoOption ? conteudoOption.value : '';
            const title = `Pérola de ${friend}`; 

            try {
                 await pool.query(`
                    CREATE TABLE IF NOT EXISTS pearls (
                        id SERIAL PRIMARY KEY,
                        title TEXT NOT NULL,
                        body TEXT NOT NULL,
                        friend TEXT NOT NULL,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                `);

                await pool.query(
                    'INSERT INTO pearls (title, body, friend) VALUES ($1, $2, $3)',
                    [title, body, friend]
                );

                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: `✅ **Pérola Adicionada!**\n\n**${friend}**: "${body}"`,
                    },
                });
            } catch (error) {
                console.error('Database error:', error);
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: `❌ **Erro ao salvar pérola**: ${error.message}`,
                        flags: 64, 
                    },
                });
            }
        }
        
        if (message.data.name === 'test') {
             return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Hello world! O bot está funcionando.',
                },
            });
        }
    }

    return res.status(400).send('Unknown interaction type');
}
