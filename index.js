const bot = require('venom-bot');
const fs = require('fs');
const express = require('express');
const qr = require('qrcode');
const express_session = require('express-session');
const path = require('path');
const { Console } = require('console');
const app = express();
app.listen(3000,() => console.log("Bad Start Go Go ...."));
app.use(express_session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

var status = "";
var base64
bot.create(
    //session
    'MegaBot', //Pass the name of the client you want to start the bot
    //catchQR
    (base64Qr, asciiQR, attempts, urlCode) => {
      base64 = base64Qr
    },
    // statusFind
    (statusSession, session) => {
      status = statusSession
      // console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || initWhatsapp || erroPageWhatsapp || successPageWhatsapp || waitForLogin || waitChat || successChat
      // console.log('Session name: ', session);
      //Create session wss return "serverClose" case server for close
    },
    // options
    {
      folderNameToken: 'tokens', //folder name when saving tokens
      logQR: false, // Logs QR automatically in terminal
      disableWelcome: true, // Will disable the welcoming message which appears in the beginning
      updatesLog: true, // Logs info updates automatically in terminal
      autoClose: 0, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
      createPathFileToken: false, // creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
    }
  )
  .then((client) => {
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
});
app.get('/restart', function(request, response){
  response.sendFile(path.join(__dirname + '/login.html'));
});
app.post('/auth', function(request, response) {
	let username = request.body.username;
	let password = request.body.password;
	if (username && password) {
			if (username == "Elfanaan" && password == "MegaproApi") {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/restartDone');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/restartDone', async function(request, response) {
	if (request.session.loggedin) {
  response.redirect('/');
  setTimeout(() => {
    process.exit();
  },3000);
	} else {
    response.redirect('/restart');
	}
	response.end();
});

app.get("/", async (req, res, next) => {
    try {
    if (status == "notLogged" || status == "desconnectedMobile" && base64) {
      res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Mega System Api</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
<style>
body,h1 {font-family: "Raleway", sans-serif}
body, html {height: 100%}
.bgimg {
background-image: url('https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg');
min-height: 100%;
background-position: center;
background-size: cover;
}
</style>
</head>
<body>

<div class="bgimg w3-display-container w3-animate-opacity w3-text-white">
<div class="w3-display-topleft w3-padding-large w3-xlarge">
Mega System Api
</div>
<div class="w3-display-topright w3-padding-large w3-xlarge">
<button class="w3-button w3-border w3-border-red w3-round-large" onclick="window.location.href='/restart'">Restart</button>
</div>
<div class="w3-display-middle">
<center>
<h2  class="w3-jumbo w3-animate-top">QRCode Connect Api</h2>

<hr class="w3-border-grey" style="margin:auto;width:40%">
<p class="w3-center"><div><img src='${base64}'/></div></p>
</center>
</div>
<div class="w3-display-bottomleft w3-padding-large">
Powered by <a href="https://www.facebook.com/profile.php?id=61553843708296" target="_blank">Hossam Elfanaan</a>
</div>
</div>

</body></html>`);
    } else if (status == "isLogged" || status == "successChat") {
      res.send(`
      <!DOCTYPE html>
    <html>
    <head>
    <title>Mega System Api</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
    <style>
    body,h1 {font-family: "Raleway", sans-serif}
    body, html {height: 100%}
    .bgimg {
    background-image: url('https://wallpaperaccess.com/full/2054934.png');
    min-height: 100%;
    background-position: center;
    background-size: cover;
    }
    </style>
    </head>
    <body>
    
    <div class="bgimg w3-display-container w3-animate-opacity w3-text-white">
    <div class="w3-display-topleft w3-padding-large w3-xlarge">
    Mega System Api
    </div>
    <div class="w3-display-topright w3-padding-large w3-xlarge">
  <button class="w3-button w3-border w3-border-red w3-round-large" onclick="window.location.href='/restart'">Restart</button>
  </div>
    <div class="w3-display-middle">
    <center>
    <h2  class="w3-jumbo w3-animate-top">Connect Api</h2>
    </center>
    </div>
    <div class="w3-display-bottomleft w3-padding-large">
    Powered by <a href="https://www.facebook.com/profile.php?id=61553843708296" target="_blank">Hossam Elfanaan</a>
    </div>
    </div>
    
    </body>
    </html>`);
    } else {
      res.send(`
      <!DOCTYPE html>
    <html>
    <head>
    <title>Mega System Api</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
    <style>
    body,h1 {font-family: "Raleway", sans-serif}
    body, html {height: 100%}
    .bgimg {
    background-image: url('https://wallpaperaccess.com/full/2054934.png');
    min-height: 100%;
    background-position: center;
    background-size: cover;
    }
    </style>
    </head>
    <body>
    
    <div class="bgimg w3-display-container w3-animate-opacity w3-text-white">
    <div class="w3-display-topleft w3-padding-large w3-xlarge">
    Mega System Api
    </div>
    <div class="w3-display-topright w3-padding-large w3-xlarge">
  <button class="w3-button w3-border w3-border-red w3-round-large" onclick="window.location.href='/restart'">Restart</button>
  </div>
    <div class="w3-display-middle">
    <center>
    <h2  class="w3-jumbo w3-animate-top">Wait For Creation</h2>
    </center>
    </div>
    <div class="w3-display-bottomleft w3-padding-large">
    Powered by <a href="https://www.facebook.com/profile.php?id=61553843708296" target="_blank">Hossam Elfanaan</a>
    </div>
    </div>
    
    </body>
    </html>`);
    }
  } catch (error) {
      res.send(error);
  }
});

async function start(client) {
  client.onStateChange((state) => {
    console.log('State changed: ', state);
    // // force whatsapp take over
    // if ('CONFLICT'.includes(state)) client.useHere();
    // // detect disconnect on whatsapp
    // if ('UNPAIRED'.includes(state)) console.log('logout');
  });

  client.onIncomingCall(async (call) => {
    client.sendText(call.peerJid, "Sorry, I still can't answer calls");
  });
  await client.setProfileStatus('Mega System Api 🌐');
  app.get("/sendM", async (req, res, next) => {
    try {
      const text = req.query.text;
      const phone = req.query.phone;
      const code = req.query.code;
      if (code == "MegaSystemApiByElfanaan") {
        client.sendText(phone+"@c.us", text)
        res.send("ok");
      }
    } catch (error) {
        res.send(error);
    }
  });
}