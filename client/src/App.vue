<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
    >
      <h4 class="white--text">SimplyCar</h4>
      <v-spacer></v-spacer>
      <v-btn
        to="/"
        color="white"
        text
      >
        Users
      </v-btn>
      <v-btn
        to="/cars"
        color="white"
        text
      >
        Cars
      </v-btn>
      <v-btn
        to="/cars-availability"
        color="white"
        text
      >
        Cars Availability
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    //
  }),
};
</script>
