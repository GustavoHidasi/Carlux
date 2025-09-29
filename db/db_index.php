<?php

require_once 'connection.php';

// --- FUNÇÃO PARA INSERIR DADOS ---
function inserirUsuario($nome, $email) {
    global $conn;
    $sql = "INSERT INTO usuarios (nome, email) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $nome, $email);

    if ($stmt->execute()) {
        return "Novo registro criado com sucesso!";
    } else {
        return "Erro: " . $stmt->error;
    }
    $stmt->close();
}


// --- FUNÇÃO PARA CONSULTAR TODOS OS DADOS ---
function consultarUsuarios() {
    global $conn;
    $sql = "SELECT id, nome, email FROM usuarios";
    $result = $conn->query($sql);

    $usuarios = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $usuarios[] = $row;
        }
    }
    return $usuarios;
}


// --- FUNÇÃO PARA ATUALIZAR UM DADO ---
function atualizarUsuario($id, $novoNome, $novoEmail) {
    global $conn;
    $sql = "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $novoNome, $novoEmail, $id);

    if ($stmt->execute()) {
        return "Registro atualizado com sucesso!";
    } else {
        return "Erro: " . $stmt->error;
    }
    $stmt->close();
}


// --- FUNÇÃO PARA DELETAR UM DADO ---
function deletarUsuario($id) {
    global $conn;
    $sql = "DELETE FROM usuarios WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        return "Registro deletado com sucesso!";
    } else {
        return "Erro: " . $stmt->error;
    }
    $stmt->close();
}