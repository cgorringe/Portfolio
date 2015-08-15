<!DOCTYPE html>
<html>
	<head>
		<title>Carl Gorringe</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
		<link rel="stylesheet" href="assets/css/main.css" />
		<link rel="stylesheet" href="assets/css/looper.css" />
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
								<header><h3>Thanks!</h3></header>
								<p>
<?php

// TODO: this script is almost done.  What's left to do:
//  + redo email regex, and don't send email if fails
//  + CSS for <pre> tag


// Input: name, email, subject, message, answer

// TODO: we need to filter all user input here!
// http://webdesignpub.com/html-contact-form-captcha/
// http://myphpform.com/validating-url-email.php

function check_input($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function check_email($data)
{
	// NOT Tested!
	if (preg_match("/([\w\-]+\@[\w\-]+\.[\w\-]+)/", $data)) {  // NOT a good match, needs to allow periods!
		return $data;
	}
	return '';
}

// Check 'answer' for 6x9 is 54 or 42

$answer  = trim( $_POST['answer'] );
if (($answer == '54') || ($answer == '42')) {
	// it's a human!

	if ($answer == '42') {
		echo '<h4>You have correctly enterered the Ultimate Answer.</h4><br>';
	}

	$name    = check_input( $_POST['name'] );
	$email   = check_email( $_POST['email'] );
	$subject = check_input( $_POST['subject'] );
	$message = check_input( $_POST['message'] );

	$header  = "from: $name <$email>";  // TODO: prevent email injection
	$sendtext = 
"Name: $name
Email: $email
Subject: $subject
Answer: $answer

Message:

$message
";

	$to = 'carl@gorringe.org';
	$send_contact = mail($to, "[contact form] $subject", $sendtext, $header);

	if ($send_contact) {
		echo "The following was sent.  I'll try to get back to you soon!<br><br><blockquote><pre>$sendtext</pre></blockquote>";
	}
	else {
		echo "There was an error sending the message.  Please try again!";
	}

	// Redirect to thank you page?
	// header('Location:thank_you.html');
	// header('Location:http://www.domain.com/thank_you.html');
}
else {
	echo 'We were unable to send your message.  Please check to make sure that what you entered in the form was correct and try again!';
}

?>
								</p>
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
			<script src="assets/js/looper.min.js"></script>
			<script src="assets/js/main.js"></script>

	</body>
</html>