<template>
  <form @submit.prevent="signUp" class="signup__form">
    <h1 class="signup__header">Sign up</h1>

    <div class="form-group" :class="{'has-error': errors.has('email') }" >
        <label class="control-label" for="email">Email</label>
        <input name="email" v-model="email" v-validate data-vv-rules="required|email" class="form-control" type="email">
        <small class="form-text text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</small>
        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>

    <div class="form-group" :class="{'has-error': errors.has('password') }" >
        <label class="control-label" for="password">Password</label>
        <input name="password" v-model="password" v-validate data-vv-rules="required|min:8|confirmed:password confirmation" class="form-control" type="password">
        <small class="form-text text-danger" v-if="errors.has('password')">{{ errors.first('password') }}</small>
    </div>

    <div class="form-group">
      <label for="password confirmation">Password confirmation</label>
      <input type="password" name="password confirmation" v-model="confirmPassword" class="form-control" v-validate data-vv-rules="required">
      <small class="form-text text-danger" v-if="errors.has('password confirmation')">{{ errors.first('password confirmation') }}</small>
    </div>

    <div class="form-group text-center button__group">
      <input type="submit" class="btn btn-primary btn-lg signup__button" value="Sign up for free" v-bind:disabled="inProgress || errors.any()">
      <div class="loader" v-if="inProgress"></div>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      inProgress: false
    }
  },
  methods: {
    signUp(e) {
      this.$validator.validateAll();

      if (!this.errors.any() && this.email !== "" && this.password !== "") {
        this.inProgress = true

        axios.post("/sign-up", JSON.stringify({email: this.email, password: this.password})).then(res => {
          if (res.data.api_key) {
            localStorage.setItem('api_key', res.data.api_key)
            window.api_key = res.data.api_key
            Event.$emit('login', {api_key: res.data.api_key})

            axios.defaults.headers.common = {
              "X-Api-Key": res.data.api_key
            }

            this.inProgress = false
            this.$router.push('/projects')
          }
        })
      }
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
.home__jumbotron {
  margin-top: 2.5em;
  text-align: center;
}

.btn__login {
  margin-top: 1em;
}

.signup__form {
  max-width: 40%;
  margin: 0 auto;
}

.signup__header {
  text-align: center;
  margin-bottom: 1em;
}

.signup__button {
  margin-top: 1em;
}

.text-alert {
  color: red;
}
</style>
