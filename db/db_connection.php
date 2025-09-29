<?php

$servername = "localhost";
$username = "seu_usuario";
$password = "sua_senha";
$dbname = "seu_banco_de_dados";

// Criar a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Checar a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}