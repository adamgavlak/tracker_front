<template>
  <div class="projects">
    <h1 class="text-center heading">Projects</h1>

    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Color</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td v-text="project.name"></td>
          <td>
            <span :style="{'background': project.color}" class="color__preview"></span>
            <span class="color__text" v-text="project.color"></span>
          </td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteProject(project)">Delete</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <td><input type="text" v-model="name" class="form-control" placeholder="e.g., Project"></td>
        <td><input type="text" v-model="color" class="form-control" placeholder="e.g., #000000"></td>
        <td><button class="btn btn-primary btn-sm" @click="addProject">Add new project</button></td>
      </tfoot>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [],
      name: "",
      color: ""
    }
  },
  methods: {
    deleteProject(project) {
      axios.delete("/projects/" + project.id).then(res => this.projects.splice(this.projects.indexOf(project)))
    },
    addProject() {
      axios.post("/projects", JSON.stringify({name: this.name, color: this.color})).then(res => {
        this.projects.push(res.data)
        this.name = ""
        this.color = ""
      })
    }
  },
  mounted() {
    axios.get('/projects').then(res => this.projects = res.data)
  }
}
</script>

<style>
.color__preview {
  display: inline-block;
  width: 1em;
  height: 1em;

}
</style>


