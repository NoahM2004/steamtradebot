//module
const Colors = require('colors')
const module_exists = require('module-exists');
const Art = require('ascii-art');
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const CONFIG = require('./config.json');
//logo
console.log("")
console.log("##    ## ######## ########     ###    ########  ########".rainbow);
console.log("###   ##    ##    ##     ##   ## ##   ##     ## ##      ".rainbow);
console.log("####  ##    ##    ##     ##  ##   ##  ##     ## ##      ".rainbow);
console.log("## ## ##    ##    ########  ##     ## ##     ## ######  ".rainbow);
console.log("##  ####    ##    ##   ##   ######### ##     ## ##      ".rainbow);
console.log("##   ###    ##    ##    ##  ##     ## ##     ## ##      ".rainbow);
console.log("##    ##    ##    ##     ## ##     ## ########  ########".rainbow);
console.log("________________________________________________________".rainbow);
console.log("")

//loadcheck

	//ok and error

	var ok = '[OK]'.green;
	var nok = '[ERROR]'.red;

	//testing

	console.log("Loading modules...".cyan);
	console.log("");

	if (module_exists('colors')) {
      console.log("Loading colors: " + ok);
	}
	else {
		  console.log("Loading colors: " + nok);
	};
	if (module_exists('module-exists')) {
	    console.log("Loading module-exists: " + ok);
	}
	else {
		  console.log("Loading module-exists: " + nok);
	};
	if (module_exists('ascii-art')) {
 	    console.log("Loading ascii-art: " + ok);
	}
	else {
		  console.log("Loading ascii-art: " + nok);
	};
	if (module_exists('steam-user')) {
      console.log("Loading steam-user: " + ok);
	}
	else {
		  console.log("Loading steam-user: " + nok);
	};
	if (module_exists('steam-totp')) {
	    console.log("Loading steam-totp: " + ok);
	}
	else {
		  console.log("Loading steam-totp: " + nok);
	};
	if (module_exists('steamcommunity')) {
	    console.log("Loading steamcommunity " + ok);
	}
	else {
			console.log("Loading steamcommunity: " + nok);
	};
	if (module_exists('steam-tradeoffer-manager')) {
	    console.log("Loading steam-tradeoffer-manager: " + ok);
	}
	else {
			console.log("Loading steam-tradeoffer-manager: " + nok);
	};
	if (module_exists('sleep')) {
	    console.log("Loading sleep: " + ok);
	}
	else {
			console.log("Loading sleep: " + nok);
	};


//init
const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
	steam: client,
	community: community,
	language: CONFIG.language
});

//Account Data

const logOnOptions = {
	accountName: CONFIG.username,
	password: CONFIG.password,
	twoFactorCode: SteamTotp.generateAuthCode(CONFIG.twoFactorCode)
};

//Trusted ID's
var id = ['steamid', 'steamid0', 'steamid1'];

console.log("")
console.log("Trusted SteamID's: ".cyan)
console.log("")
id.forEach(function(element) {
    console.log(element.red);
});
console.log("")
//einlogen
client.logOn(logOnOptions);

//wenn eingelogt dann...
client.on('loggedOn', () => {
	console.log('Logged into Steam'.green);

	client.setPersona(SteamUser.Steam.EPersonaState.Online);
	//client.gamesPlayed(440);
});

client.on('webSession', (sessionid, cookies) => {
	manager.setCookies(cookies);

	community.setCookies(cookies);
	community.startConfirmationChecker(10000, CONFIG.ConfirmationCode);
});

//ID's durchlaufen

Array.prototype.contains = function(k) {
    for(p in this)
        if(this[p] === k)
            return true;
    return false;
}


//Bei neuer Handelsanfrage
manager.on('newOffer', (offer) => {
var tradeid =	offer.partner.getSteamID64();
	if (id.contains(tradeid) === true) {
		offer.accept((err, status) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Trade accepted. (".yellow + tradeid.red + ")".yellow);
			}
		});
		} else {
		offer.decline((err) => {
			if (err) {
				console.log(err);
			} else {
				console.log('Canceled offer from unidentified person. ('.yellow + tradeid.red + ")".yellow);
			}
		});
	}
});

// wenn geadded wird

client.on('friendRelationship', (steamid, relationship) => {
  if (relationship === 2) {
    client.addFriend(steamid);
    client.chatMessage(steamid, CONFIG.addmessage);
  }
});

//Alle Nachrichten loggen

client.on('friendMessage', (senderID, message) => {
	console.log('Message from '.yellow + senderID + ': '.yellow + message.yellow)
});

//Unfinished

client.on('friendMessage', (senderID, message) => {
	if (message === "!logInvCont") {
		manager.getInventoryContents(730, 2, true, function(err, inventory, currencies) {
		    if (err) {
		        console.log(err);
		    }
		    console.log(inventory);
		});
	}
});
