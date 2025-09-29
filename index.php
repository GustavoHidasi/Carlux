<?php

require_once 'db/crud.php';

// --- Exemplo de como USAR as funções ---

// Inserir um novo usuário
$resultado_inserir = inserirUsuario("Maria Souza", "maria@email.com");
echo $resultado_inserir . "<br>";

// Consultar todos os usuários
$lista_usuarios = consultarUsuarios();
if (!empty($lista_usuarios)) {
    echo "<h2>Lista de Usuários:</h2>";
    echo "<ul>";
    foreach ($lista_usuarios as $usuario) {
        echo "<li>ID: " . $usuario['id'] . " - Nome: " . $usuario['nome'] . " - Email: " . $usuario['email'] . "</li>";
    }
    echo "</ul>";
} else {
    echo "Nenhum usuário encontrado.";
}

// Atualizar um usuário (exemplo: o usuário com id = 1)
$resultado_atualizar = atualizarUsuario(1, "João Modificado", "joao.modificado@email.com");
echo $resultado_atualizar . "<br>";

// Deletar um usuário (exemplo: o usuário com id = 2)
$resultado_deletar = deletarUsuario(2);
echo $resultado_deletar;