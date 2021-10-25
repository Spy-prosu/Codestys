const category = require('../Function/Category');
const cfg = require('../config')
exports.run = async(client,message,args) => {
if(message.guild.id !== cfg.guildid) return;
if(!message.member.roles.cache.has(cfg.istatikci) && !message.member.hasPermission("ADMINISTRATOR")) return;

  let serverID = args[0];
  if(isNaN(serverID)) return message.channel.send("Lütfen doğrulamak istediğiniz sunucun idsini giriniz.").then(message => message.delete({timeout:4000}))
  
  let categoryName = args[1];
  if(!categoryName && !["Public","Doğrulanmamış","Sohbet","Oyun"].includes(categoryName)) return message.channel.send("Hangi Kategoriye Atıcaksınız. (Public/Sohbet/Oyun/Doğrulanmamış) ").then(message => message.delete({timeout:4000}))

  let sebep = args.slice(2).join(" ");
  if(!sebep && sebep.length < 3) return message.channel.send("Neden doğruluyorsun?").then(message => message.delete({timeout:4000}));
  
  category(serverID,categoryName,sebep);
  message.channel.send(`${serverID} ID'li sunucu başarıyla ${categoryName} adlı kategoriye taşındı!`);
};
exports.conf = {
  name: "doğrula",
  aliases: ["dogrula","update","kategori"],
  description: "Sunucun kategorisini değiştirir.",
  usage: "doğrula <id> <kategori> <sebep>",
}