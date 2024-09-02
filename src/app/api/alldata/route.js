import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Connect to the database once
client.connect();

export const dynamic = 'force-dynamic';


// src/app/api/route.js
// -------------------------------------------------------------------------------------
export async function GET() {
  try {
    const result = await client.query('SELECT * FROM "mini_045"');
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('GET Error:', error.stack || error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(request) {
  try {
    const { ldr, vr, temp, distance } = await request.json();
    
    const ldrParsed = parseInt(ldr, 10);
    const vrParsed = parseInt(vr, 10);
    const tempParsed = parseFloat(temp);
    const distanceParsed = parseFloat(distance);

    console.log('Parsed values:', ldrParsed, vrParsed, tempParsed, distanceParsed);

    const res = await client.query(
      'INSERT INTO "mini_045" (LDR, VR, TEMP, DISTANCE) VALUES ($1, $2, $3, $4) RETURNING *',
      [ldrParsed, vrParsed, tempParsed, distanceParsed]
    );

    console.log('Insert result:', res.rows[0]);

    return new Response(JSON.stringify(res.rows[0]), {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('POST Error:', error.stack || error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}
