// routes/clientesRoute.js
const router = require('express').Router();

let clientes = [
    {
        id: 1,
        nome: "Ana Silva",
        cpf: "123.456.789-00",
        email: "ana.s@exemplo.com",
        telefone: "11987654321"
    }
];

// POST /clientes (CREATE)
router.post('/clientes', (req, res) => {
    const { nome, cpf, email, telefone } = req.body;
    
    // Validação 1: Campos obrigatórios (Requisito: 400 Bad Request)
    if (!nome || !cpf || !email) {
        return res.status(400).json({ erro: "Nome, CPF e Email são campos obrigatórios." });
    }
    
    // Validação 2: CPF único (Requisito: 409 Conflict)
    if (clientes.find(c => c.cpf === cpf)) {
        return res.status(409).json({ erro: "CPF já cadastrado no sistema." });
    }

    const novoCliente = { 
        id: Date.now(), // ID único
        nome, 
        cpf, 
        email, 
        telefone 
    };
    clientes.push(novoCliente);
    
    // Sucesso na criação (Requisito: 201 Created)
    res.status(201).json(novoCliente); 
});

// GET /clientes (READ ALL)
router.get('/clientes', (req, res) => {
    // Sucesso (Requisito: 200 OK)
    res.json(clientes);
});

// GET /clientes/:id (READ ONE)
router.get('/clientes/:id', (req, res) => {
    // Convertemos o ID de string (URL param) para número
    const id = parseInt(req.params.id); 
    const cliente = clientes.find(c => c.id === id);
    
    // Recurso não encontrado (Requisito: 404 Not Found)
    if (!cliente) {
        return res.status(404).json({ erro: "Cliente não encontrado." });
    }
    res.json(cliente);
});

// PUT /clientes/:id (UPDATE)
router.put('/clientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, cpf, email, telefone } = req.body;

    // Validação: Campos obrigatórios (400 Bad Request)
    if (!nome || !cpf || !email) {
        return res.status(400).json({ erro: "Nome, CPF e Email são obrigatórios para a atualização." });
    }

    const index = clientes.findIndex(c => c.id === id);
    
    // Validação: Cliente não encontrado (404 Not Found)
    if (index === -1) {
        return res.status(404).json({ erro: "Cliente não encontrado para atualização." });
    }
    
    // Atualiza o objeto. Mantemos o mesmo CPF para PUT (simplificação)
    clientes[index] = { 
        id, 
        nome, 
        cpf, // O CPF é mantido igual no PUT, evitando a checagem de 409 para o próprio item
        email, 
        telefone 
    };
    
    // Sucesso na atualização (Requisito: 200 OK)
    res.json({ mensagem: "Cliente atualizado com sucesso!", cliente: clientes[index] });
});

// DELETE /clientes/:id (DELETE)
router.delete('/clientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = clientes.length;

    // Cria um novo array sem o cliente com o ID especificado
    clientes = clientes.filter(c => c.id !== id);

    // Checa se o tamanho do array mudou (se o item foi encontrado e removido)
    if (clientes.length === initialLength) {
        return res.status(404).json({ erro: "Cliente não encontrado para exclusão." });
    }
    
    // Sucesso na exclusão (Requisito: 200 OK)
    res.json({ mensagem: "Cliente excluído com sucesso!" });
});

module.exports = router;