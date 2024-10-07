import express from 'express';
import dotent from 'dotenv';
import logger from './logger.js';
import morgan from 'morgan';
dotent.config();

const PORT = process.env.PORT || 5000;
const app = express();

const todos = [];
let todoId = 1;

app.use(express.json());

const morganFormat = ':method :url :status :response-time ms';

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(' ')[0],
          url: message.split(' ')[1],
          status: message.split(' ')[2],
          responseTime: message.split(' ')[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.post('/todo', (req, res) => {
  logger.warn('creating a new task');
  const { title, content } = req.body;
  const newTodo = { id: todoId++, title, content };
  todos.push(newTodo);

  return res.status(201).json(newTodo);
});

app.get('/todos', (req, res) => {
  return res.status(200).json(todos);
});

app.put('/todos/:id', (req, res) => {
  const todo = todos.find((todo) => todo.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ message: `${todoId} not found` });
  }

  const { title, content } = req.body;
  todo.title = title;
  todo.content = content;

  return res.status(200).json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex((todo) => todo.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: `${todoId} not found` });
  }

  todos.splice(index, 1);
  return res.status(200).json({ message: 'successfully deleted' });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
