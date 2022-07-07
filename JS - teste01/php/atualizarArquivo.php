<?php
    $resposta = ["adicionado" => "erro ao adicionar"];

    if (isset($_POST["nome_impressora"]) && file_put_contents("C:/xampp/htdocs/Estagio/JS - teste01/data/impressoras_cadastrada.txt", $_POST["nome_impressora"]."\n", FILE_APPEND)) {
        $resposta = ["adicionado" => "successo ao adicionar"];
        
    }

    echo json_encode($resposta);

    exit;
?>