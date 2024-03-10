const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'Una simple API de Blog con Express',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo'
      }
    ],
    components: {
      schemas: {
        Post: {
          type: 'object',
          required: ['title', 'content', 'competitorName', 'topSquat', 'topBench', 'topDeadlift', 'category'],
          properties: {
            id: {
              type: 'integer',
              description: 'El ID único del post.',
            },
            title: {
              type: 'string',
              description: 'El título del post.',
            },
            content: {
              type: 'string',
              description: 'El contenido del post.',
            },
            competitorName: {
              type: 'string',
              description: 'El nombre del competidor.',
            },
            topSquat: {
              type: 'number',
              description: 'Mejor marca en squat del competidor.',
            },
            topBench: {
              type: 'number',
              description: 'Mejor marca en bench press del competidor.',
            },
            topDeadlift: {
              type: 'number',
              description: 'Mejor marca en deadlift del competidor.',
            },
            category: {
              type: 'string',
              description: 'Categoría del competidor.',
            }
          },
        },
      }
    }
  };
  
  const options = {
    definition: swaggerDefinition,
    apis: ['./src/main.js'], 
  };
  
  export default options;
  