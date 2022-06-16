<template>
  <div>
      <CarList :oriHeader="tableHeaders" :oriTableData="tableData" :isLoadingTable="isLoadingTable" @reset-table="handleResetTable" detailPage="car-details" :tableDataTotal="tableDataTotal">
        <template v-slot:header>Cars</template>
        <template v-slot:actions>
          <v-dialog
              v-model="addCarDialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="onResetAddCar"
                >
                  Add Car
                </v-btn>
              </template>
              <v-card>
                <v-progress-linear
                  :active="isLoadingAddCar"
                  :indeterminate="isLoadingAddCar"
                  absolute
                  color="primary"
                ></v-progress-linear>
                <v-container>
                  <CarAdd ref="addCarDialogRef" />
                </v-container>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="secondary"
                    text
                    @click="addCarDialog = false"
                  >
                    Close
                  </v-btn>
                  <v-btn
                    v-if="isAddedCar"
                    @click="onResetAddCar"
                    color="primary"
                    :disabled="isLoadingAddCar"
                  >Add new car</v-btn>
                  <v-btn
                    v-else
                    color="primary"
                    @click="onAddCar"
                    :disabled="isLoadingAddCar"
                  >
                    Add
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </template>
      </CarList>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CarList from '../components/Table.vue'
import CarAdd from '../views/Car/CarAdd.vue'

export default {
  name: "car-list",
  components: {
    CarList,
    CarAdd
  },
  data () {
    return {
      isLoadingAddCar: false,
      isAddedCar: false,
      addCarDialog: false,
      isLoadingTable: false,
      tableData: [],
      tableHeaders: [{ text: "Car", align: "start", sortable: true, value: "name" },
        { text: "Owner", sortable: false, value: "ownerName" },
        { text: "Status", value: "status", sortable: false },
        { text: "", value: "details", sortable: false }
      ],
      tableDataTotal: 0
    }
  },
  computed: {
    ...mapGetters([
      'cars',
      'carPagination'
    ])
  },
  watch: {
    cars: {
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
    ...mapActions(['fetchCars']),
    async retrieveCarList (options) {
      this.isLoadingTable = true
      options.sortBy = options.sortBy?.map(opt => opt === 'name' ? 'build' : options.sortBy)
      await this.fetchCars(options)
      this.tableDataTotal = this.carPagination.total_items
      
      this.setTableData()
      this.isLoadingTable = false
    },
    setTableData() {
      this.tableData = this.cars.map(this.getCarDisplay)
    },
    handleResetTable (options) {
      this.retrieveCarList(options)
    },
    async onAddCar () {
      this.isLoadingAddCar = true
      await this.$refs.addCarDialogRef?.saveCar()
      this.isAddedCar = true
      this.isLoadingAddCar = false
    },
    onResetAddCar () {
      this.isLoadingAddCar = true
      if (this.$refs.addCarDialogRef) this.$refs.addCarDialogRef.newCar()
      this.isAddedCar = false
      this.isLoadingAddCar = false
    },
    getCarDisplay (car) {
      return {
        ...car,
        ownerName: car.owner ? `${car.owner.first_name} ${car.owner.last_name}` : '',
        name: `${car.brand} ${car.year}`
      }
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