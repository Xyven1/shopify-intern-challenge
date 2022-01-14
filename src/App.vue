<template>
  <v-app>
    <v-main>
      <v-container class="d-flex flex-wrap justify-center">
        <div v-for="(post,i) in posts" :key="i" :style="{'max-width': postWidth + '%' }">
          <Post class="ma-2"  :post="post" />
        </div>
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
    posts: [
    ],
    date: null,
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
      earlier.setDate(vm.date.getDate()-number)
      const url = `https://api.nasa.gov/planetary/apod?api_key=2xWRd7P1EgwroBvrBied82EtGSds0DBCmbi6qh4f&start_date=${vm.dateAsString(earlier)}&end_date=${vm.dateAsString(vm.date)}`
      return axios.get(url).then(response => {
        vm.posts.push(...response.data.reverse())
        vm.date.setDate(vm.date.getDate()-number-1)
        return vm.posts
      })
    },
    loadOnScroll(){
      const vm = this
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
        if (bottomOfWindow) {
          vm.getPosts(10)
        }
      }
    },
  },
  mounted(){
    const vm = this
    vm.date = new Date()
    vm.getPosts(10)
    vm.loadOnScroll();
  },
  setup(){
    const { name } = useDisplay()
    const postWidth = computed(() => {
      // name is reactive and
      // must use .value
      switch (name.value) {
        case 'xs': return 100
        case 'sm': return 100
        case 'md': return 100/2
        case 'lg': return 100/2
        case 'xl': return 100/3
        case 'xxl': return 100/3
      }
    })
    return {
      postWidth,
    }
  },
}
</script>
