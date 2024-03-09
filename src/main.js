import express from 'express'
import {
  getAllPosts, createPost, getPostById, deletePost, updatePost,
} from './db'

const app = express()
app.use(express.json())
const port = 3000

// Obtener todos los posts
app.get('/posts', async (req, res) => {
  const posts = await getAllPosts()
  res.json(posts)
})

// Crear un nuevo post
app.post('/posts', async (req, res) => {
  const {
    title, content, competitorName, topSquat, topBench, topDeadlift, category,
  } = req.body

  try {
    const result = await createPost(title, content, competitorName, topSquat, topBench, topDeadlift, category)
    res.status(200).json({ message: 'Post created successfully', postId: result.insertId })
  } catch (error) {
    console.error(error)
    res.status(500).send(error.sqlMessage || 'An error occurred')
  }
})

// Obtener un post por ID
app.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params
    const post = await getPostById(postId)
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).send('Post not found / Post deleted')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred')
  }
})

// Actualizar un post por ID
app.put('/posts/:postId', async (req, res) => {
  const { postId } = req.params
  const {
    title, content, competitorName, topSquat, topBench, topDeadlift, category,
  } = req.body

  try {
    const result = await updatePost(postId, title, content, competitorName, topSquat, topBench, topDeadlift, category)
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Post updated successfully' })
    } else {
      res.status(404).send('Post not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send(error.sqlMessage || 'An error occurred')
  }
})

// Borrar un post por ID
app.delete('/posts/:postId', async (req, res) => {
  const { postId } = req.params
  try {
    const result = await deletePost(postId)
    if (result.affectedRows > 0) {
      res.status(204).send()
    } else {
      res.status(404).send('Post not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred')
  }
})

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})
