<?php
$name = $_POST['name'];
$mail = $_POST['mail'];
$phone = $_POST['phone'];
$message = $_POST['message'];

$header = 'From: ' . $mail . "\r\n";
$header .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$header .= "Mime-Version: 1.0 \r\n";
$header .= "Content-Type: text/plain";

$message = "Este mensaje ha sido enviado por: " . $name . "\r\n";
$message .= "Su correo electrónico: " . $mail . "\r\n";
$message .= "Su telefono: " . $phone . "\r\n";
$message .= "Mensaje: " . $_POST['message'] . "\r\n";
$message .= "Enviado el: " . date('d/m/Y', time());

$para = 'rios.lisandro369@gmail.com';
$asunto = 'MENSAJE DE CONTACO';

$message = mb_convert_encoding($message, 'ISO-8859-1', 'UTF-8');
mail($para, $asunto, $message, $header);

header("Location: index.html");
?>
