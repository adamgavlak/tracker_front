<template>
  <div class="projects">
    <h1 class="text-center heading">Projects</h1>

    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Color</th>
          <th colspan="2">Actions</th>
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
            <button class="btn btn-primary btn-sm" @click="editProject(project)">Edit</button>
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


    <div class="modal-mask" v-if="modalOpen">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <h2>Update project</h2>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div class="form-group">
                <label>Name</label>
                <input type="text" v-model="modal.name" class="form-control">
              </div>

              <div class="form-group">
                <label>Color</label>
                <input type="text" v-model="modal.color" class="form-control" placeholder="e.g., #123456">
                <small class="text-muted">preview: </small><span :style="{'background': modal.color, 'border-radius': '20%', 'position': 'relative', 'top': '0.2em'}" class="color__preview"></span>
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-outline-primary" @click="closeModal">Cancel</button>
              <button class="btn btn-primary" @click="updateProject">Save</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [],
      name: "",
      color: "",
      modal: {
        name: "",
        color: ""
      },
      modalOpen: false,
      currentEditedProject: null
    }
  },
  methods: {
    deleteProject(project) {
      axios.delete("/projects/" + project.id)
      this.projects.splice(this.projects.indexOf(project), 1)
    },
    editProject(project) {
      this.currentEditedProject = project
      this.modal.name = project.name
      this.modal.color = project.color

      this.modalOpen = true
    },
    updateProject() {
      var data = {
        name: this.modal.name,
        color: this.modal.color
      }

      axios.patch("/projects/" + this.currentEditedProject.id, JSON.stringify(data)).then(res => this.fetchProjects())

      this.modalOpen = false
    },
    closeModal() {
      this.modalOpen = false
    },
    addProject() {
      axios.post("/projects", JSON.stringify({name: this.name, color: this.color})).then(res => {
        this.projects.push(res.data)
        this.name = ""
        this.color = ""
      })
    },
    fetchProjects() {
      axios.get('/projects').then(res => this.projects = res.data)
    }
  },
  mounted() {
    this.fetchProjects()
  }
}
</script>

<style>
.color__preview {
  display: inline-block;
  width: 1em;
  height: 1em;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}
</style>


