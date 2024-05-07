<template>
  <header>
    <router-link to="/">Main Account</router-link>
    <router-link to="/subaccounts">Subaccounts</router-link>
    <router-link to="/transactions">Transactions</router-link>
    <router-link to="/categories">Categories</router-link>
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>

<script>
export default {
  name: "App",
};
</script>

<style></style>
