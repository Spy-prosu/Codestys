var client = global.client;
var database = require('../Models/Server');

async function category(id,kategori,sebep) {
  var guild = client.guilds.cache.get(id);
  if(!guild) return;

   var serverDB = await database.findOne({ guildID: id })
   var categoryserver = serverDB ? serverDB.categoryName : undefined;
  
   if(categoryserver === undefined) {
  var db = new database({
    guildName: guild.name,
    categoryName: kategori,
    sebep: sebep,
    guildID: guild.id
  })
    db.save()
   } else {
    serverDB.guildName = guild.name
    serverDB.categoryName = kategori
    serverDB.sebep = sebep
    serverDB.save();
   }
}

module.exports = category;

