<?php
// Define as credenciais do banco de dados (Mude conforme seu ambiente local)
$servername = "#";
$username   = "#";
$password   = "#";
$dbname     = "#";
$port     = 3306;

// Apenas aceita requisições POST para evitar acesso direto
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405); // Método não permitido
  echo json_encode(["message" => "Método não permitido."]);
  exit();
}

// 1. Recebe os dados JSON que o JavaScript enviou
$data = json_decode(file_get_contents("php://input"), true);

$nome_aluno = $data['nome_aluno'] ?? '';
$ano_serie = $data['ano_serie'] ?? '';
$link_github = $data['link_github'] ?? ''; // Atividade 1
$link_github_atv2 = $data['link_github_atv2'] ?? '';
$link_github_atv3 = $data['link_github_atv3'] ?? '';
$link_github_atv4 = $data['link_github_atv4'] ?? '';
$link_github_atv5 = $data['link_github_atv5'] ?? '';


// 2. Validação básica (Apenas o Link da Atividade 1 é obrigatório)
if (empty($nome_aluno) || empty($ano_serie) || empty($link_github)) {
  http_response_code(400);
  echo json_encode(["message" => "O nome, a série e o link da Atividade 1 são obrigatórios."]);
  exit();
}

// 3. Conexão com o Banco de Dados
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verifica a conexão
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["message" => "Falha na conexão com o banco de dados: " . $conn->connect_error]);
  exit();
}

try {
  // 4. Prepara a query INSERT com 7 campos (nome, serie, e os 5 links)
  $query = "INSERT INTO projetos (nome_aluno, ano_serie, link_github, link_github_atv2, link_github_atv3, link_github_atv4, link_github_atv5) VALUES (?, ?, ?, ?, ?, ?, ?)";

  $stmt = $conn->prepare($query);

  // s: string (nome), i: integer (serie), sssss: 5 strings (os 5 links)
  $stmt->bind_param(
    "sisssss",
    $nome_aluno,
    $ano_serie,
    $link_github,
    $link_github_atv2,
    $link_github_atv3,
    $link_github_atv4,
    $link_github_atv5
  );

  if ($stmt->execute()) {
    http_response_code(201); // 201 Created (Sucesso)
    echo json_encode(["message" => "Projeto cadastrado com sucesso!", "ano_serie" => $ano_serie]);
  } else {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao inserir o projeto: " . $stmt->error]);
  }

  $stmt->close();
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["message" => "Erro na execução da query: " . $e->getMessage()]);
}

$conn->close();
