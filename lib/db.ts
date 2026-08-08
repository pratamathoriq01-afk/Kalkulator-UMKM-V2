import { neon } from '@neondatabase/serverless';
import type { Product } from './types';

function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  return neon(url);
}

/* Initialize database schema */
export async function initDB() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id            SERIAL PRIMARY KEY,
      user_session  VARCHAR(255) NOT NULL,
      name          VARCHAR(255) NOT NULL,
      data          JSONB        NOT NULL,
      created_at    TIMESTAMPTZ  DEFAULT NOW(),
      updated_at    TIMESTAMPTZ  DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_products_user_session ON products(user_session)
  `;
}

/* Get all products for a user session */
export async function getProductsBySession(userSession: string): Promise<Product[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, name, data
    FROM products
    WHERE user_session = ${userSession}
    ORDER BY id ASC
  `;
  return rows.map((row, idx) => ({
    ...(row.data as Product),
    id: idx + 1,         // local sequential ID for UI
    dbId: row.id as number,        // real DB primary key
    name: row.name as string,
  }));
}

/* Create a new product */
export async function createProduct(userSession: string, product: Product): Promise<number> {
  const sql = getSql();
  const { name, ...data } = product;
  const result = await sql`
    INSERT INTO products (user_session, name, data)
    VALUES (${userSession}, ${name}, ${JSON.stringify(data)})
    RETURNING id
  `;
  return result[0].id as number;
}

/* Update a product by DB id */
export async function updateProduct(dbId: number, userSession: string, product: Product): Promise<void> {
  const sql = getSql();
  const { name, ...data } = product;
  await sql`
    UPDATE products
    SET name = ${name}, data = ${JSON.stringify(data)}, updated_at = NOW()
    WHERE id = ${dbId} AND user_session = ${userSession}
  `;
}

/* Delete a product by DB id */
export async function deleteProduct(dbId: number, userSession: string): Promise<void> {
  const sql = getSql();
  await sql`
    DELETE FROM products
    WHERE id = ${dbId} AND user_session = ${userSession}
  `;
}
