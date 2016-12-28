<!DOCTYPE html>
<html>
	<head>
		<title>Carl Gorringe</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
		<link rel="stylesheet" href="assets/css/main.css" />
		<noscript><link rel="stylesheet" href="assets/css/noscript.css" /></noscript>
		<!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
	</head>
	<body>
		<!-- Wrapper-->
			<div id="wrapper">

				<!-- Nav -->
					<nav id="nav">
						<a href="./#me" class="icon fa-home"><span>Home</span></a>
						<a href="./#portfolio" class="icon fa-folder"><span>Portfolio</span></a>
						<a href="./#contact" class="icon fa-envelope"><span>Contact</span></a>
					</nav>

				<!-- Main -->
					<div id="main">

						<!-- Thanks -->
							<article id="thanks" class="panel">
<?php

function get_param($param)
{
	$data = '';
	if (isset($_POST[$param])) {
		$data = $_POST[$param];
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
	}
	return $data;
}

function strip_quotes($text)
{
	// Strip quote characters to remove remote code execution vulnerability in mail()
	$quotes = array("'", '"', '`');
	return str_replace($quotes, "", $text);
}

function check_email($addr)
{
	// if (preg_match("/([\w\-]+\@[\w\-]+\.[\w\-]+)/", $addr)) {  // NOT a good match, needs to allow periods!

	// Got these regex from:
	// http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address/14075810#14075810
	// ([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+

	// This is better?
	// if (preg_match("/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/", $addr)) {

	// This should allow periods and is most forgiving
	//if (preg_match("/^\S+@\S+\.\S+$/", $addr)) {
	//	return $addr;
	//}

	// Should be better
	if (filter_var($addr, FILTER_VALIDATE_EMAIL)) {
		return $addr;
	}

	return '';
}

// Input form: name, email, subject, message, answer

$err_msg = '';
$ok_msg = '';

$answer = get_param('answer');
if (($answer === '54') || ($answer === '42')) {
	// it's a human!

	if ($answer === '42') {
		$ok_msg .= '<strong><em>You have correctly entered the Ultimate Answer!</em></strong><br>';
	}

	$name = strip_quotes( get_param('name') );
	if ($name === '') {
		$err_msg .= 'Please include your name.<br> ';
	}

	$email = check_email( strip_quotes( get_param('email') ) );
	if ($email === '') {
		$err_msg .= 'Please enter a valid email address.<br> ';
	}

	$subject = strip_quotes( get_param('subject') );
	if ($subject === '') {
		$err_msg .= 'Please include a subject.<br> ';
	}

	$message = get_param('message');
	if ($message === '') {
		$err_msg .= 'Please include a message.<br> ';
	}

  if ($err_msg === '') {
  	// only email a message if there are no errors

		$header  = "from: $name <$email>";
		$sendtext = 
"Name: $name
Email: $email
Subject: $subject
Answer: $answer

$message
";

		$to = 'contact123@gorringe.org';
		$send_contact = mail($to, "[contact form] $subject", $sendtext, $header);
	
		if ($send_contact) {
			$ok_msg .= "<h4>The following was sent.  I'll try to get back to you soon!</h4><br><blockquote class='like-pre'>$sendtext</blockquote>";
		}
		else {
			$err_msg .= 'There was an error sending the message.  Please try again! <br> ';
		}
	}


	// Redirect to thank you page?
	// header('Location:thank_you.html');
	// header('Location:http://www.domain.com/thank_you.html');
}
else {
	$err_msg .= "Please answer the last question so we know that you're human!<br> ";
}

if ($err_msg === '') {
	// no errors
	echo "<header><h2>Thanks!</h2></header>";
	echo "<p>$ok_msg</p>";
}
else {
	// there were errors
	echo "<header><h3>Well that didn't work...</h3></header>";
	echo "<p>$err_msg</p>";
}

?>
							</article>
					</div>

				<!-- Footer -->
					<div id="footer">
						<ul class="copyright">
							<li>&copy; 2015 Carl Gorringe</li>
						</ul>
					</div>
			</div>

		<!-- Scripts -->
			<script src="assets/js/jquery.min.js"></script>
			<script src="assets/js/skel.min.js"></script>
			<script src="assets/js/skel-viewport.min.js"></script>
			<script src="assets/js/util.js"></script>
			<!--[if lte IE 8]><script src="assets/js/ie/respond.min.js"></script><![endif]-->
			<script src="assets/js/main.js"></script>
	</body>
</html>