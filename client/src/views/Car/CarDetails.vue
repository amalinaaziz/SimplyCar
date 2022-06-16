<template>
  <div
    v-if="currentCar"
    class="edit-form py-4 mt-4"
  >
    <p class="headline">Car</p>

    <v-form
      ref="form"
      lazy-validation
    >
      <v-text-field
        v-model="currentCar.brand"
        :rules="[(v) => !!v || 'Brand is required']"
        label="First Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentCar.build"
        :rules="[(v) => !!v || 'Build is required']"
        label="Build"
        required
      ></v-text-field>

      <v-text-field
          v-model="currentCar.year"
          :rules="[(v) => !!v || 'Year is required']"
          label="Year"
          required
        ></v-text-field>

        <v-select
          v-model="currentCar.mode"
          :items="modeOptions"
          label="Mode"
          :rules="[(v) => !!v || 'Mode is required']"
        ></v-select>
        <v-select
          readonly
          disabled
          :value="currentCar.owner"
          :items="userList"
          label="Owner"
          :item-text="({first_name, last_name}) => `${first_name} ${last_name}`"
          item-value="id"
          :rules="[(v) => !!v || 'Owner is required']"
        ></v-select>

        <v-switch
          v-model="currentCar.isFeatured"
          label="Featured Car"
          :true-value="true"
        ></v-switch>

      <label>Status:&nbsp;</label>
      <span :class="`${currentCar.status ? 'success' : 'grey'}--text`">{{ currentCar.status ? "Active" : "Inactive" }}</span>

      <v-divider class="my-5"></v-divider>
      <v-progress-linear
        :active="isLoadingUpdateCar"
        :indeterminate="isLoadingUpdateCar"
        absolute
        top
        color="primary"
      ></v-progress-linear>

      <v-btn
        v-if="currentCar.status"
        @click="updateStatus(0)"
        color="warning"
        class="mr-2"
        small
        :disabled="isLoadingUpdateCar"
      >
        Deactivate
      </v-btn>

      <v-btn
        v-else
        @click="updateStatus(1)"
        color="primary"
        class="mr-2"
        small
        :disabled="isLoadingUpdateCar"
      >
        Activate
      </v-btn>

      <v-btn
        @click="onUpdateCar"
        color="secondary"
        class="mr-2"
        small
        :disabled="isLoadingUpdateCar"
      >
        Update
      </v-btn>

      <v-btn
        @click="onDeleteCar"
        color="error"
        text
        small
        :disabled="isLoadingUpdateCar"
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
      The car was updated successfully!
    </v-alert>
  </div>

  <div v-else>
    <p>Please click on a car...</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "car",
  data () {
    return {
      currentCar: null,
      successAlert: false,
      isLoadingUpdateCar: false,
      modeOptions: [
        {text: 'Automatic', value: 'automatic'},
        {text: 'Manual', value: 'manual'}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'cars',
      'userList'
    ])
  },
  watch: {
    '$store.state.cars': (newValue) => {
      this.cars = newValue
    }
  },
  methods: {
    ...mapActions(['updateCar', 'deleteCar', 'listUsers']),
    getCarById (id) {
      this.currentCar = this.cars.find(car => car.id == id)
      this.currentCar.owner.id = this.currentCar.owner._id
    },
    async updateStatus (status) {
      this.isLoadingUpdateCar = true
      const data = {
        ...this.currentCar,
        status: status,
      }
      await this.updateCar(data)
      this.currentCar = data

      this.successAlert = true
      this.isLoadingUpdateCar = false

      setTimeout(() => {
        this.successAlert = false
      }, 5000)
    },
    async onUpdateCar () {
      this.isLoadingUpdateCar = true
      await this.updateCar(this.currentCar)
      this.successAlert = true
      this.isLoadingUpdateCar = false

      setTimeout(() => {
        this.successAlert = false
      }, 5000)
    },
    async onDeleteCar () {
      this.isLoadingUpdateCar = true
      await this.deleteCar(this.currentCar.id)
      this.isLoadingUpdateCar = false
      this.$router.push({ name: "cars" })
    }
  },
  async mounted () {
    await this.listUsers()
    this.successAlert = false
    this.getCarById(this.$route.params.id)
  }
}
</script>

<style>
.edit-form {
  max-width: 400px;
  margin: auto;
}
</style>