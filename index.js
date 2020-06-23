//Inicializar Express
const express = require('express');

//Inicializar Servidor
const server = express();
server.use(express.json());

let reqCounter = 0;

server.use((req, res, next) => {
    reqCounter++
    console.log("Número total de requisições: " + reqCounter);

    next();
})
//Variáveis de "estoque"

const projetos = [];

//Middlewares

/*
Checar Existencia de Projeto:
    > Recebe Id dos parâmetros da URL,
    > utiliza o array.findIndex comparando o id dos projetos existentes com o do corpo da requisição
    > caso retorne -1, não existe.
    > caso exista, adiciona-se um elemento chamado "projectIndex" com o verdadeiro index no Array do Id do Projeto
    > segue-se o fluxo;.
*/ 
function checkProjectExists(req, res, next) {
    const {id} = req.params;
    const projectIndex = projetos.findIndex((el) => {
        return el.id === Number(id);
    })
    if (projectIndex === -1) {
        res.status(400).json({
            message: "Projeto não existe"
        })
    }
    req.projectIndex = projectIndex;

    return next();
}

// Rotas

/*
Postar novo projeto
    > É esperado receber três parâmetros:
        id - identificador (Número)
        title - título do projeto (String)
        tasks - Tarefas do projeto (Array de Strings)
*/ 
server.post('/projects', (req, res) => {
    const {id, title, tasks} = req.body;
    projetos.push({
        id,
        title,
        tasks
    })
        return res.json(
            {
                id,
                title,
                tasks
            }
        )

})


//Retornar todos projetos
server.get('/projects', (req, res) => {
    return res.json(projetos);
})

//Retornar projeto específico por ID
server.get('/projects/:id',checkProjectExists,(req, res) => {
    return res.json(projetos[req.projectIndex])
})

//Atualizar título de projeto
server.put('/projects/:id', checkProjectExists, (req, res) => {
    const projectIndex = req.projectIndex;
    const {title} = req.body;
    projetos[projectIndex].title = title;
    return res.json(
        {
            projeto: projetos[projectIndex]
        }
    )

})

//Deletar Projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const projectIndex = req.projectIndex
    projetos.splice(projectIndex, 1);
    
    return res.json({
        message: "Projeto removido com sucesso."
    })
})


//Adicionar Tarefa
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
   const { title } = req.body;
    const ProjectIndex = req.projectIndex;
    projetos[ProjectIndex].tasks.push(title)

    return res.json({
        message: "New task successfully added"
    })
})


console.log('Servidor Ligado!');
server.listen(3000)