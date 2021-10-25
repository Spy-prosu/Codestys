<template>
  <div id="app">
   <div v-if="!serverBooelan">
              <h1 style="text-align:center;color:white;margin-top:12%;font-size:80px">404</h1>
       <h1 style="text-align:center;color:white;margin-top:2%">Böyle bir sunucu bulunamadı!</h1>
       </div>
       <div v-if="serverBooelan">
            <img class="serverİcon" :src="icon"> <h3 class="memberCount">{{ memberCount }} üye,{{ boostCount }} boost, {{ ChannelAll }} kanal</h3>
    <h1 class="guildName" style="color:white">{{ name }} ({{ guildID }})</h1>
    <br>
               <h1 style="padding:165px 10px;color:white">Sunucu Bilgileri</h1>
    <div class="kutu" >
        <br>
        <h3 style="color:white;padding: 1px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
            <i class="fas fa-users"></i> Toplam Üye : {{ memberCount }}
        </h3>
        <h3 style="color:white;padding:1px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
           <i class="fas fa-microphone"></i> Toplam Ses : {{ Voicecount }}
        </h3>
                <h3 style="color:white;padding:0px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
         <i class="fas fa-bars"></i> Toplam Kanal : {{ ChannelAll }}
        </h3>
           <h3 style="color:white;padding:0px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
         <i class="fas fa-volume-up"></i> Toplam Ses Kanalı : {{ Voicechannels }}
        </h3>
           <h3 style="color:white;padding:0px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
          <i class="fas fa-hashtag"></i>  Toplam Yazı Kanalı : {{ Textchannels }}
        </h3>
           <div class="çizgi"></div>
                      <h3 style="color:white;padding:0px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
       <i class="fas fa-crown"></i> Owner ID : {{ ownerID }}
        </h3>
             <h3 style="color:white;padding:1px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
            <i class="fas fa-users"></i>  Boost Sayısı : {{ boostCount }}
        </h3>
        <h3 style="color:white;padding:1px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
          <i class="fas fa-snowflake"></i> Özel Url : {{ privateURL }}
        </h3>
            <h3 style="color:white;padding:0px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
         <i class="fas fa-icons-alt"></i> Toplam Emoji : {{ emojiCount }}
        </h3>
                <h3 style="color:white;padding:0px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
        <i class="fas fa-robot"></i> Toplam Bot : {{ botCount }}
        </h3>
    </div>
    <h1 class="categorys">Kategoriler</h1>
     <div class="categorysKutu">
      <ul style="list-style-type:none;">
          <li v-for="(kategori,index) in kategoriNames" :key="index">
                  <p style="color:white;padding:20px 25px 1px;font-size:20px">{{ titleCase(kategori.name) }} Kategorisi :  <progress class="file" :value="kategori.count *5" max="100"></progress></p>
          </li>
          </ul>

     </div>

     <h1 class="rightTitle" style="color:white">Ses İstatistikleri</h1>
     <div class="kutu2" >
        <br>
        <h3 style="color:white;padding:1px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
            <i class="fas fa-users"></i> Toplam Ses : {{ Voicecount }}
        </h3>
        <h3 style="color:white;padding:1px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
        <i class="fas fa-robot"></i> Bot Sayısı : {{ VoiceBot }}
        </h3>
                <h3 style="color:white;padding:0px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
        <i class="fas fa-microphone-slash"></i> Susuturulmuş  : {{ serverMute }}
        </h3>
           <h3 style="color:white;padding:0px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
        <i class="fas fa-volume-slash"></i> Sağırlaştırılmış: {{ serverDeaf }}
        </h3>
           <h3 style="color:white;padding:0px 1px;margin: 10px;  font-family: Arial, Helvetica, sans-serif;">
          <i class="fas fa-video"></i> Kamera : {{ video }}
        </h3>
           <div class="çizgi"></div>
    <a :href="invite"><button class="button"><pre>Sunucuya Git</pre></button></a>
    </div>
           </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
data() {
    return {
        serverBooelan: false,
        id: this.$route.params.id,
        name: '',
        icon: '',
        memberCount: 0,
        createdAt: '',
        Textchannels: 0,
        Voicechannels: 0,
        Categorychannels: 0,
        Voicecount: 0,
        ChannelAll: 0,
        boostCount: 0,
        privateURL: '',
        botCount: 0,
        ownerID: '',
        emojiCount: 0,
        VoiceBot: '',
        video: '',
        serverMute: '',
        serverDeaf: '',
        kategoriNames: [],
        invite: '',
        guildID: ''
    }
},
created() {
    axios.get('http://localhost:3000/server/'+this.id).then((response) => {

     if(response.data.name === false){
         this.serverBooelan = false;
     } else if(response.data.name) {
     this.serverBooelan = true
     this.name = response.data.name.slice(0,30)
     this.guildID = response.data.id
     this.icon = response.data.icon
     this.memberCount = response.data.memberCount
     this.createdAt = moment(response.data.createdAt).format('D/M/YYYY');
     this.Textchannels = response.data.Textchannels
     this.Voicechannels = response.data.Voicechannels
     this. Categorychannels = response.data.Categorychannels
     this.Voicecount = response.data.Voicecount
     this.ChannelAll = response.data.Textchannels + response.data.Voicechannels,
     this.boostCount = response.data.boostCount
     this.privateURL = response.data.privateURL
     this.botCount = response.data.botCount
     this.ownerID = response.data.ownerID
     this.emojiCount = response.data.emojiCount
     this.VoiceBot = response.data.VoiceBot
     this.video = response.data.video
     this.serverMute = response.data.serverMute
     this.serverDeaf = response.data.serverDeaf
     this.kategoriNames = response.data.kategoriName.filter(a => a.count > 0 && a).slice(0,8)
     this.invite = response.data.invite ? response.data.invite : 'https://localhost:8080/guilds/'+ response.data.id;
      }
    })
},
methods: {
     titleCase(str) {
      var splitStr = str.toLowerCase().split(' ');
      for (var i = 0; i < splitStr.length; i++) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
      }
      return splitStr.join(' ');
   }
}
}
</script>

<style>


.kutu {
    text-align:left;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #111111;
    color: white;
    width: 300px;
    height: 380px;
    font-size: 13px;
    position: absolute;
    top: 302px
}

.kutu2 {
    text-align:left;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #111111;
    color: white;
    width: 300px;
    height: 380px;
    font-size: 13px;
    position: absolute;
    top: 302px;
    left:1190px
}
.rightTitle {
    position: absolute;
    top: 235px;
    left:1190px
}

.çizgi {
    margin: 30px 0px;
    border: 1px solid #292828;
}

.memberCount {
    position:absolute;
    top:158px;
    left:160px;
    color:#8d8c8c;
    font-size: 17px
}
.guildName {
    position:absolute;
    top:98px;
    left:160px;
}
.categorys {
    text-align:center;
    position:absolute;
    top:236px;
    left: 650px;
    color: white;

}
.categorysKutu {
    width: 860px;
    height: 380px;
    position:absolute;
    top:302px;
    left: 320px;
    background-color:#111111;
}
.button {
width: 150px;
 background-color:rgb(72, 151, 41);
border: none;
color: white;
padding: 6px 25px;
 text-align: center;
text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 2px;
  cursor: pointer;
position: absolute;
top: 240px;
left:77px;
height: 62px;
}
.serverİcon {
    border-radius:50%;
    position:absolute;
    top: 103px;
    width: 8%;
  height: 15%;
}
</style>
