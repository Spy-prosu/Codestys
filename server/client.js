
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require('./src/config.json');
var mongoose = require('mongoose');

mongoose.connect(config.mongo,{
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(a => { console.log("Mongosoe Bağlanıldı!")});

const log = message => {
  console.log(` ${message}`);
};

global.client = client;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./src/Commands", (err, files) => {
  if (err) console.error(err);
  files.forEach(f => {
    let props = require(`./src/Commands/${f}`);
    log(`Yüklenen komut: ${props.conf.name}.`);
    client.commands.set(props.conf.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.conf.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`../src/Commands/${command}`)];
      let cmd = require(`./src/Commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.conf.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`../src/Commands/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.conf.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./src/Commands/${command}`)];
      let cmd = require(`../src/Commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (config.sahip.includes(message.author.id)) permlvl = 4;
  return permlvl;
};

client.on("message", async(message) => {
  let client = message.client;
  if (message.author.bot) return;
  if(!message.member.user.createdTimestamp > 1209600000) return;
  if (!message.content.startsWith(config.prefix)) return;
  let command = message.content.split(' ')[0].slice(config.prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }

  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }  
})


client.login(config.token);


client.on("ready", async() => {
  console.log("Bot hazır durumda!"+ " "+ `${client.user.username} (${client.user.id})`);
})



