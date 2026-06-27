export default {

    data(){

        return{

            drives:[],
            applications:[],
            stats:{
                drives:0,
                applications:0
            },
            studentName:'',
            resume:null

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
        this.loadProfile()

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
        viewDrive(id){

            const drive = this.drives.find(
                d => d.id === id
            )

            alert(
                "Job Title: " + drive.job_title +
                "\nDescription: " + drive.description +
                "\nCompany: " + drive.company_name +
                "\nBranch: " + drive.elig_branch +
                "\nCGPA: " + drive.min_cgpa
            )

        },
        loadProfile(){

            fetch(
                '/api/student/profile',
                {
                    headers:this.getHeaders()
                }
            )

            .then(res=>res.json())
            .then(data=>{

                this.studentName = data.name

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
        selectResume(event){
            this.resume = event.target.files[0]

        },
        uploadResume(){

    if(!this.resume){

        alert("Please select a PDF")

        return

    }

    const formData = new FormData()

    formData.append(
        "resume",
        this.resume
    )

    fetch(

        "/api/student/upload_resume",

        {

            method:"POST",

            headers:{
                "Authorization-token":
                localStorage.getItem("auth_token")
            },

            body:formData

        }

    )

    .then(res=>res.json())

    .then(data=>{

        alert(data.message)

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
                Welcome {{studentName}}
            </h2>

            <div>
                <router-link
                    class="btn btn-warning me-2"
                    to="/student/profile">

                        Edit Profile

                </router-link>

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

         <div class="card mt-4">

    <div class="card-header">

        Resume

    </div>

    <div class="card-body">

        <input
        type="file"
        class="form-control mb-3"
        @change="selectResume">

        <button
        class="btn btn-primary"
        @click="uploadResume">

            Upload Resume

        </button>

    </div>

</div>

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
                                class="btn btn-info btn-sm me-2"
                                @click="viewDrive(drive.id)">
                                    View
                                </button>

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

                            <th>Drive</th>
                            <th>Company</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr
                        v-for="app in applications"
                        :key="app.application_id">

                            <td>
                                {{app.drive_name || app.drive_id}}
                            </td>
                            
                            <td>
                                {{app.company_name}}
                            </td>

                            <td>

                            <span
                            v-if="app.status=='applied'"
                            class="badge bg-success">

                            Applied

                            </span>

                            <span
                            v-else-if="app.status=='rejected'"
                            class="badge bg-danger">

                            Rejected

                            </span>

                            <span
                            v-else-if="app.status=='Shortlisted'"
                            class="badge bg-primary">

                            Shortlisted

                            </span>

                             <span
                            v-else-if="app.status=='waiting'"
                            class="badge bg-warning text-dark">

                            Waiting

                            </span>

                            <span
                            v-else>

                            {{app.status}}

                            </span>

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    </div>

    `
}