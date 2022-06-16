<template>
  <div class="ma-4">

    <div v-if="!submitted">
      <p class="headline">Add User</p>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-text-field
          v-model="user.first_name"
          :rules="[(v) => !!v || 'First name is required']"
          label="First Name"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.last_name"
          :rules="[(v) => !!v || 'Last name is required']"
          label="Last Name"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.email"
          :rules="[(v) => !!v || 'Email is required']"
          label="Email"
          required
        ></v-text-field>
      </v-form>
    </div>

    <div v-else>
      <v-card flat>
        <v-card-title class="pa-0 text-h6 success--text">
          Successfully added {{user.name}}!
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: "add-user",
  data () {
    return {
      user: {
        id: null,
        status: 1,
      },
      submitted: false,
    }
  },
  methods: {
    ...mapActions(['addUser']),
    async saveUser () {
      await this.addUser(this.user)
      this.submitted = true
    },
    newUser () {
      this.submitted = false
      this.user = {
        status: 1
      }
    },
  },
}
</script>