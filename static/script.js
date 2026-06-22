import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js'
import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'
import Admin from './components/Admin.js'
import Student from './components/Student.js' 
const routes=[
    {path:'/',component:Home},
    {path:'/login',component:Login},
    {path:'/register',component:Register},
    { path:'/admin', component:Admin },
    { path:'/student', component:Student }
]
const router = new VueRouter({
    routes:routes
})

const app = new Vue({
    el: '#app',
    router:router,

    template: `
    <div class="container">
        <nav-bar></nav-bar>
        <router-view></router-view>
        <foot></foot>
    </div>
    `,
    data: {
        message: 'Frontend is running'
    },
    components:{
        'nav-bar':Navbar,
        'foot':Footer
    }
})