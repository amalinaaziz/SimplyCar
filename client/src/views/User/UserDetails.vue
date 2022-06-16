<template>
  <div
    v-if="currentUser"
    class="edit-form py-4 mt-4"
  >
    <p class="headline">User</p>

    <v-form
      ref="form"
      lazy-validation
    >
      <v-text-field
        v-model="currentUser.first_name"
        :rules="[(v) => !!v || 'First name is required']"
        label="First Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentUser.last_name"
        :rules="[(v) => !!v || 'Last name is required']"
        label="Last Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentUser.email"
        :rules="[(v) => !!v || 'Email is required']"
        label="Email"
        required
      ></v-text-field>

      <label>Status:&nbsp;</label>
      <span :class="`${currentUser.status ? 'success' : 'grey'}--text`">{{ currentUser.status ? "Active" : "Inactive" }}</span>

      <v-divider class="my-5"></v-divider>
      <v-progress-linear
        :active="isLoadingUpdateUser"
        :indeterminate="isLoadingUpdateUser"
        absolute
        top
        color="primary"
      ></v-progress-linear>

      <v-btn
        v-if="currentUser.status"
        @click="updateStatus(0)"
        color="warning"
        class="mr-2"
        small
        :disabled="isLoadingUpdateUser"
      >
        Deactivate
      </v-btn>

      <v-btn
        v-else
        @click="updateStatus(1)"
        color="primary"
        class="mr-2"
        small
        :disabled="isLoadingUpdateUser"
      >
        Activate
      </v-btn>

      <v-btn
        @click="onUpdateUser"
        color="secondary"
        class="mr-2"
        small
        :disabled="isLoadingUpdateUser"
      >
        Update
      </v-btn>

      <v-btn
        @click="onDeleteUser"
        color="error"
        text
        small
        :disabled="isLoadingUpdateUser"
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
      The user was updated successfully!
    </v-alert>
  </div>

  <div v-else>
    <p>Please click on a user...</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "user",
  data () {
    return {
      currentUser: null,
      successAlert: false,
      isLoadingUpdateUser: false
    }
  },
  computed: {
    ...mapGetters([
      'users'
    ])
  },
  watch: {
    '$store.state.users': (newValue) => {
      this.users = newValue
    }
  },
  methods: {
    ...mapActions(['updateUser', 'deleteUser']),
    getUserById (id) {
      this.currentUser = this.users.find(user => user.id == id)
    },
    async updateStatus (status) {
      this.isLoadingUpdateUser = true
      const data = {
        ...this.currentUser,
        status: status,
      }
      await this.updateUser(data)
      this.currentUser = data

      this.successAlert = true
      this.isLoadingUpdateUser = false

      setTimeout(() => {
        this.successAlert = false
      }, 5000)
    },
    async onUpdateUser () {
      this.isLoadingUpdateUser = true
      await this.updateUser(this.currentUser)
      this.successAlert = true
      this.isLoadingUpdateUser = false

      setTimeout(() => {
        this.successAlert = false
      }, 5000)
    },
    async onDeleteUser () {
      this.isLoadingUpdateUser = true
      await this.deleteUser(this.currentUser.id)
      this.isLoadingUpdateUser = false
      this.$router.push({ name: "users" })
    }
  },
  mounted () {
    this.successAlert = false
    this.getUserById(this.$route.params.id)
  }
}
</script>

<style>
.edit-form {
  max-width: 400px;
  margin: auto;
}
</style>