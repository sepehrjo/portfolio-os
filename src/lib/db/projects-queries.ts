export async function getVisibleProjects(db: D1Database) {
  const result = await db
    .prepare("SELECT * FROM projects WHERE visible = 1 ORDER BY sort_order")
    .all();
  return result.results;
}
