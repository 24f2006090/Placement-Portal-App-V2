export default {
    template: `
    <div class="container mt-5">

        <div class="row justify-content-center">

            <div class="col-md-5">

                <div class="card">

                    <div class="card-header bg-primary text-white text-center">
                        <h4 class="mb-0">Login</h4>
                    </div>

                    <div class="card-body">

                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input
                                type="email"
                                class="form-control"
                                placeholder="Enter Email"
                                v-model="formData.email">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Password</label>
                            <input
                                type="password"
                                class="form-control"
                                placeholder="Enter Password"
                                v-model="formData.password">
                        </div>

                        <button class="btn btn-primary w-100" @click="login">
                            Login
                        </button>

                        <div class="text-center mt-3">
                            New User?
                            <router-link to="/register">
                                Register Here
                            </router-link>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>
    `,
    data:function(){
    return {
        formData:{
            email:'',
            password:''
        }
    }
},

methods:{

    login:function(){

        fetch('/api/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(this.formData)
        })

        .then(async res => {

            const data = await res.json()

            console.log("STATUS:", res.status)
            console.log("DATA:", data)

            if(res.status !== 200){
                alert(data.message)
                return
            }

            localStorage.setItem(
                "auth_token",
                data.auth_token
            )

            localStorage.setItem(
                "role",
                data.role
            )

            console.log(
                "TOKEN SAVED:",
                localStorage.getItem("auth_token")
            )

            console.log(
                "ROLE SAVED:",
                localStorage.getItem("role")
            )

            if(data.role === "admin"){
                this.$router.push('/admin')
            }

            else if(data.role === "student"){
                this.$router.push('/student')
            }

            else{
                this.$router.push('/company')
            }

        })

        .catch(error => {

            console.log(error)
            alert("Something went wrong")

        })

    }

}
}