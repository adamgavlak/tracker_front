<template>
  <div class="login__form">
    <h1 class="login__header">Login</h1>

    <p class="alert alert-danger" v-if="error">Wrong email/password combination</p>

    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" name="email" v-model="email" placeholder="e.g., john@gmail.com" class="form-control">
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" name="password" v-model="password" placeholder="e.g., ••••••••" class="form-control">
    </div>

    <div class="form-group login__btns">
      <input type="submit" class="btn btn-primary login__button" value="Log in" @click="login" v-bind:disabled="inProgress">
      <div class="loader loader--inline" v-if="inProgress"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      error: false,
      inProgress: false
    }
  },
  methods: {
    login() {
      this.inProgress = true
      this.error = false

      axios.post('http://localhost:4000/login', JSON.stringify({email: this.email, password: this.password})).then(
        res => {
          if (res.data.error) {
            this.error = true
            this.inProgress = false
          }

          if (res.data.api_key) {
            localStorage.setItem('api_key', res.data.api_key)
            window.api_key = res.data.api_key
            Event.$emit('login', {api_key: res.data.api_key})

            axios.defaults.headers.common = {
              "X-Api-Key": res.data.api_key
            }

            // axios.get('/current_user').then(res => {
            //   Event.$emit('login', {current_user: res.data})
            // })

            console.log(axios.defaults.headers)

            this.inProgress = false
            this.$router.push('/projects')
          }
        }
      )
    }
  },
  beforeRouteEnter (to, from, next) {
    if (window.api_key) {
      window.location.href = "/projects"
    }
    else {
      next()
    }
  }
}
</script>

<style>
.btn__login {
  margin-top: 1em;
}

.login__form {
  max-width: 40%;
  margin: 3em auto 0;
}

.login__header {
  text-align: center;
  margin-bottom: 1em;
}

.loader--inline {
  display: inline-block;
  margin: 0 0 0 1.5em;
}
.login__btns {
  margin-top: 2em;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
