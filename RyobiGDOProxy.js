// Ryobi GDO Proxy for Node.js

// Change these values to suit you
var smartThingsIP = '10.0.7.170', // Change this IP to match your smartthings hub IP
    proxyPort = 3042;             // Change this to whatever port you want to listen on

// DO NOT EDIT BELOW THIS LINE //
const http = require('http')
const url = require('url')
var WebSocket = require('ws')
const port = proxyPort

const requestHandler = (request, response) => {
const queryData = url.parse(request.url, true).query;
        response.writeHead(200, {"Content-Type": "text/plain"});
        var reqip = request.connection.remoteAddress.split(':')
        if (reqip[3] !== smartThingsIP) {
 	       response.end('Not Authorized')
        }

//console.log("request ip: " + reqip[3])

//console.log(request.url)
        if (queryData.name == 'lighton') {
                var cmd = 'lightState'
                var cmdstate = 'true'
                var cmdtype = 0
        } else if (queryData.name == 'lightoff') {
                var cmd = 'lightState'
                var cmdstate = 'false'
                var cmdtype = 0
        } else if (queryData.name == 'dooropen') {
                var cmd = 'doorCommand'
                var cmdstate = '1'
                var cmdtype = 0
        } else if (queryData.name == 'doorclose') {
                var cmd = 'doorCommand'
                var cmdstate = '0'
                var cmdtype = 0
        } else if (queryData.name == 'status') {
                var cmd = 'status'
                var cmdtype = 1
        } else {
                response.end('Not valid command!');
        }

        if (queryData.name == null) {
                response.end('No name specified');
        } else if (queryData.apikey == null) {
                response.end('No API Key specified');
        } else if (queryData.doorid == null) {
                response.end('No Door ID sepecified');
        } else if (queryData.email == null) {
                response.end('No email specified');
        } else if (queryData.pass == null) {
                response.end('No password specified');
        }

        if (cmdtype == 0) {
        var ws = new WebSocket('wss://tti.tiwiconnect.com/api/wsrpc', 'echo-protocol');
        ws.onopen = function()
        {
        var connectmsg = '{"jsonrpc":"2.0","id":3,"method":"srvWebSocketAuth","params": {"varName": "emailhere","apiKey": "apikeyhere"}}'
        var connectmsg = connectmsg.replace('apikeyhere', queryData.apikey)
        var connectmsg = connectmsg.replace('emailhere', queryData.email)
        ws.send(JSON.parse(JSON.stringify(connectmsg)));
        var message = '{"jsonrpc":"2.0","method":"gdoModuleCommand","params":{"msgType":16,"moduleType":5,"portId":7,"moduleMsg":{"cmd":cmdstate},"topic":"dooridhere"}}'
        var message = message.replace('cmd', cmd);
        var message = message.replace('cmdstate', cmdstate);
        var message = message.replace('dooridhere', queryData.doorid);
        function freeze(time) {
            const stop = new Date().getTime() + time;
         while(new Date().getTime() < stop);
        }
	//console.log("MESSAGE: " + JSON.stringify(message));
        freeze(1000);
        ws.send(JSON.parse(JSON.stringify(message)));
        //console.log("MESSAGE: " + JSON.stringify(message));
        response.end(connectmsg);
        ws.close()
        }
        } 

	else if (cmdtype == 1) {
        var request = require('request');
        var requestmsg = '{"username":"emailhere","password":"passwordhere"}'
        var requestmsg = requestmsg.replace('emailhere', queryData.email)
        var requestmsg = requestmsg.replace('passwordhere', queryData.pass)
        var requestmsg = JSON.parse(requestmsg)

	const doSomething = () => new Promise((resolve, reject) => {
		 var options = {url:'https://tti.tiwiconnect.com/api/devices/' + queryData.doorid + '',method:'GET',json:requestmsg}
    		 function freeze(time) {
        	   	 const stop = new Date().getTime() + time;
           		 while(new Date().getTime() < stop);
       	  	 }
       		 freeze(3000);

	         request(options, (err, res, body) => {
       			 if (err) { 
				//console.log("ERROR: " + err)	
				return reject(err)
       		 	 }
	   	 	 //console.log("Past error. Body: " + JSON.stringify(body));
	       	 	 resolve(body)
    		 })
	})

const someController = async function() {
    var someValue = await doSomething()
                var lightval = someValue.result[0].deviceTypeMap.garageLight_7.at.lightState.value
                var doorval = someValue.result[0].deviceTypeMap.garageDoor_7.at.doorState.value
                var batval = someValue.result[0].deviceTypeMap.backupCharger_8.at.chargeLevel.value
		//console.log("Light val: " + lightval + " doorval: " + doorval + " batval: " + batval);
                response.end('status:' + String(lightval) + ':' + String(doorval) + ':' + String(batval))

}

someController()

}
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
