<template>
  <v-app :theme="theme" style="min-height: 100%;">
    <v-app-bar>
      <v-app-bar-title>Spacestagram |
        <v-btn href="https://github.com/Xyven1/shopify-intern-challenge" class="pl-2">
          <v-icon size="x-large">mdi-github</v-icon>&nbsp;Code
        </v-btn>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn variant="outlined" color="secondary" @click="toggleLiked">{{showLiked ? 'New Posts' : 'Liked Posts'}}</v-btn>
      <v-btn icon @click="toggleTheme">
        <v-icon>mdi-theme-light-dark </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main ref="main">
      <v-container class="d-flex flex-wrap justify-center">
        <KeepAlive>
          <template v-if="!showLiked">
            <div v-for="(post,i) in posts" :key="i" :style="{'max-width': 100/postsPerRow + '%' }">
              <Post class="ma-2"  :post="post" />
            </div>
            <v-row class="ma-0" align="center" justify="center" style="height:100%; width: 100%">
              <v-progress-circular indeterminate color="grey lighten-5"/>
            </v-row>
          </template>
          <template v-else>
            <div v-for="(post,i) in likedPosts" :key="i" :style="{'max-width': 100/postsPerRow + '%' }">
              <Post class="ma-2"  :post="post" />
            </div>
          </template>
        </KeepAlive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import Post from './components/Post.vue'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

export default {
  name: 'App',
  components: {
    Post,
  },
  data: () => ({
    posts: [],
    date: null,
    showLiked: false,
    likedPosts: [],
    theme: 'light',
  }),
  methods: {
    /**
     * @param {Date} date
     * @return {String}
     */
    dateAsString(date){
      return date.toISOString().slice(0,10)
    },
    /**
     * @param {number} number
     * @returns {Promise}
     */
    getPosts(number){
      const vm = this
      let earlier = new Date(vm.date)
      earlier.setDate(vm.date.getDate()-number+1)
      const url = `https://api.nasa.gov/planetary/apod?api_key=2xWRd7P1EgwroBvrBied82EtGSds0DBCmbi6qh4f&start_date=${vm.dateAsString(earlier)}&end_date=${vm.dateAsString(vm.date)}`
      vm.date.setDate(vm.date.getDate()-number)
      return axios.get(url).then(response => {
        vm.posts.push(...response.data.reverse())
        return vm.posts
      })
    },
    loadOnScroll(){
      const vm = this
      let debounce = false
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight + 500 >= vm.$refs.main.$el.offsetHeight;
        if (bottomOfWindow && !debounce && !vm.showLiked) {
          debounce = true
          console.log('bottom of window')
          vm.getPosts(10).then(() => {
            debounce = false
          })
        }
      }
    },
    toggleLiked(){
      const vm = this
      vm.likedPosts = []
      vm.showLiked = !vm.showLiked
      if(vm.showLiked)
        for(const [_, val] of Object.entries(JSON.parse(localStorage.getItem('likedPosts')||'{}')))
          vm.likedPosts.push(val)
    },
    toggleTheme(){
      const vm = this
      vm.theme = vm.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', vm.theme)
    },
  },
  mounted(){
    const vm = this
    vm.theme = localStorage.getItem('theme') || vm.theme
    vm.date = new Date()
    vm.getPosts(10)
    vm.loadOnScroll();
  },
  setup(){
    const { name } = useDisplay()
    const postsPerRow = computed(() => {
      switch (name.value) {
        case 'xs': return 1
        case 'sm': return 1
        case 'md': return 2
        case 'lg': return 2
        case 'xl': return 3
        case 'xxl': return 3
      }
    })
    return {
      postsPerRow,
    }
  },
}
</script>
<style>
html, body, #app {
  height: 100% !important;
}
</style>
