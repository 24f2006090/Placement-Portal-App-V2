export default {

    data() {

        return {

            form: {

                username: "",
                email: "",
                password: "",
                branch: "",
                cgpa: "",
                year: ""

            }

        }

    },

    methods: {

        register() {

            fetch(

                "/api/register/student",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify(this.form)

                }

            )

            .then(res => res.json())

            .then(data => {

                alert(data.message)

                if (data.message == "Student created successfully") {

                    this.$router.push("/login")

                }

            })

        }

    },

    template: `

<div class="container mt-5">

<div class="row justify-content-center">

<div class="col-md-6">

<div class="card shadow">

<div class="card-header bg-primary text-white">

<h3 class="text-center">

Student Registration

</h3>

</div>

<div class="card-body">

<input
class="form-control mb-3"
placeholder="Username"
v-model="form.username">

<input
type="email"
class="form-control mb-3"
placeholder="Email"
v-model="form.email">

<input
type="password"
class="form-control mb-3"
placeholder="Password"
v-model="form.password">

<input
class="form-control mb-3"
placeholder="Branch"
v-model="form.branch">

<input
class="form-control mb-3"
placeholder="CGPA"
v-model="form.cgpa">

<input
class="form-control mb-3"
placeholder="Year"
v-model="form.year">

<button
class="btn btn-primary w-100"
@click="register">

Register

</button>

<div class="text-center mt-3">

<router-link to="/login">

Already have an account?

</router-link>

</div>

</div>

</div>

</div>

</div>

</div>

`

}