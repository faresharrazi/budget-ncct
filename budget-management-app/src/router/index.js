import Vue from 'vue'
import VueRouter from 'vue-router'
import MainAccount from '../components/MainAccount.vue'
import Subaccounts from '../components/Subaccounts.vue'
import Transactions from '../components/Transactions.vue'
import Categories from '../components/Categories.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: MainAccount },
    { path: '/subaccounts', component: Subaccounts },
    { path: '/transactions', component: Transactions },
    { path: '/categories', component: Categories }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router