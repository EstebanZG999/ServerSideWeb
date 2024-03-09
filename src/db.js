import conn from './conn.js'

// Obtener todos los posts
export async function getAllPosts() {
  const [rows] = await conn.query('SELECT * FROM blog_posts')
  return rows
}

// Crear un nuevo post
export async function createPost(title, content, competitorName, topSquat, topBench, topDeadlift, category) {
  const query = `
    INSERT INTO blog_posts (title, content, competitor_name, top_squat, top_bench, top_deadlift, category) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `
  const values = [title, content, competitorName, topSquat, topBench, topDeadlift, category]

  try {
    const [result] = await conn.query(query, values)
    return {
      success: true,
      message: 'Post created successfully',
      postId: result.insertId
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: error.sqlMessage || 'An error occurred during the post creation'
    }
  }
}

// Borrar un post
export async function deletePost(id) {
  const [result] = await conn.query('DELETE FROM blog_posts WHERE id = ?', [id])
  return result
}

// Ver post individual
export async function getPostById(id) {
  const [rows] = await conn.query('SELECT * FROM blog_posts WHERE id = ?', [id])
  if (rows.length > 0) {
    return rows[0]
  }
  return null
}

// Actualizar post
export async function updatePost(id, title, content, competitorName, topSquat, topBench, topDeadlift, category) {
  const [result] = await conn.query(
    'UPDATE blog_posts SET title = ?, content = ?, competitor_name = ?, top_squat = ?, top_bench = ?, top_deadlift = ?, category = ? WHERE id = ?',
    [title, content, competitorName, topSquat, topBench, topDeadlift, category, id]
  )
  return result
}
