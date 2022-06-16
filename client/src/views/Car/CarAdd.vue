<template>
  <div class="ma-4">

    <div v-if="!submitted">
      <p class="headline">Add Car</p>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-text-field
          v-model="car.brand"
          :rules="[(v) => !!v || 'Brand is required']"
          label="Brand"
          required
        ></v-text-field>

        <v-text-field
          v-model="car.build"
          :rules="[(v) => !!v || 'Build is required']"
          label="Build"
          required
        ></v-text-field>

        <v-text-field
          v-model="car.year"
          :rules="[(v) => !!v || 'Year is required']"
          label="Year"
          required
        ></v-text-field>

        <v-select
          v-model="car.mode"
          :items="modeOptions"
          label="Mode"
          :rules="[(v) => !!v || 'Mode is required']"
        ></v-select>

        <v-select
          v-model="car.owner"
          :items="userList"
          label="Owner"
          :item-text="({first_name, last_name}) => `${first_name} ${last_name}`"
          item-value="id"
          :rules="[(v) => !!v || 'Owner is required']"
        ></v-select>

        <v-switch
          v-model="car.isFeatured"
          label="Featured Car"
          :true-value="true"
        ></v-switch>
      </v-form>
    </div>

    <div v-else>
      <v-card flat>
        <v-card-title class="pa-0 text-h6 success--text">
          Successfully added {{car.brand}}!
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "add-car",
  data () {
    return {
      car: {
        status: 1,
      },
      submitted: false,
      modeOptions: [
        {text: 'Automatic', value: 'automatic'},
        {text: 'Manual', value: 'manual'}
      ]
    }
  },
  computed: {
    ...mapGetters(['userList'])
  },
  async mounted () {
    await this.listUsers()
  },
  methods: {
    ...mapActions(['addCar', 'listUsers']),
    async saveCar () {
      await this.addCar(this.car)
      this.submitted = true
    },
    newCar () {
      this.submitted = false
      this.car = {
        status: 1
      }
    },
  },
}
</script>