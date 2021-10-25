const { string } = require('joi');
const category = require('../Function/Category');
const database = require('../Models/Server');
const cfg = require('../config')
exports.run = async(client,message,args) => {
if(message.guild.id !== cfg.guildid) return;
if(!message.member.roles.cache.has(cfg.istatikci) && !message.member.hasPermission("ADMINISTRATOR")) return;

  let serverID = args[0];
  if(isNaN(serverID)) return message.channel.send("İstatistiğine bakmak istediğiniz sunucun idsini giriniz.").then(message => message.delete({timeout:4000}))
  var server = client.guilds.cache.get(serverID);
  var category = await database.findOne({ guildID: server.id });

  message.channel.send(`
  __**GENEL BİLGİLER**__
 
  Sunucu Adı: **${server.name}**
  Sunucu ID: **${server.id}**
  Sunucu Owner ID: **${server.ownerID}**
  Kategori: **${category ? category.categoryName : "Doğrulanmamış"}**

  __**SES BİLGİLERİ**__
  Toplam Ses: **${server.members.cache.filter(members => !members.user.bot && members.user.createdTimestamp > 1209600000 && members.voice.channelID).size}**
  Sesdeki Bot Sayısı: **${server.members.cache.filter(members => members.user.bot && members.voice.channelID).size}**
  Kamera: **${server.members.cache.filter(members => !members.user.bot && members.voice.selfVideo).size}**
  Sağırlaştırılmış: **${server.members.cache.filter(members =>  !members.user.bot && members.voice.serverDeaf).size}**
  Susturulmuş: **${server.members.cache.filter(members => !members.user.bot && members.voice.serverMute).size}**
  `)
};
exports.conf = {
  name: "check",
  aliases: ["server"],
  description: "Sunucun kategorisini değiştirir.",
  usage: "doğrula <id> <kategori> <sebep>",
}

