<template>
  <div>
      <AvailabilityList :oriHeader="tableHeaders" :oriTableData="tableData" :isLoadingTable="isLoadingTable" @reset-table="handleResetTable" detailPage="car-availability-details" :tableDataTotal="tableDataTotal">
        <template v-slot:header>Cars Availability</template>
        <template v-slot:actions>
          <v-dialog
              v-model="addAvailabilityDialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="onResetAddAvailability"
                >
                  Add Availability
                </v-btn>
              </template>
              <v-card>
                <v-progress-linear
                  :active="isLoadingAddAvailability"
                  :indeterminate="isLoadingAddAvailability"
                  absolute
                  color="primary"
                ></v-progress-linear>
                <v-container>
                  <AvailabilityAdd ref="addAvailabilityDialogRef" />
                </v-container>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="secondary"
                    text
                    @click="addAvailabilityDialog = false"
                  >
                    Close
                  </v-btn>
                  <v-btn
                    v-if="isAddedAvailability"
                    @click="onResetAddAvailability"
                    color="primary"
                    :disabled="isLoadingAddAvailability"
                  >Add new availability</v-btn>
                  <v-btn
                    v-else
                    color="primary"
                    @click="onAddAvailability"
                    :disabled="isLoadingAddAvailability"
                  >
                    Add
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </template>
      </AvailabilityList>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AvailabilityList from '../components/Table.vue'
import AvailabilityAdd from '../views/CarAvailability/CarAvailabilityAdd.vue'

export default {
  name: "availability-list",
  components: {
    AvailabilityList,
    AvailabilityAdd
  },
  data () {
    return {
      isLoadingAddAvailability: false,
      isAddedAvailability: false,
      addAvailabilityDialog: false,
      isLoadingTable: false,
      tableData: [],
      tableHeaders: [
        { text: "Availability", align: "start", sortable: true, value: "name" },
        { text: "Status", value: "status", sortable: false },
        { text: "", value: "details", sortable: false },
      ],
      tableDataTotal: 0
    }
  },
  computed: {
    ...mapGetters([
      'availability',
      'availabilityPagination'
    ])
  },
  watch: {
    availability: {
      handler(val) {
        this.tableDataTotal = val.length
        this.setTableData()
      },
      deep: true
    },
  },
  async mounted () {
    await this.listCars()
  },
  methods: {
    ...mapActions(['fetchAvailability', 'listCars']),
    async retrieveAvailabilityList (options) {
      this.isLoadingTable = true
      options.sortBy = options.sortBy?.map(opt => opt === 'name' ? 'start_at' : options.sortBy)
      await this.fetchAvailability(options)

      this.setTableData()
      this.tableDataTotal = this.availabilityPagination.total_items
      
      this.isLoadingTable = false
    },
    setTableData() {
      this.tableData = this.availability.map(this.getAvailabilityDisplay)
    },
    handleResetTable (options) {
      this.retrieveAvailabilityList(options)
    },
    async onAddAvailability () {
      this.isLoadingAddAvailability = true
      await this.$refs.addAvailabilityDialogRef?.saveAvailability()
      this.isAddedAvailability = true
      this.isLoadingAddAvailability = false
    },
    onResetAddAvailability () {
      this.isLoadingAddAvailability = true
      if (this.$refs.addAvailabilityDialogRef) this.$refs.addAvailabilityDialogRef.newAvailability()
      this.isAddedAvailability = false
      this.isLoadingAddAvailability = false
    },
    getAvailabilityDisplay (availability) {
      return {
        ...availability,
        name: `${availability.vehicle ? availability.vehicle.brand : ''} ${this.UTCStringToDate(availability.start_at)}`
      }
    },
    UTCStringToDate(utcString) {
      return this.dateToYMD(new Date(utcString))
    },
    dateToYMD(date) {
      const d = date.getDate();
      const m = date.getMonth() + 1; //Month from 0 to 11
      const y = date.getFullYear();
      return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }
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