require("./client.js");
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var client = global.client;
var inviteDatabase = require('./src/Models/Invite');
var database = require('./src/Models/Server');
var likeDatabase = require('./src/Models/Like');

http.listen(3000,function() { console.log("Sunucu hazır!")});
app.get('/like/list', async(req,res) => {
    var array = [];
    var dbAll = await likeDatabase.find({ });

client.guilds.cache.filter(async(guilds) => {
    var db = await likeDatabase.find({ guildID: guilds.id });
    let count = 0;

    if(db) {
        for (let i =0; i < db.length; i++) {
            count += db[i].likeCount
        }
    }
    await array.push({
        guildName: guilds.name,
        guildID: guilds.id,
        guildLike: count,
        boostCount: guilds.premiumTier,
        memberCount: guilds.members.cache.filter(members => !members.user.bot).size,
        iconURL: guilds.iconURL({dynamic:true}) ? guilds.iconURL({dynamic:true}) : 'https://p7.hiclipart.com/preview/842/992/26/discord-computer-servers-teamspeak-discord-icon.jpg',
        bannerURL: guilds.bannerURL() ? guilds.bannerURL() : 'https://cdn.discordapp.com/attachments/839581354857594882/840348215290101770/9k.png'
    })
});
 res.header("Access-Control-Allow-Origin", "*");
setTimeout(() => {
    res.json({
        guilds: array.filter(element => element.guildLike > 0).sort((a,b) => b.guildLike - a.guildLike)
    });
},1000);
});

app.get('/server/:id', async(req,res) => {
  var guild;
  if(isNaN(req.params["id"])) {
    guild = client.guilds.cache.find(a => a.name.includes(req.params["id"]));
  } else {
    guild =  client.guilds.cache.get(req.params["id"])
  }

  res.header("Access-Control-Allow-Origin", "*");
  if(!guild) res.json({name: false});
  if(guild) {
    var guildInviteArray = [];
 await inviteDatabase.findOne({ guildID: guild.id }).then(async(x) => {
  if(x) {
    await guild.fetchInvites().then(async(guildInvite) => {
      var databaseInvite = x.İnvite.split("/")
     var code = guildInvite.find(o => o.code === databaseInvite[3]);
     if(!code) {
      await inviteDatabase.deleteOne({ guildID: guild.id });
      if (!guild.member(client.user).hasPermission('CREATE_INSTANT_INVITE')) return;
      var channel = guild.channels.cache.filter(a => a.type === "text").random();
      var invite = await channel.createInvite({maxAge: 0, maxUses: 0 }).then((a) => a.url);
      var data = new inviteDatabase({
        guildID: guild.id,
        İnvite: invite
      })
      data.save().then(async(a) => {
        await  guildInviteArray.push(a.İnvite);
      })
     } else {
       guildInviteArray.push("https://discord.gg/"+code.code);
     }
    })
  } else {
    if (!guild.member(client.user).hasPermission('CREATE_INSTANT_INVITE')) return;
    var channel = guild.channels.cache.filter(a => a.type === "text").random();
    var invite = await channel.createInvite({maxAge: 0, maxUses: 0 }).then((a) => a.url);
    var data = new inviteDatabase({
      guildID: guild.id,
      İnvite: invite
    })
    data.save().then(async(a) => {
      await  guildInviteArray.push(a.İnvite);
    })
  }
  })

    res.json({
      name: guild.name,
      id: guild.id,
      icon:guild.iconURL({dynamic:true})  ? guild.iconURL({dynamic:true}) : "https://p7.hiclipart.com/preview/842/992/26/discord-computer-servers-teamspeak-discord-icon.jpg",
      memberCount: guild.memberCount,
      createdAt: guild.createdTimestamp,
      Textchannels: guild.channels.cache.filter(channels => channels.type === "text").size,
      Voicechannels: guild.channels.cache.filter(channels => channels.type === "voice").size,
      Categorychannels: guild.channels.cache.filter(channels => channels.type === "category").size,
      Voicecount: guild.members.cache.filter(members => !members.user.bot && members.user.createdTimestamp > 1209600000 && members.voice.channelID).size,
      boostCount: guild.premiumTier,
      privateURL: guild.vanityURLCode ? guild.vanityURLCode : 'Yok',
      botCount: guild.members.cache.filter(members => members.user.bot).size,
      ownerID: guild.ownerID,
      emojiCount: guild.emojis.cache.size,
      VoiceBot: guild.members.cache.filter(members =>  members.user.bot && members.voice.channelID).size,
      kategoriName: guild.channels.cache.filter(ch => ch.type == "category").map(category => { 
        let total = [];
        var size = 0;
        var channelname = ""
       var x =  guild.channels.cache.filter(elem => elem.parentID == category.id && elem.type == "voice" &&  elem.members.size > 0).map(elem => {
        var members = elem.members.filter(a => !a.user.bot)
        for(let i = 0; i < members.size;i++ ){
        size = members.size 
       }
       channelname = client.channels.cache.get(elem.parentID).name
       })
        return { name: channelname, count: size};
      }),
      video: guild.members.cache.filter(members =>  members.voice.selfVideo).size,
      serverMute: guild.members.cache.filter(members =>  members.voice.serverMute).size,
      serverDeaf: guild.members.cache.filter(members =>  members.voice.serverDeaf).size,
      invite: guildInviteArray.toString()
    })

  }
});

client.on("voiceStateUpdate", async(oldV,newV) => {
  var array = [];
  client.guilds.cache.forEach(async(guilds) => {
    var size = guilds.members.cache.filter(members => !members.user.bot && members.user.createdTimestamp > 1209600000 && members.voice.channelID).size

var databasex = await database.findOne({ guildID: guilds.id })
var name;
if(databasex || !databasex){
  name = databasex ? databasex.categoryName : 'Doğrulanmamış';
};

   array.push({
     guildName: guilds.name,
     guildID: guilds.id,
     guildicon: guilds.iconURL({dynamic:true}) ? guilds.iconURL({dynamic:true}) : "https://p7.hiclipart.com/preview/842/992/26/discord-computer-servers-teamspeak-discord-icon.jpg",
     count: size,
     categoryName: name
       })
 }) 
 setTimeout(() => {
  io.emit("guilds", array.filter(a => a.count > 0).sort((a,b) => b.count - a.count))},2000)
});



io.on('connection', socket => {
  var array = [];
  client.guilds.cache.forEach(async(guilds) => {
    var size = guilds.members.cache.filter(members => !members.user.bot && members.user.createdTimestamp > 1209600000 && members.voice.channelID).size
    
    var databasex = await database.findOne({ guildID: guilds.id })
        var name;
    if(databasex || !databasex) name = databasex ? databasex.categoryName : 'Doğrulanmamış';
 
   array.push({
     guildName: guilds.name,
     guildID: guilds.id,
     guildicon: guilds.iconURL({dynamic:true}) ? guilds.iconURL({dynamic:true}) : "https://p7.hiclipart.com/preview/842/992/26/discord-computer-servers-teamspeak-discord-icon.jpg",
     count: size,
     categoryName: name
   })
 }) 
 setTimeout(() => {
  io.emit("guilds", array.filter(a => a.count > 0).sort((a,b) => b.count - a.count))},2000)
});

