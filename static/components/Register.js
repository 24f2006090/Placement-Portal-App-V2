export default {
    template: `
    <div class="container mt-5">

        <div class="row justify-content-center">

            <div class="col-md-6">

                <div class="card">

                    <div class="card-header bg-success text-white text-center">
                        <h4 class="mb-0">Register</h4>
                    </div>

                    <div class="card-body">

                        <div class="mb-3">
                            <label class="form-label">Username</label>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Enter Username"
                                v-model="username">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input
                                type="email"
                                class="form-control"
                                placeholder="Enter Email"
                                v-model="email">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Password</label>
                            <input
                                type="password"
                                class="form-control"
                                placeholder="Enter Password"
                                v-model="password">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Role</label>
                            <select class="form-select" v-model="role">
                                <option>Student</option>
                                <option>Company</option>
                            </select>
                        </div>

                        <button class="btn btn-success w-100">
                            Register
                        </button>

                        <div class="text-center mt-3">
                            Already have an account?
                            <router-link to="/login">
                                Login
                            </router-link>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>
    `
}