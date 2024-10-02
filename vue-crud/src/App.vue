<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-purple-8 text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="toolbar-title">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <span class="title-text">MiniStore</span>
        </q-toolbar-title>
        <q-btn flat icon="menu" @click="toggleLeftDrawer"></q-btn>
      </q-toolbar>

      <q-tabs align="left" class="text-white bg-purple-6 q-mt-sm">
        <q-route-tab to="/" label="customer" />
        <q-route-tab to="/home-product" label="Product" />
        
      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay class="bg-purple-3">
      <q-list class="drawer-list">
        <router-link to="/" tag="q-item" clickable v-ripple class="drawer-item">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Customer</q-item-section>
        </router-link>

        <router-link to="/home-product" tag="q-item" clickable v-ripple class="drawer-item">
          <q-item-section avatar>
            <q-icon name="store" />
          </q-item-section>
          <q-item-section>Products</q-item-section>
        </router-link>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-purple-6 text-white q-pa-md">
      <div class="text-center">
        <q-icon name="favorite" color="red" /> Made with Love by MiniStore Team
      </div>
    </q-footer>

  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      leftDrawerOpen: false
    };
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    }
  }
};
</script>

<style scoped>
/* Title text for the logo and name */
.title-text {
  font-weight: bold;
  font-size: 1.5rem;
  margin-left: 5px; /* Add space between logo and text */
  padding: 15px 10px;
}

/* Ensure that the toolbar title behaves as flexbox to align items in a row */
.toolbar-title {
  display: flex;
  align-items: center; /* Center logo and text vertically */
  padding: 6px 20px;
}

/* Styles for the Drawer */
.drawer-list {
  padding: 20px;
  font-family: sans-serif;
  font-size: 20px;
}

.drawer-item {
  display: flex;
  align-items: center;
  transition: background-color 0.3s, color 0.3s;
  text-decoration: none;
}

.drawer-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.q-icon {
  font-size: 1.5rem;
  color: #fff;
  margin-right: 10px;
}

/* General page container padding */
.q-page-container {
  padding: 20px;
}

/* Footer styling */
.q-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
