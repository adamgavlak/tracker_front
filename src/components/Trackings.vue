<template>
  <div class="trackings">
    <div class="graphics">
        <svg width="1110px" height="140" viewBox="0 0 1100 140" xmlns="http://www.w3.org/2000/svg">

            <rect x="0" y="0" width="100%" height="100px" fill="#f0f0f0" rx="4" ry="4"></rect>

            <g>
              <g v-for="n in 23" :key="n">
                  <line :x1="n*46.25" :x2="n*46.25" y1="100" y2="110" stroke="#e6e6e6" stroke-width="2" class="line" />
                  <text :x="n*46.25" y="130" stroke="none" fill="#467BFA" class="graph-label" text-anchor="middle" v-text="n">
                  </text>
              </g>
            </g>

            <g class="projects">
                <g v-for="tracking in trackings" :key="tracking.id" :transform=' "translate(" + tracking.x + ")" '>
                    <rect  y="0" :width="tracking.width" height="100" rx="5" ry="5" :fill="tracking.project_color"/>

                    <text :x="tracking.width/2" y="56" stroke="none" fill="#fff" style="text-shadow: 0 2px 5px rgba(0,0,0,0.5)" class="graph-label" text-anchor="middle" v-text="tracking.duration"></text>
                </g>
            </g>
        </svg>
    </div>

    <div class="row row__date">
      <div class="col text-center"><button class="btn btn-outline-primary" @click="addDay(-1)">←</button></div>
      <div class="col text-center" v-text="dateFormat"></div>
      <div class="col text-center"><button class="btn btn-outline-primary" @click="addDay(1)">→</button></div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>From</th>
          <th>To</th>
          <th>Project</th>
          <th>Note</th>
          <th colspan="2" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tracking in trackings" :key="tracking.id">
          <td v-text="tracking.from"></td>
          <td v-text="tracking.to"></td>
          <td>
            <span :style="{'background': tracking.project_color}" class="color__preview"></span>
            <span class="color__text" v-text="tracking.project_name"></span>
          </td>
          <td v-text="tracking.note"></td>
          <td><button class="btn btn-primary btn-sm" @click="editTracking(tracking)">Edit</button></td>
          <td><button class="btn btn-danger btn-sm" @click="deleteTracking(tracking)">Delete</button></td>
        </tr>
      </tbody>
      <tfoot>
        <td><input type="text" v-model="from" class="form-control" placeholder="e.g., 00:00"></td>
        <td><input type="text" v-model="to" class="form-control" placeholder="e.g., 18:00"></td>
        <td><select v-model="project" class="form-control">
            <option value="" disabled>Select project</option>
            <option v-for="project in projects" :key="project.id" :value="project" v-text="project.name"></option>
          </select></td>
        <td><input type="text" v-model="note" class="form-control" placeholder=""></td>
        <td colspan="2"><button class="btn btn-primary btn-sm" @click="addTracking">Add new tracking</button></td>
      </tfoot>
    </table>

    <div class="modal-mask" v-if="modalOpen">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <h2>Update tracking</h2>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div class="form-group">
                <label>From</label>
                <input type="text" v-model="modal.from" class="form-control">
              </div>

              <div class="form-group">
                <label>To</label>
                <input type="text" v-model="modal.to" class="form-control">
              </div>

              <div class="form-group">
                <label>Project</label>
                <select v-model="modal.project" class="form-control">
                  <option value="" disabled>Select project</option>
                  <option v-for="project in projects" :key="project.id" :value="project.id" v-text="project.name"></option>
                </select>
              </div>

              <div class="form-group">
                <label>Note</label>
                <input type="text" v-model="modal.note" class="form-control">
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-outline-primary" @click="closeModal">Cancel</button>
              <button class="btn btn-primary" @click="updateTracking">Save</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let hours = 1110 / 24;
let minutes = hours / 60;

export default {
  data() {
    return {
      trackings: [],
      projects: [],
      day: 0,
      month: 0,
      year: 1970,
      from: "",
      to: "",
      project: "",
      note: "",
      modal: {
        tracking_id: null,
        from: "",
        to: "",
        project: null,
        note: ""
      },
      modalOpen: false,
      currentEditedTracking: null
    }
  },
  mounted() {
    var date = new Date()
    this.year = date.getFullYear()
    this.month = date.getMonth()+1
    this.day = date.getDate()

    this.fetchTrackings()
    axios.get('/projects').then(res => this.projects = res.data)
  },
  computed: {
    dateFormat() {
      return this.day + '.' + this.month + '.' + this.year
    }
  },
  methods: {
    fetchTrackings() {
      axios.get('/trackings?day=' + this.year + '-' + this.month + '-' + this.day).then(res => {
        this.trackings = res.data

        this.trackings.map(el => {
          let from = el.from.split(':')
          let to = el.to.split(':')

          let h = ((+to[0]) - (+from[0]))
          let m = ((+to[1]) - (+from[1]))

          if (m < 0)
          {
            h--
            m = 60 + m
          }

          el.x = (+from[0]) * hours + (+from[1]) * minutes
          el.width =  h * hours + m * minutes

          let d = 0;
          if (h < 1) {
            d = m + "m"
          } else if (m < 1) {
            d = h + "h"
          } else {
            d = h + "h " + m + "m"
          }

          el.duration = d
        })
      })
    },
    addTracking() {
      var data = {
        day: this.year + '-' + this.month + '-' + this.day,
        from: this.from,
        to: this.to,
        note: this.note
      }
      axios.post('/projects/' + this.project.id + '/trackings', JSON.stringify(data)).then(res => {
        this.fetchTrackings()

        this.project = ""
        this.from = ""
        this.to = ""
        this.note = ""
      })
    },
    editTracking(tracking) {
      this.currentEditedTracking = tracking
      this.modal.tracking_id = tracking.id
      this.modal.from = tracking.from
      this.modal.to = tracking.to
      this.modal.project = tracking.project_id
      this.modal.note = tracking.note
      this.modalOpen = true
    },
    updateTracking() {
      var data = {
        project_id: this.modal.project,
        from: this.modal.from,
        to: this.modal.to,
        note: this.modal.note
      }

      axios.patch('/trackings/' + this.modal.tracking_id, JSON.stringify(data)).then(res => this.fetchTrackings())

      this.modalOpen = false
    },
    closeModal() {
      this.modalOpen = false
    },
    deleteTracking(tracking) {
      axios.delete('/trackings/' + tracking.id)
      this.trackings.splice(this.trackings.indexOf(tracking), 1)
    },
    addDay(amount) {
      this.day += amount
      this.fetchTrackings()
    }
  }
}
</script>

<style>
.heading {
  margin: 0.75em 0 1.2em;
}

.color__preview {
  display: inline-block;
  width: 1em;
  height: 1em;
  border-radius: 15%;
  border: 1px solid rgba(0,0,0,0.25);
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

.row__date {
  margin: 2em 0 1em;
}

.graphics {
  margin-top: 2em;
}
</style>
