<template>
  <div id="app" class="container">
    <header class="header clearfix">
      <nav>
        <ul class="nav nav-pills float-right">
          <li class="nav-item" v-if="!current_user">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item" v-if="!current_user">
            <a href="#" class="nav-link text-muted">or</a>
          </li>
          <li class="nav-item" v-if="!current_user">
            <router-link to="/register" class="nav-link nav-active">Sign up →</router-link>
          </li>

          <li class="nav-item" v-if="current_user">
            <p href="#" class="nav-link">Signed in as <strong v-text="current_user.email"></strong></p>
          </li>
          <li class="nav-item" v-if="current_user">
            <router-link to="/projects" class="nav-link">Projects</router-link>
          </li>
          <li class="nav-item" v-if="current_user">
            <router-link to="/trackings" class="nav-link">Trackings</router-link>
          </li>
          <li class="nav-item" v-if="current_user">
            <a href="#" class="nav-link" @click="logout">Logout</a>
          </li>
        </ul>
      </nav>
      <h2 class="text"><router-link to="/">Tracker ⏱</router-link></h2>
    </header>
    <p v-text="flash" :class="flashClass" v-if="flash"></p>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      flash: "",
      flashClass: "",
      current_user: null
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('api_key')
      window.api_key = null
      axios.defaults.headers.common = {}
      this.current_user = null
      this.$router.push('/login')
    }
  },
  mounted() {
    if (localStorage.getItem('api_key')) {
      var key = localStorage.getItem('api_key')
      window.api_key = key

      axios.defaults.headers.common = {
          "X-Api-Key": key
      }

      axios.get('/current_user').then(res => {
        this.current_user = res.data
      })
    }

    Event.$on('login', (data) => {
      axios.get('/current_user', {headers: {"X-Api-Key": data.api_key}}).then(res => {
        this.current_user = res.data
      })
    })

    Event.$on('flash', data => {
      this.flash = data.message
      this.flashClass = data.class
    })
  }
}
</script>

<style>
#app {
  margin-top: 20px;
}

.loader,
.loader:after {
  border-radius: 50%;
  width: 3.6em;
  height: 3.6em;
}
.loader {
  display: block;
  margin: 3em auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 0.5em solid rgba(0,121,251, 0.2);
  border-right: 0.5em solid rgba(0,121,251, 0.2);
  border-bottom: 0.5em solid rgba(0,121,251, 0.2);
  border-left: 0.5em solid #0079fb;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

</style>
