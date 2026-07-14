export default{
    template:`
    <div class="container mt-5">
    <div class="row justify-content-center">
    <div class="col-md-6">
    <div class="card shadow">
    <div class="card-header bg-success text-white text-center">
    <h3>
        Create Account
    </h3>
    </div>
    <div class="card-body text-center">
    <p class="mb-4">
        Please Select the Way you want to Register.
    </p>
    <router-link
    class="btn btn-primary w-100 mb-3" to="/student/register">
        Register as Student
    </router-link>
    <router-link
    class="btn btn-success w-100 mb-3" to="/company/register">
        Register as Company
    </router-link>
    <router-link
    class="btn btn-outline-dark w-100" to="/login">
        Back to Login
    </router-link>
    </div>
    </div>
    </div>
    </div>
    </div>
    `
}
