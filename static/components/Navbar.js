export default {
template: `
<nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">

    <div class="container">

        <router-link class="navbar-brand" to="/">
            Placement Portal
        </router-link>

        <div class="navbar-nav ms-auto">

            <router-link class="nav-link" to="/">
                Home
            </router-link>

            <router-link class="nav-link" to="/login">
                Login
            </router-link>

            <router-link class="nav-link" to="/register">
                Register
            </router-link>

        </div>

    </div>

</nav>
`
}