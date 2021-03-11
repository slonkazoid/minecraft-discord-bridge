# Configuration Documentation

The default configuration is stored in `config-default.json`. You must move/copy this file to config.json for the program to recognize it.  
This document will explain everything you can customize.

## Fields

```json
{
	"hooks": {},
	"servers": {},
	"bots": [],
	"global": {},
	"options": {}
}
```

### **Hooks**

In the `hooks` object, you will define webhook URLs and give them an identifier, which you will reference later in the `bots` object (array). Can not be empty.

### **Servers**

In the `servers` object, you will define Minecraft servers and give them an identifier. The format in which you will define them is given below. Can not be empty.

```json
{
	"testingServer": {
		"host": "localhost",
		"port": null,
		"version": null
	}
}
```

If `host` is not defined, it will throw an error.  
If `port` is not defined, it will default to `25565`.  
If `version` is not defined/false, it will default to autodetect.

### **Bots**

In the `bots` object (array), you will define bots with options. The format in which you will define them is given below. Can not be empty.

```json
[
	{
		"username": "BridgeBot",
		"password": null,
		"server": "testingServer",
		"webhook": "testingHook",
		"autoReconnect": true,
		"reconnectDelay": 5000,
		"setNameToServer": false,
		"messageType": "embed",
		"storeSession": true
	}
]
```

_Every bot will try to default to the `global` object if a field is not set._  
If `username` is not defined, it will throw an error.  
If `password` is not defined/false, it will use [offline mode](https://minecraft.gamepedia.com/Server.properties#online-mode) (basically no authenication).  
If `server` is not defined/not found, it will throw an error.
If `webhook` is not defined/not found/invalid, it will throw an error.  
If `autoReconnect` is not defined, it will default to `true`.  
If `reconnectDelay` is not defined, it will default to `5000`.
If `setNameToServer` is not defined, it will default to `false`.  
If `messageType` is not defined, it will default to `"embed"`
If `storeSession` is not defined, it will default to `true`.

What each of these options do:

- `username` Set the username/email of the bot
- `password` Set the password of the bot
- `server` Specify which server to connect to
- `webhook` Specify which webhook to bridge events to
- `autoReconnect` Make the bot automatically reconnect when the connection is lost
- `reconnectDelay` Milliseconds (1/1000 s) to wait before the bot reconnects.
- `setNameToServer` When `messageType` is `"embed"`, it will set the username of the webhook to the `host:port` of the server
- `messageType` Specify which type of message it should send. Recommended to use `"embed"` as the `"text"` one is vulnerable to '@everyone's and other message types
- `storeSession` Will save the _authenication_ session of each bot and will prevent the account from getting locked if the server kicks you often (highly reconmmended)

### **Global**

The `global` object defines defaults for all [bots](#bots). Same structure.

### **Options**

In the `options` object, you will define basic functionality of the program.

```json
{
	"debug": false,
	"daemonize": false,
	"shell": true
}
```

_If any field is not defined, it will default to the ones given above._  
The `debug` field will enable more logging than usual.  
The `daemonize` field is currently unused but will make the program run in the background in the near future.  
The `shell` field will enable the Command Line Interface to manage bots within the program.

### Check `config-default.json` to learn more
