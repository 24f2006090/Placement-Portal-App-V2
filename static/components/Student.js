export default {

    data(){

        return{

            drives:[],
            applications:[],
            stats:{
                drives:0,
                applications:0
            }

        }

    },
    computed:{

    appliedDriveIds(){

        return this.applications.map(
            app => app.drive_id
        )

    }

},

    mounted(){

        this.loadDrives()
        this.loadApplications()

    },

    methods:{

        getHeaders(){

            return{

                'Authorization-token':
                localStorage.getItem(
                    'auth_token'
                )

            }

        },

        loadDrives(){

            fetch(
                '/api/student/drives',
                {
                    headers:this.getHeaders()
                }
            )

            .then(res=>res.json())
            .then(data=>{

                this.drives=data
                this.stats.drives=data.length

            })

        },

        loadApplications(){

            fetch(
                '/api/student/applications',
                {
                    headers:this.getHeaders()
                }
            )

            .then(res=>res.json())
            .then(data=>{

                this.applications=data
                this.stats.applications=data.length

            })

        },

        applyDrive(id){

            fetch(
                `/api/apply/${id}`,
                {
                    method:'POST',
                    headers:this.getHeaders()
                }
            )

            .then(res=>res.json())
            .then(data=>{

                alert(data.message)

                this.loadApplications()

            })

        },

        logout(){

            localStorage.clear()

            this.$router.push('/login')

        }

    },

    template:`

    <div class="container mt-4">

        <div class="d-flex justify-content-between align-items-center">

            <h2>
                Student Dashboard
            </h2>

            <div>

                <router-link
                class="btn btn-primary me-2"
                to="/student/history">

                    History

                </router-link>

                <button
                class="btn btn-danger"
                @click="logout">

                    Logout

                </button>

            </div>

        </div>

        <div class="row mt-4">

            <div class="col-md-6">

                <div class="card text-center">

                    <div class="card-body">

                        <h5>
                            Available Drives
                        </h5>

                        <h3>
                            {{stats.drives}}
                        </h3>

                    </div>

                </div>

            </div>

            <div class="col-md-6">

                <div class="card text-center">

                    <div class="card-body">

                        <h5>
                            My Applications
                        </h5>

                        <h3>
                            {{stats.applications}}
                        </h3>

                    </div>

                </div>

            </div>

        </div>

        <div class="card mt-4">

            <div class="card-header">

                Available Drives

            </div>

            <div class="card-body">

                <table class="table table-bordered">

                    <thead>

                        <tr>

                            <th>Job Title</th>
                            <th>Branch</th>
                            <th>CGPA</th>
                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr
                        v-for="drive in drives"
                        :key="drive.id">

                            <td>
                                {{drive.job_title}}
                            </td>

                            <td>
                                {{drive.elig_branch}}
                            </td>

                            <td>
                                {{drive.min_cgpa}}
                            </td>

                            <td>

                                <button
                                    v-if="!appliedDriveIds.includes(drive.id)"
                                    class="btn btn-success btn-sm"
                                    @click="applyDrive(drive.id)">

                                        Apply

                                    </button>

                                    <button
                                    v-else
                                    class="btn btn-secondary btn-sm"
                                    disabled>

                                        Applied

                                    </button>

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

        <div class="card mt-4">

            <div class="card-header">

                My Applications

            </div>

            <div class="card-body">

                <table class="table table-bordered">

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Drive</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr
                        v-for="app in applications"
                        :key="app.application_id">

                            <td>
                                {{app.application_id}}
                            </td>

                            <td>
                                {{app.drive_id}}
                            </td>

                            <td>
                                {{app.status}}
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    </div>

    `
}