<?php
// Define as credenciais do banco de dados (As mesmas de cadastrar.php)
$servername = "#";  // Hostname MySQL
$username = "#";               // Seu usuário MySQL
$password = "#";                  // Senha do banco (gerada pelo InfinityFree)
$dbname   = "#"; // Nome do banco
$port     = 3306;

// 1. Configura o cabeçalho para garantir que o navegador entenda que o retorno é JSON
header('Content-Type: application/json');

// Apenas aceita requisições GET
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["message" => "Método não permitido."]);
    exit();
}

// 2. Pega o parâmetro 'serie' da URL (ex: listar.php?serie=1)
$ano_serie = $_GET['serie'] ?? '';

// 3. Validação do parâmetro
if (empty($ano_serie) || !in_array($ano_serie, [1, 2, 3])) {
    http_response_code(400);
    echo json_encode(["message" => "Parâmetro 'serie' é obrigatório e deve ser 1, 2 ou 3."]);
    exit();
}

// 4. Conexão com o Banco de Dados
$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Falha na conexão com o banco de dados: " . $conn->connect_error]);
    exit();
}

try {
    // 5. Prepara a query SELECT (AGORA SELECIONA OS 5 LINKS)
    $query = "SELECT nome_aluno, link_github, link_github_atv2, link_github_atv3, link_github_atv4, link_github_atv5 FROM projetos WHERE ano_serie = ? ORDER BY id DESC";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $ano_serie); // i=integer
    $stmt->execute();

    $result = $stmt->get_result();
    $projetos = [];

    // 6. Loop para extrair cada linha e armazenar em um array PHP
    while ($row = $result->fetch_assoc()) {
        $projetos[] = $row;
    }

    $stmt->close();

    // 7. Envia o array de projetos como JSON para o frontend
    echo json_encode($projetos, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro na execução da consulta: " . $e->getMessage()]);
}

$conn->close();
