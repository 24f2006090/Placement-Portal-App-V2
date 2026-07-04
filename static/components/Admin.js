export default {

    data() {
        return {
            stats: {},
            companies: [],
            drives: [],
            applications: [],
            students: [],

            studentSearch:'',
            driveSearch:'',
            statistics:{
                students:0,
                companies:0,
                drives:0,
                applications:0,
                selected:0,
                shortlisted:0,
                rejected:0,
                waiting:0
            },
    }
},
   computed:{

    approvedCompanies(){
        return this.companies.filter(
            c => c.status === 'approved'
        )
    },

    pendingCompanies(){
        return this.companies.filter(
            c => c.status === 'pending'
        )
    },

    activeDrives(){

    return this.drives.filter(
        d => d.status === 'approved'
    )
},
pendingDrives(){

    return this.drives.filter(
        d => d.status === 'pending'
    )

}

},

    mounted() {
        this.loadDashboard()
        this.loadCompanies()
        this.loadDrives()
        this.loadApplications()
        this.loadStudents()
        this.loadStatistics()
    },
methods: {

    getHeaders() {
        return {
            'Authorization-token':
            localStorage.getItem('auth_token')
        }
    },
    loadDashboard() {

    fetch('/api/admin/dashboard',{
        headers:this.getHeaders()
    })
    .then(res=>res.json())
    .then(data=>{
        this.stats = data
    })
},

    loadCompanies() {

        fetch('/api/companies',{
            headers:this.getHeaders()
        })
        .then(res=>res.json())
        .then(data=>{
            this.companies = data
        })
    },

    loadDrives() {

        fetch('/api/drives',{
            headers:this.getHeaders()
        })
        .then(res=>res.json())
        .then(data=>{
            this.drives = data
        })
    },

    loadApplications() {

        fetch('/api/admin/applications',{
            headers:this.getHeaders()
        })
        .then(res=>res.json())
        .then(data=>{
            this.applications = data
        })
    },

    loadStudents() {

        fetch('/api/students',{
            headers:this.getHeaders()
        })
        .then(res=>res.json())
        .then(data=>{
            this.students = data
        })
    },
    loadStatistics(){

    fetch(

        "/api/admin/statistics",

        {

            headers:this.getHeaders()

        }

    )

    .then(res=>res.json())

    .then(data=>{

        this.statistics=data

    })

},

    approveCompany(id){

        fetch(`/api/company/${id}/approve`,{
            method:'PUT',
            headers:this.getHeaders()
        })
        .then(res=>res.json())
        .then(data=>{

            alert(data.message)

            this.loadCompanies()
            this.loadDashboard()

        })
    },

    approveDrive(id){

        fetch(`/api/drive/${id}/approve`,{
            method:'PUT',
            headers:this.getHeaders()
        })
        .then(res=>res.json())
        .then(data=>{

            alert(data.message)

            this.loadDrives()

        })
    },

    searchStudents(){

        fetch(
            `/api/search/students?branch=${this.studentSearch}`,
            {
                headers:this.getHeaders()
            }
        )
        .then(res=>res.json())
        .then(data=>{
            this.students = data
        })
    },

    searchDrives(){

        fetch(
            `/api/search/drives?title=${this.driveSearch}`,
            {
                headers:this.getHeaders()
            }
        )
        .then(res=>res.json())
        .then(data=>{
            this.drives = data
        })
    },

    blacklistCompany(id){

        fetch(`/api/company/${id}/blacklist`,{
            method:'PUT',
            headers:this.getHeaders()
        })
        .then(res=>res.json())
        .then(data=>{

            alert(data.message)

            this.loadCompanies()
            this.loadDrives()
            this.loadApplications()
            this.loadDashboard()

        })
    },

    blacklistStudent(id){

        fetch(`/api/student/${id}/blacklist`,{
            method:'PUT',
            headers:this.getHeaders()
        })
        .then(res=>res.json())
        .then(data=>{

            alert(data.message)

            this.loadStudents()
            this.loadApplications()
            this.loadDashboard()

        })
    },

    viewDrive(id){

        fetch(`/api/drive/${id}`,{
            headers:this.getHeaders()
        })
        .then(res=>res.json())
        .then(data=>{

            alert(
                "Job Title : " + data.job_title +
                "\nDescription : " + data.description +
                "\nMin CGPA : " + data.min_cgpa +
                "\nBranch : " + data.elig_branch +
                "\nYear : " + data.elig_year
            )

        })
    },

    completeDrive(id){

        fetch(`/api/drive/${id}/complete`,{
            method:'PUT',
            headers:this.getHeaders()
        })
        .then(res=>res.json())
        .then(data=>{

            alert(data.message)

            this.loadDrives()
            this.loadDashboard()

        })
    },

    viewApplication(id){

        fetch(`/api/application/${id}`,{
            headers:this.getHeaders()
        })
        .then(res=>res.json())
        .then(data=>{

            alert(
                "Student ID : " + data.student_id +
                "\nBranch : " + data.branch +
                "\nCGPA : " + data.cgpa +
                "\nStatus : " + data.status
            )

        })
    }

},
   template:`

<div class="container mt-4">

    <h2 class="mb-4">
        Welcome Admin
    </h2>

    <div class="row mb-4">

    <div class="col-md-4">

        <input
        class="form-control"
        placeholder="Search Student Branch"
        v-model="studentSearch">

    </div>

    <div class="col-md-2">

        <button
        class="btn btn-primary w-100"
        @click="searchStudents">

            Search Student

        </button>

    </div>

    <div class="col-md-4">

        <input
        class="form-control"
        placeholder="Search Drive Title"
        v-model="driveSearch">

    </div>

    <div class="col-md-2">

        <button
        class="btn btn-success w-100"
        @click="searchDrives">

            Search Drive

        </button>

    </div>

</div>


    <div class="row">

        <div class="col-md-3 mb-3">
            <div class="card text-center">
                <div class="card-body">
                    <h6>Students</h6>
                    <h3>{{stats.students}}</h3>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card text-center">
                <div class="card-body">
                    <h6>Companies</h6>
                    <h3>{{stats.companies}}</h3>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card text-center">
                <div class="card-body">
                    <h6>Drives</h6>
                    <h3>{{stats.drives}}</h3>
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
            <div class="card text-center">
                <div class="card-body">
                    <h6>Applications</h6>
                    <h3>{{stats.applications}}</h3>
                </div>
            </div>
        </div>

    </div>

    <div class="card">

    <div class="row mt-4">

    <div class="col-md-3">

    <div class="card text-center border-success">

    <div class="card-body">

    <h6>Selected</h6>

    <h3 class="text-success">

    {{statistics.selected}}

    </h3>

    </div>

    </div>

    </div>

    <div class="col-md-3">

    <div class="card text-center border-primary">

    <div class="card-body">

    <h6>Shortlisted</h6>

    <h3 class="text-primary">

    {{statistics.shortlisted}}

    </h3>

    </div>

    </div>

    </div>

    <div class="col-md-3">

    <div class="card text-center border-warning">

    <div class="card-body">

    <h6>Waiting</h6>

    <h3 class="text-warning">

    {{statistics.waiting}}

    </h3>

    </div>

    </div>

    </div>

<div class="col-md-3">

<div class="card text-center border-danger">

<div class="card-body">

<h6>Rejected</h6>

<h3 class="text-danger">

{{statistics.rejected}}

</h3>

</div>

</div>

</div>

</div>

        <div class="card-body">

            <!-- Registered Companies -->

            <h5>Registered Companies</h5>

            <table class="table table-bordered">

                <tbody>

                    <tr
                    v-for="company in approvedCompanies"
                    :key="company.id">

                        <td>{{company.company_name}}</td>

                        <td width="150">

                            <button
                                class="btn btn-danger btn-sm"
                                @click="blacklistCompany(company.id)">
                                    Blacklist
                                </button>

                        </td>

                    </tr>

                </tbody>

            </table>


            <h5 class="mt-4">
                Registered Students
            </h5>

            <table class="table table-bordered">

                <tbody>

                    <tr
                    v-for="student in students"
                    :key="student.id">

                        <td>
                            {{student.name || ('Student ' + student.id)}}
                        </td>

                        <td width="150">

                            <button
                                class="btn btn-danger btn-sm"
                                @click="blacklistStudent(student.id)">
                                    Blacklist
                                </button>

                        </td>

                    </tr>

                </tbody>

            </table>
<!-- Pending Company Approval -->

<h5 class="mt-4">

    Company Approval

</h5>

<table class="table table-bordered">

    <thead>

        <tr>
            <th>Company</th>
            <th>Action</th>
        </tr>  
    </thead>

    <tbody>

        <tr
        v-for="company in pendingCompanies"
        :key="company.id">

            <td>{{company.company_name}}</td>

            <td width="150">

                <button
                class="btn btn-success btn-sm"
                @click="approveCompany(company.id)">

                    Approve

                </button>

            </td>

        </tr>

    </tbody>

</table>


<h5 class="mt-4">

    Placement Drive Approval

</h5>

<table class="table table-bordered">
    
        <thead>

            <tr>
                <th>Company</th>
                <th>Drive Title</th>
                <th>Action</th>
            </tr>
        </thead>

        <tbody>
        <tr
        v-for="drive in pendingDrives"
        :key="drive.id">

            <td>{{drive.company_name}}</td>

            <td>{{drive.job_title}}</td>

            <td width="150">

                <button
                class="btn btn-success btn-sm"
                @click="approveDrive(drive.id)">

                    Approve

                </button>

            </td>

        </tr>

    </tbody>

</table>


            <h5 class="mt-4">
                Ongoing Drives
            </h5>

            <table class="table table-bordered">

                <thead>

                    <tr>
                        <th>Sr No.</th>
                        <th>Drive Name</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

                    <tr
                    v-for="drive in activeDrives"
                    :key="drive.id">

                        <td>{{drive.id}}</td>

                        <td>{{drive.job_title}}</td>

                        <td>

                            <button
                                class="btn btn-primary btn-sm me-2"
                                @click="viewDrive(drive.id)">
                                    View Details
                                </button>

                            <button
                                class="btn btn-success btn-sm"
                                @click="completeDrive(drive.id)">
                                    Mark Complete
                                </button>

                        </td>

                    </tr>

                </tbody>

            </table>


            <!-- Student Applications -->

            <h5 class="mt-4">
                Student Applications
            </h5>

            <table class="table table-bordered">

                <thead>

                    <tr>
                        <th>Sr No.</th>
                        <th>Student</th>
                        <th>Drive</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    <tr
                    v-for="app in applications"
                    :key="app.application_id">

                        <td>{{app.application_id}}</td>

                        <td>{{app.student_name}}</td>

                        <td>{{app.drive_name}}</td>

                        <td>{{app.status}}</td>

                        <td>

                            <button
                                class="btn btn-info btn-sm"
                                @click="viewApplication(app.application_id)">
                                    View
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