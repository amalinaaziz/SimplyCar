<template>
  <div>
      <UserList :oriHeader="tableHeaders" :oriTableData="tableData" :isLoadingTable="isLoadingTable" @reset-table="handleResetTable" detailPage="user-details" :tableDataTotal="tableDataTotal">
        <template v-slot:header>Users</template>
        <template v-slot:actions>
          <v-dialog
              v-model="addUserDialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="onResetAddUser"
                >
                  Add User
                </v-btn>
              </template>
              <v-card>
                <v-progress-linear
                  :active="isLoadingAddUser"
                  :indeterminate="isLoadingAddUser"
                  absolute
                  color="primary"
                ></v-progress-linear>
                <v-container>
                  <UserAdd ref="addUserDialogRef" />
                </v-container>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="secondary"
                    text
                    @click="addUserDialog = false"
                  >
                    Close
                  </v-btn>
                  <v-btn
                    v-if="isAddedUser"
                    @click="onResetAddUser"
                    color="primary"
                    :disabled="isLoadingAddUser"
                  >Add new user</v-btn>
                  <v-btn
                    v-else
                    color="primary"
                    @click="onAddUser"
                    :disabled="isLoadingAddUser"
                  >
                    Add
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </template>
      </UserList>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UserList from '../components/Table.vue'
import UserAdd from '../views/User/UserAdd.vue'

export default {
  name: "user-list",
  components: {
    UserList,
    UserAdd
  },
  data () {
    return {
      isLoadingAddUser: false,
      isAddedUser: false,
      addUserDialog: false,
      isLoadingTable: false,
      tableData: [],
      tableHeaders: [
        { text: "User", align: "start", sortable: true, value: "name" },
        { text: "Status", value: "status", sortable: false },
        { text: "", value: "details", sortable: false },
      ],
      tableDataTotal: 0
    }
  },
  computed: {
    ...mapGetters([
      'users',
      'userPagination'
    ])
  },
  watch: {
    users: {
      handler(val) {
        this.tableDataTotal = val.length
        this.setTableData()
      },
      deep: true
    },
  },
  mounted () {
  },
  methods: {
    ...mapActions(['fetchUsers']),
    async retrieveUserList (options) {
      this.isLoadingTable = true
      options.sortBy = options.sortBy?.map(opt => opt === 'name' ? 'first_name' : options.sortBy)
      await this.fetchUsers(options)
      this.tableDataTotal = this.userPagination.total_items
      
      this.setTableData()
      this.isLoadingTable = false
    },
    setTableData() {
      this.tableData = this.users.map(this.getUserDisplay)
    },
    handleResetTable (options) {
      this.retrieveUserList(options)
    },
    async onAddUser () {
      this.isLoadingAddUser = true
      await this.$refs.addUserDialogRef?.saveUser()
      this.isAddedUser = true
      this.isLoadingAddUser = false
    },
    onResetAddUser () {
      this.isLoadingAddUser = true
      if (this.$refs.addUserDialogRef) this.$refs.addUserDialogRef.newUser()
      this.isAddedUser = false
      this.isLoadingAddUser = false
    },
    getUserDisplay (user) {
      return {
        ...user,
        name: `${user.first_name} ${user.last_name}`
      }
    },
  },
}
</script>

<style>
.list {
  max-width: 750px;
}
.transparent-list {
  background-color: transparent !important;
}

.v-application--is-ltr .v-data-table__mobile-row__cell {
  max-width: 250px;
}
</style>