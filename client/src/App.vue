<template>
  <div id="app">

    <div class="topnav" id="myTopnav">
      <div class="bt">
        <a style="margin-left: 10%" href="/"><i class="fas fa-bars"></i> Ana Sayfa</a>
        <a href="https://discord.com/api/oauth2/authorize?client_id=838926385728716850&permissions=8&scope=bot"><i class="fas fa-plus"></i> Sunucunu Ekle</a>
        <a href="https://discord.gg/XT62RYbdaS"><i class="fas fa-user-plus"></i> Sunucumuza Katıl</a>
        <a href="/like/list"><i class="fas fa-star"></i> Puan Sıralaması</a>
      </div>
      <a href="javascript:void(0);" class="icon" @click="myFunction()">
        <i class="fa fa-bars"></i>
      </a>
    </div>
     <router-view></router-view>
      </div>
</template>


<style>
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

.topnav {
  overflow: hidden;
  background-color: #333;
}

.topnav a {
  float: left;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.bt a:hover {
  background-color: #ddd;
  color: black;
}

.topnav a.active {
  color: white;
}

.topnav .icon {
  display: none;
}

</style>
