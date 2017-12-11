<template>
  <div class="profile">
    <h1 class="text-center heading">User profile</h1>

    <div class="form-group">
      <label for="email">Email</label>
      <input class="form-control" type="text" name="password" v-model="email">
    </div>

    <div class="form-group">
      <label for="password">New password</label>
      <input class="form-control" type="password" name="password" v-model="password" autocomplete="off">
    </div>

    <div class="form-group login__btns">
      <button class="btn btn-primary" type="submit" @click="updateProfile">Update profile</button>
      <div class="loader loader--inline" v-if="inProgress"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      email: "",
      password: "",
      inProgress: false
    }
  },
  methods: {
    updateProfile() {
      this.inProgress = true
      var data = {}
      if (this.email) { data.email = this.email }
      if (this.password) { data.password = this.password }
      axios.patch('/users/' + this.user.id, JSON.stringify(data)).then(res => {
        this.inProgress = false
        Event.$emit('flash', {flash: "Your profile has been updated", flashClass: "alert alert-success"})
        Event.$emit('fetchUser')
      })
    }
  },
  mounted() {
    axios.get('/current_user').then(res => {
      this.user = res.data
      this.email = res.data.email
    })
  }
}
</script>

<style>
.profile {
  max-width: 40%;
  margin: 3em auto 0;
}

.profile.heading {
  margin-bottom: 2em;
}
</style>
