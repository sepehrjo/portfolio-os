export async function insertContact(
  db: D1Database,
  contact: {
    name: string;
    email: string;
    company?: string;
    project: string;
    budget?: string;
  }
) {
  const result = await db
    .prepare(
      `INSERT INTO contacts (name, email, company, project, budget, created_at) 
       VALUES (?, ?, ?, ?, ?, unixepoch())`
    )
    .bind(contact.name, contact.email, contact.company, contact.project, contact.budget)
    .run();
  
  return result.meta.last_row_id;
}
