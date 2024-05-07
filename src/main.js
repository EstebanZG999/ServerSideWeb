import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerOptions from './swagger.js'
import {
  getAllPosts, createPost, getPostById, deletePost, updatePost, createUser, verifyUser,
} from './db.js'
import logRequest from './logs.js'
import { hashear, comparar } from './hash.js';


const app = express()
app.use(cors())
app.use(express.json())
app.use(logRequest)
const port = 22119

const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


// Autenticación de usuario
app.post('/login', async (req, res) => {
  console.log("Intentando autenticar:", req.body);
  const { username, password } = req.body;
  const usuario = await verifyUser(username);

  if (usuario.length > 0) {
    if (comparar(password, usuario[0].contrasena)) {
      res.status(200).json({ mensaje: 'Bienvenido' });
    } else {
      res.status(401).json({ mensaje: 'La contraseña es incorrecta' });
    }
  } else {
    res.status(404).json({ mensaje: 'El usuario no existe' });
  }
});

// Creación de usuario
app.post('/user', async (req, res) => {
  console.log("Intentando crear usuario:", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json('Se necesita tener los campos llenos');
  }

  const usuarioExistente = await verifyUser(username);

  if (usuarioExistente.length > 0) {
    return res.status(409).json({ mensaje: 'El usuario ya existe' });
  }

  const contraHasheada = hashear(password);

  try {
    await createUser(username, contraHasheada);
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error al registrar al usuario' });
  }
});


/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtiene una lista de todos los posts.
 *     description: Retorna un arreglo de todos los posts existentes en la base de datos.
 *     responses:
 *       200:
 *         description: Una lista de posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Error en el servidor al intentar obtener los posts.
 */

// Obtener todos los posts
app.get('/posts', async (req, res) => {
  const posts = await getAllPosts()
  res.json(posts)
})

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crea un nuevo post.
 *     description: Añade un nuevo post a la base de datos con la información proporcionada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: El post fue creado exitosamente.
 *       400:
 *         description: Datos faltantes o inválidos en el cuerpo de la solicitud.
 *       500:
 *         description: Error en el servidor al intentar crear el post.
 */

// Crear un nuevo post
app.post('/posts', async (req, res) => {
  const {
    title, content, competitorName, topSquat, topBench, topDeadlift, category,
  } = req.body

  if (!title || !content) {
    return res.status(400).send('Missing title or content in request body')
  }

  try {
    const result = await createPost(
      title,
      content,
      competitorName,
      topSquat,
      topBench,
      topDeadlift,
      category,
    )
    return res.status(200).json({ message: 'Post created successfully', postId: result.insertId })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.sqlMessage || 'An error occurred')
  }
})

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Obtiene un post específico por ID.
 *     description: Retorna el post correspondiente al ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID numérico del post deseado.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Un post específico.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post no encontrado con el ID proporcionado.
 *       500:
 *         description: Error en el servidor al intentar obtener el post.
 */

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
/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Actualiza un post existente por ID.
 *     description: Modifica los datos del post correspondiente al ID.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID numérico del post a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post actualizado exitosamente.
 *       400:
 *         description: Datos faltantes o inválidos en el cuerpo de la solicitud.
 *       404:
 *         description: Post no encontrado con el ID proporcionado.
 *       500:
 *         description: Error en el servidor al intentar actualizar el post.
 */

app.put('/posts/:postId', async (req, res) => {
  const { postId } = req.params
  const {
    title, content, competitorName, topSquat, topBench, topDeadlift, category,
  } = req.body

  // Validación simple como ejemplo
  if (
    !title
    || !content
    || !competitorName
    || !topSquat
    || !topBench
    || !topDeadlift
    || !category) {
    return res.status(400).send('Missing required fields in request body')
  }

  try {
    const result = await updatePost(
      postId,
      title,
      content,
      competitorName,
      topSquat,
      topBench,
      topDeadlift,
      category,
    )
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Post updated successfully' })
    }
    return res.status(404).send('Post not found')
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.sqlMessage || 'An error occurred')
  }
})

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Elimina un post específico por ID.
 *     description: Borra el post correspondiente al ID proporcionado de la base de datos.
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID numérico del post a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Post eliminado exitosamente.
 *       404:
 *         description: Post no encontrado con el ID proporcionado.
 *       500:
 *         description: Error en el servidor al intentar eliminar el post.
 */
// Borrar un post
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

app.use((req, res) => {
  res.status(404).send('Endpoint not found')
})
