import Home from "@/view/Home.vue";
import {createRouter, createWebHistory} from "vue-router";
import Login from "@/view/Login.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/login",
            name: "login",
            component: Login
        }
    ]
})

export default router;