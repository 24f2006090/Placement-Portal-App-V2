export default {

    data(){
        return{
            form:{
                company_name:"",
                website:""
            }
        }
    },
    mounted(){
        this.loadProfile()
    },
    methods:{
        getHeaders(){
            return{
                "Authorization-token":
                localStorage.getItem("auth_token"),
                "Content-Type":"application/json"
            }

        },
        loadProfile(){
            fetch(
                "/api/company/profile",
                {
                    headers:this.getHeaders()
                }
            )
            .then(res=>res.json())
            .then(data=>{
                this.form=data
            })
        },
        saveProfile(){
            fetch(
                "/api/company/profile",
                {
                    method:"PUT",
                    headers:this.getHeaders(),
                    body:JSON.stringify(this.form)
                }
            )
            .then(res=>res.json())
            .then(data=>{
                alert(data.message)
                this.$router.push("/company")
            })
        }

    },

    template:`
    <div class="container mt-4">
        <div class="card">
            <div class="card-header">
                <h4>Edit Company Profile</h4>
            </div>
            <div class="card-body">
                <label>Company Name</label>
                <input class="form-control mb-3" v-model="form.company_name">
                <label>Website</label>
                <input class="form-control mb-3" v-model="form.website">
                <button
                    class="btn btn-success me-2"
                    @click="saveProfile">
                        Save Changes
                </button>
                <button
                    class="btn btn-secondary"
                    @click="$router.push('/company')">
                        Cancel
                </button>
            </div>
        </div>
    </div>
    `
    }
