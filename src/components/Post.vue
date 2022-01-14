<template>
  <v-card elevation="10">
    <v-img :src="post?.url" @click="overlayed = !overlayed" v-if="post?.media_type == 'image'">
      <template v-slot:placeholder>
        <v-row class="ma-0" align="center" justify="center" style="height:100%">
          <v-progress-circular indeterminate color="grey lighten-5"/>
        </v-row>
      </template>
    </v-img>
    <div v-else style="position: relative; width: 100%; padding-bottom: 56.25%; float: left; height: 0;">
      <iframe loading="lazy" :src="post?.url" style="width: 100%; height: 100%; position: absolute; left:0"/>
    </div>
    <v-btn icon @click="liked=!liked" color="transparent" elevation="0" size="x-small" class="ml-2 mt-1" :ripple="false">
      <v-icon color="grey-darken-1" style="position:absolute" size="x-large">
        mdi-heart-outline
      </v-icon>
      <transition name="bounce">
        <v-icon v-if="liked" color="red" style="position:absolute" size="x-large">
          mdi-heart
        </v-icon>
      </transition>
    </v-btn>
    <v-card-text class="pa-2 float-right">
      {{post?.date}}
    </v-card-text>
    <v-card-title>
      {{post?.title}}
    </v-card-title>
    <v-card-text class="pt-0">
      {{post?.explanation}}
    </v-card-text>
    <v-overlay v-model="overlayed">
      <div style="height: 100vh; width: 100vw" class="d-flex align-center justify-center" @click="overlayed=false">
        <v-img :src="post?.hdurl" style="width: 90%; height: 90%;">
          <template v-slot:placeholder>
            <v-row class="ma-0" align="center" justify="center" style="height:100%">
              <v-progress-circular indeterminate color="grey" :size="100" :width="10"/>
            </v-row>
          </template>
        </v-img>
      </div>
    </v-overlay>
  </v-card>
</template>
<script>
export default {
  name: 'Post',
  props: {
    post: Object,
  },
  data() {
    return {
      liked: false,
      overlayed: false, 
    }
  },
  mounted(){
    this.liked = localStorage.getItem(this.post.url)=="liked"
  },
  watch: {
    liked(val){
      if(val)
        localStorage.setItem(this.post.url, "liked")
      else
        localStorage.removeItem(this.post.url)
    }
  }
}
</script>
<style>
.img-size{
  width: 90vw !important;
  max-height: 90vh !important;
}
.bounce-enter-active {
  animation: bounce-in .25s;
}
.bounce-leave-active {
  animation: bounce-in .35s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  75% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}
</style>