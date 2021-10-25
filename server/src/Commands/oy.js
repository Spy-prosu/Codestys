const {  MessageEmbed } = require('discord.js');
const database = require('../Models/Like');
const serverdata = require('../Models/Server');
const moment = require('moment');
moment.locale('tr');

exports.run = async(client,message,args) => {

    const timedb = await database.findOne({userID: message.author.id, guildID: message.guild.id});
    const userdb = await database.find({userID: message.author.id});
    const databaseAll = await database.find({guildID: message.guild.id});

    var totalLike = 0;
    if (!userdb) {
        return totalLike;
    } else {
        for (let i = 0; i < userdb.length; i++) {
            if (userdb[i].likeCount !== undefined) {
                totalLike += userdb[i].likeCount;
            }
        }
    }

    var likeCount = timedb ? timedb.likeCount : 1;
    if (!timedb) {
        var db = new database({
            userID: message.author.id,
            guildID: message.guild.id,
            date: Date.now(),
            likeCount: 1
        });
        db.save();

        var userIndex;
        if (databaseAll) {
            userIndex = databaseAll.findIndex(item => item.userID === message.author.id);
        }
        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`
            **${message.guild.name}** Adlı Sunucuya oy Verdin!
            ${userIndex === -1 ? "" : `Like sıralamasında ${userIndex + 1}. sıradasın!`}
            `)
            .addField(`Genel Oy Sayın:`, totalLike + 1)
            .addField(`Sunucuya Verdiğin Like Sayısı:`, likeCount)
        message.channel.send(embed);
        return;
    } else if (!timedb.date) {
        timedb.date = Date.now()
        timedb.save()
        message.channel.send('Bu Sunucuya daha oy atamazsın, biraz daha beklemelisin, lütfen daha sonra tekrar dene.');
    } else {
        var likeCount = timedb ? timedb.likeCount : 1;
        var timeLike = Date.now() - timedb.date;
        if (timeLike >= 7200000) {
            timedb.date = Date.now()
            timedb.likeCount++
            timedb.save()

            var userIndex = 0;
            if (databaseAll) {
                userIndex = databaseAll.findIndex(item => item.userID === message.author.id);
            }
            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`
            **${message.guild.name}** Adlı Sunucuya oy verdin!
            
            ${userIndex === -1 ? "" : `Like sıralamasında ${userIndex + 1}. sıradasın!`}
            `)
                .addField(`Genel Oy Sayın:`, totalLike + 1)
                .addField(`Sunucuya Verdiğin Like Sayısı:`, likeCount + 1)
            message.channel.send(embed);
        } else {
            message.channel.send("Bu Sunucuya daha oy atamazsın, biraz daha beklemelisin, lütfen daha sonra tekrar dene.")
        }
    }
}
exports.conf = {
  name: "oy",
  aliases: ["like","oy"],
  description: "Sunucun kategorisini değiştirir.",
  usage: "oy",
}

