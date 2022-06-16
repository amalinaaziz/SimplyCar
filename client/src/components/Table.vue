<template>
  <div
    align="center"
    class="list mx-auto my-4"
  >
    <v-card
      class="mx-auto pt-2"
      tile
    >
      <v-data-table
        :headers="headers"
        :items="tableData"
        :loading="isLoadingTable"
        :options.sync="pagination"
        :server-items-length="tableDataTotal"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title><slot name="header">SimplyCar</slot></v-toolbar-title>
            <v-spacer></v-spacer>
            <slot name="actions"></slot>
          </v-toolbar>

          <v-text-field
            v-model="searchInput"
            @change="onChangeSearch"
            @click:clear="onClearSearch"
            label="Search..."
            prepend-inner-icon="mdi-magnify"
            class="mx-4"
            clearable
          ></v-text-field>

        </template>
        <template v-slot:[`item.name`]="{ item }">
          <v-list class="pa-0 transparent-list">
            <v-list-item>
              <v-list-item-avatar>
                <v-img
                  v-if="item.avatar"
                  :src="item.avatar"
                  :alt="item.name"
                ></v-img>
                <v-avatar
                  v-else
                  color="grey"
                  size="48"
                  style="min-width: 40px"
                >
                  <span class="white--text text-h7 text-uppercase font-weight-light">{{item.name.substring(0,2)}}</span>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.build }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="item.status ? 'success' : 'grey'"
            text-color="white"
            class="ma-2"
            small
          >
            {{item.status ? 'Active' : 'Inactive'}}
          </v-chip>
        </template>

        <template v-slot:[`item.details`]="{ item }">
          <v-btn
            @click="showTableDetails(item.id)"
            color="info"
            text
            small
          >
            View Details
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "table-list",
  props: ['oriTableData', 'detailPage', 'oriHeader', 'tableDataTotal'],
  components: {
  },
  data () {
    return {
      tableData: [],
      isLoadingTable: false,
      searchInput: "",
      headers: [],
      inputTimer: null,
      pagination: {}
    }
  },
  computed: {
  },
  watch: {
    pagination: {
        handler () {
          this.getDataFromApi()
        },
        deep: true,
      },
    oriTableData: {
      handler(newValue) {
        this.tableData = newValue
      },
      deep: true
    },
    oriHeader: {
      handler(newValue) {
        this.headers = newValue
      },
      deep: true
    },
    searchInput() {
      // for lazy input change
      if (this.inputTimer) clearTimeout(this.inputTimer)

      const delay = 1500
      this.inputTimer = setTimeout(() => {
        this.onChangeSearch()
      }, delay)
    }

  },
  methods: {
    async getDataFromApi () {
        this.isLoadingTable = true
        this.$emit('reset-table', {...this.pagination, search: this.searchInput})
        this.isLoadingTable = false
      },
    showTableDetails (id) {
      if(!this.detailPage) return
      this.$router.push({ name: this.detailPage, params: { id } })
    },
    async onChangeSearch () {
      this.$emit('reset-table', {...this.pagination, search: this.searchInput})
      // if (!this.searchInput || !this.searchInput.trim()) {
      //   this.$emit('reset-table')
      //   return
      // }
      
      // this.tableData = this.oriTableData.filter(row => {
      //   return this.searchLogic(JSON.stringify(row))
      // })
    },
    searchLogic (field) {
      return field.toLowerCase().indexOf(this.searchInput.trim()) > -1
    },
    onClearSearch () {
      this.searchInput = ''
      this.onChangeSearch()
    },
  },
  mounted () {
    this.tableData = [...this.oriTableData]
    this.headers = [...this.oriHeader]
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