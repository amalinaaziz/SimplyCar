<template>
  <div class="ma-4">

    <div v-if="!submitted">
      <p class="headline">Add Availability</p>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-select
          v-model="availability.vehicle"
          :items="carList"
          label="Car"
          :item-text="({brand, build}) => `${brand} ${build}`"
          item-value="id"
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
              @blur="availability.start_at = parseDate(startAtDisplay)"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="availability.start_at"
            no-title
            @input="startAtMenu = false; setStartAt(availability.start_at)"
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
              @blur="availability.end_at = parseDate(endAtDisplay)"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="availability.end_at"
            no-title
            @input="endAtMenu = false; setEndAt(availability.end_at)"
          ></v-date-picker>
        </v-menu>
      </v-form>
    </div>

    <div v-else>
      <v-card flat>
        <v-card-title class="pa-0 text-h6 success--text">
          Successfully added {{availability.name}}!
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "add-availability",
  data () {
    return {
      availability: {
        status: 1,
      },
      submitted: false,
      startAtDisplay: '',
      startAtMenu: false,
      endAtMenu: false,
      endAtDisplay: ''
    }
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
  computed: {
    ...mapGetters(['carList'])
  },
  async mounted () {
    
  },
  methods: {
    ...mapActions(['addAvailability']),
    async saveAvailability () {
      const newAvailability = this.refactorAvailability(this.availability)
      await this.addAvailability(newAvailability)
      this.submitted = true
    },
    refactorAvailability (object) {
      return {
        ...object,
        start_at: this.timestampDate(object.start_at),
        end_at: this.timestampDate(object.end_at)
      }
    },
    setEndAt (val) {
      this.endAtDisplay = this.formatDate(val)
    },
    setStartAt (val) {
      this.startAtDisplay = this.formatDate(val)
    },
    newAvailability () {
      this.submitted = false
      this.availability = {
        status: 1
      }
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
  },
}
</script>