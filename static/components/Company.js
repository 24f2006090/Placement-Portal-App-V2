
export default {

    data() {

        return {

            drives: [],
            applicants: [],

            stats: {
                drives: 0,
                applicants: 0
            },

            driveForm: {
                job_title: "",
                description: "",
                min_cgpa: "",
                elig_branch: "",
                elig_year: ""
            }

        }

    },

    mounted() {

        this.loadDrives()

    },

    methods: {

        getHeaders() {

            return {
                "Authorization-token": localStorage.getItem("auth_token"),
                "Content-Type": "application/json"
            }

        },

        loadDrives() {

            fetch("/api/company/drives", {
                headers: this.getHeaders()
            })

            .then(res => res.json())

            .then(data => {

                this.drives = data
                this.stats.drives = data.length

            })

        },

        createDrive() {

            fetch("/api/drive/create", {

                method: "POST",

                headers: this.getHeaders(),

                body: JSON.stringify(this.driveForm)

            })

            .then(res => res.json())

            .then(data => {

                alert(data.message)

                this.driveForm = {

                    job_title: "",
                    description: "",
                    min_cgpa: "",
                    elig_branch: "",
                    elig_year: ""

                }

                this.loadDrives()

            })

        },

        deleteDrive(id) {

            if (!confirm("Delete this drive?")) {
                return
            }

            fetch(`/api/drive/${id}/delete`, {

                method: "DELETE",

                headers: this.getHeaders()

            })

            .then(res => res.json())

            .then(data => {

                alert(data.message)

                this.loadDrives()

            })

        },

        viewApplicants(id){

        this.$router.push(
            `/company/drive/${id}/applicants`
        )

    },
        updateStatus(id,status){

    fetch(

        `/api/application/${id}/status`,

        {

            method:"PUT",

            headers:this.getHeaders(),

            body:JSON.stringify({

                status:status

            })

        }

    )

    .then(res=>res.json())

    .then(data=>{

        alert(data.message)

    })

},

        logout() {

            localStorage.clear()

            this.$router.push("/login")

        }

    },

    template: `

<div class="container mt-4">

    <div class="d-flex justify-content-between align-items-center">

        <h2>

            Company Dashboard

        </h2>

        <div>

            <router-link
            class="btn btn-warning me-2"
            to="/company/profile">

                Edit Profile

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

            <div class="card text-center shadow-sm">

                <div class="card-body">

                    <h5>Total Drives</h5>

                    <h3>{{stats.drives}}</h3>

                </div>

            </div>

        </div>

        <div class="col-md-6">

            <div class="card text-center shadow-sm">

                <div class="card-body">

                    <h5>Total Applicants</h5>

                    <h3>{{stats.applicants}}</h3>

                </div>

            </div>

        </div>

    </div>

    <div class="card mt-4 shadow-sm">

        <div class="card-header">

            <h5 class="mb-0">

                Create Placement Drive

            </h5>

        </div>

        <div class="card-body">

            <input
            class="form-control mb-2"
            placeholder="Job Title"
            v-model="driveForm.job_title">

            <textarea
            class="form-control mb-2"
            placeholder="Description"
            v-model="driveForm.description">
            </textarea>

            <input
            class="form-control mb-2"
            placeholder="Minimum CGPA"
            v-model="driveForm.min_cgpa">

            <input
            class="form-control mb-2"
            placeholder="Eligible Branch"
            v-model="driveForm.elig_branch">

            <input
            class="form-control mb-3"
            placeholder="Eligible Year"
            v-model="driveForm.elig_year">

            <button
            class="btn btn-success"
            @click="createDrive">

                Create Drive

            </button>

        </div>

    </div>

    <div class="card mt-4 shadow-sm">

        <div class="card-header">

            <h5 class="mb-0">

                My Placement Drives

            </h5>

        </div>

        <div class="card-body">

            <table class="table table-bordered table-hover align-middle">

                <thead class="table-light">

                    <tr>

                        <th>Job Title</th>
                        <th>Status</th>
                        <th>Applicants</th>
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

                            <span
                            v-if="drive.status=='approved'"
                            class="badge bg-success">

                                Approved

                            </span>

                            <span
                            v-else-if="drive.status=='pending'"
                            class="badge bg-warning text-dark">

                                Pending

                            </span>

                            <span
                            v-else-if="drive.status=='completed'"
                            class="badge bg-primary">

                                Completed

                            </span>

                            <span
                            v-else-if="drive.status=='cancelled'"
                            class="badge bg-danger">

                                Cancelled

                            </span>

                            <span
                            v-else>

                                {{drive.status}}

                            </span>

                        </td>

                        <td>

                            <button
                            class="btn btn-info btn-sm"
                            @click="viewApplicants(drive.id)">

                                View Applicants

                            </button>

                        </td>

                        <td>

                            <button
                            class="btn btn-danger btn-sm"
                            @click="deleteDrive(drive.id)">

                                Delete

                            </button>

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>

</div>

`
}

