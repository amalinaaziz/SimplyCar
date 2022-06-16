<template>
  <div
    v-if="currentAvailability"
    class="edit-form py-4 mt-4"
  >
    <p class="headline">Cars Availability</p>

    <v-form
      ref="form"
      lazy-validation
    >
      <v-select
      readonly
      disabled
      v-model="currentAvailability.vehicle"
      :items="carList"
      label="Car"
      :item-text="({brand, build}) => `${brand} ${build}`"
      item-value="_id"
      :rules="[(v) => !!v || 'Car is required']"
      ></v-select>

      <v-menu
        v-model="startAtMenu"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="startAtDisplay"
            label="Start Date"
            hint="MM/DD/YYYY"
            persistent-hint
            v-bind="attrs"
            @blur="currentAvailability.start_at = parseDate(startAtDisplay)"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="currentAvailability.start_at"
          no-title
          @input="startAtMenu = false; setStartAt(currentAvailability.start_at)"
        ></v-date-picker>
      </v-menu>

      <v-menu
        v-model="endAtMenu"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="endAtDisplay"
            label="Start Date"
            hint="MM/DD/YYYY"
            persistent-hint
            v-bind="attrs"
            @blur="currentAvailability.end_at = parseDate(endAtDisplay)"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="currentAvailability.end_at"
          no-title
          @input="endAtMenu = false; setEndAt(currentAvailability.end_at)"
        ></v-date-picker>
      </v-menu>

      <label>Status:&nbsp;</label>
      <span :class="`${currentAvailability.status ? 'success' : 'grey'}--text`">{{ currentAvailability.status ? "Active" : "Inactive" }}</span>

      <v-divider class="my-5"></v-divider>
      <v-progress-linear
        :active="isLoadingUpdateAvailability"
        :indeterminate="isLoadingUpdateAvailability"
        absolute
        top
        color="primary"
      ></v-progress-linear>

      <v-btn
        v-if="currentAvailability.status"
        @click="updateStatus(0)"
        color="warning"
        class="mr-2"
        small
        :disabled="isLoadingUpdateAvailability"
      >
        Deactivate
      </v-btn>

      <v-btn
        v-else
        @click="updateStatus(1)"
        color="primary"
        class="mr-2"
        small
        :disabled="isLoadingUpdateAvailability"
      >
        Activate
      </v-btn>

      <v-btn
        @click="onUpdateAvailability"
        color="secondary"
        class="mr-2"
        small
        :disabled="isLoadingUpdateAvailability"
      >
        Update
      </v-btn>

      <v-btn
        @click="onDeleteAvailability"
        color="error"
        text
        small
        :disabled="isLoadingUpdateAvailability"
      >
        Delete
      </v-btn>

       <v-btn
        @click="$router.go(-1)"
        color="grey"
        text
        small
      >
        Back
      </v-btn>

    </v-form>

    <v-alert
      v-model="successAlert"
      color="success"
      border="left"
      elevation="2"
      class="mt-4"
      colored-border
    >
      The availability was updated successfully!
    </v-alert>
  </div>

  <div v-else>
    <p>Please click on a availability...</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "availability",
  data () {
    return {
      currentAvailability: null,
      successAlert: false,
      isLoadingUpdateAvailability: false,
      startAtDisplay: '',
      startAtMenu: false,
      endAtMenu: false,
      endAtDisplay: ''
    }
  },
  computed: {
    ...mapGetters([
      'availability',
      'carList'
    ])
  },
  watch: {
    availability: {
      handler(val) {
         this.setStartAt(val.start_at)
         this.setEndAt(val.end_at)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['updateAvailability', 'deleteAvailability']),
    getAvailabilityById (id) {
      const obj = this.availability.find(availability => availability.id == id)
      this.currentAvailability = this.getCurrentAvailabilityObj(obj)
      this.startAtDisplay = this.getDisplayDate(obj.start_at)
      this.endAtDisplay = this.getDisplayDate(obj.end_at)
    },
    getCurrentAvailabilityObj (obj) {
      return {
        ...obj,
        start_at: this.formatISODate(obj.start_at),
        end_at: this.formatISODate(obj.end_at),
      }
    },
    refactorAvailability (object) {
      return {
        ...object,
        start_at: this.timestampDate(object.start_at),
        end_at: this.timestampDate(object.end_at)
      }
    },
    async updateStatus (status) {
      this.isLoadingUpdateAvailability = true
      const data = {
        ...this.currentAvailability,
        status: status,
      }
      const newAvai = this.refactorAvailability(data)
      await this.updateAvailability(newAvai)
      this.currentAvailability = data

      this.successAlert = true
      this.isLoadingUpdateAvailability = false

      setTimeout(() => {
        this.successAlert = false
      }, 5000)
    },
    async onUpdateAvailability () {
      this.isLoadingUpdateAvailability = true
      const newAvai = this.refactorAvailability(this.currentAvailability)
      await this.updateAvailability(newAvai)
      this.successAlert = true
      this.isLoadingUpdateAvailability = false

      setTimeout(() => {
        this.successAlert = false
      }, 5000)
    },
    async onDeleteAvailability () {
      this.isLoadingUpdateAvailability = true
      await this.deleteAvailability(this.currentAvailability.id)
      this.isLoadingUpdateAvailability = false
      this.$router.push({ name: "cars-availability" })
    },
    setEndAt (val) {
      this.endAtDisplay = this.formatDate(val)
    },
    setStartAt (val) {
      this.startAtDisplay = this.formatDate(val)
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    timestampDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      const newDate = new Date(year, month - 1, day);
      return newDate.toISOString()
    },
    getDisplayDate (date) {
      if (!date) return null

      const newDate = new Date(date);
      return (newDate.getMonth()+1)+ '/'+newDate.getDate() +'/' +  newDate.getFullYear() 
    },
    formatISODate (date) {
      if (!date) return null

      const newDate = new Date(date);
      return newDate.getFullYear()  +'-' + (newDate.getMonth()+1)+ '-'+newDate.getDate()  
    },
  },
  mounted () {
    this.successAlert = false
    this.getAvailabilityById(this.$route.params.id)
  }
}
</script>

<style>
.edit-form {
  max-width: 400px;
  margin: auto;
}
</style>