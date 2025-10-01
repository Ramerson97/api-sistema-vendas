const router = require('express').Router();

// Simulação de Banco de Dados para Pedidos
let pedidos = [
    { 
        id: 3001, 
        clienteId: 12345, // ID de um cliente fictício
        data: "2025-09-28", 
        status: "Pendente", 
        valorTotal: 1250.50 
    },
    { 
        id: 3002, 
        clienteId: 54321, 
        data: "2025-09-29", 
        status: "Concluído", 
        valorTotal: 500.00 
    }
];

// 1. POST /pedidos (CREATE)
router.post('/pedidos', (req, res) => {
    const { clienteId, data, status, valorTotal } = req.body;
    
    // Validação: Campos obrigatórios (Requisito: 400 Bad Request)
    if (!clienteId || !data || !status || !valorTotal) {
        return res.status(400).json({ erro: "clienteId, data, status e valorTotal são obrigatórios." });
    }

    // Cria o novo pedido
    const novoPedido = { 
        id: Date.now(), // Gerando ID
        clienteId: parseInt(clienteId), // Garante que é numérico
        data, 
        status, 
        valorTotal: parseFloat(valorTotal) // Garante que é numérico
    };
    pedidos.push(novoPedido);
    
    // Sucesso: Recurso criado (201 Created)
    res.status(201).json(novoPedido); 
});

// 2. GET /pedidos (READ ALL)
router.get('/pedidos', (req, res) => {
    // Sucesso: 200 OK
    res.json(pedidos);
});

// 3. GET /pedidos/:id (READ ONE)
router.get('/pedidos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pedido = pedidos.find(p => p.id === id);
    
    // Recurso não encontrado (Requisito: 404 Not Found)
    if (!pedido) {
        return res.status(404).json({ erro: "Pedido não encontrado." });
    }
    res.json(pedido);
});

// 4. PUT /pedidos/:id (UPDATE)
router.put('/pedidos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { clienteId, data, status, valorTotal } = req.body;

    // Validação: Campos obrigatórios (400 Bad Request)
    if (!clienteId || !data || !status || !valorTotal) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios para a atualização." });
    }

    const index = pedidos.findIndex(p => p.id === id);
    
    // Validação: Pedido não encontrado (404 Not Found)
    if (index === -1) {
        return res.status(404).json({ erro: "Pedido não encontrado para atualização." });
    }

    // Atualiza o objeto no array
    pedidos[index] = { 
        id, 
        clienteId: parseInt(clienteId), 
        data, 
        status, 
        valorTotal: parseFloat(valorTotal) 
    };
    
    // Sucesso: 200 OK
    res.json({ mensagem: "Pedido atualizado com sucesso!", pedido: pedidos[index] });
});

// 5. DELETE /pedidos/:id (DELETE)
router.delete('/pedidos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = pedidos.length;

    // Filtra para criar um novo array sem o item deletado
    pedidos = pedidos.filter(p => p.id !== id);

    // Checa se o tamanho mudou (404 Not Found)
    if (pedidos.length === initialLength) {
        return res.status(404).json({ erro: "Pedido não encontrado para exclusão." });
    }
    
    // Sucesso: 200 OK
    res.json({ mensagem: "Pedido excluído com sucesso!" });
});

module.exports = router;