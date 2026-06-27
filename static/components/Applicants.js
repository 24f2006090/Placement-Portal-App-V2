export default{

    data(){

        return{

            driveId:null,
            drive:{},
            applicants:[]

        }

    },

    mounted(){

        this.driveId = this.$route.params.id
        this.loadDriveDetails()
        this.loadApplicants()

    },

    methods:{

        getHeaders(){

            return{

                "Authorization-token":
                localStorage.getItem("auth_token")

            }

        },

        loadApplicants(){

            fetch(

                `/api/drive/${this.driveId}/applicants`,

                {

                    headers:this.getHeaders()

                }

            )

            .then(res=>res.json())

            .then(data=>{

                this.applicants=data

            })

        },
        loadDriveDetails(){

    fetch(

        `/api/drive/${this.driveId}`,

        {

            headers:this.getHeaders()

        }

    )

    .then(res=>res.json())

    .then(data=>{

        this.drive = data

    })

},
        updateStatus(id,status){

    fetch(

        `/api/application/${id}/status`,

        {

            method:"PUT",

            headers:{

                ...this.getHeaders(),

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                status:status

            })

        }

    )

    .then(res=>res.json())

    .then(data=>{

        alert(data.message)

        this.loadApplicants()

    })

},
    viewResume(resume){

    if(!resume){

        alert("Resume not uploaded")

        return

    }

    window.open(resume,"_blank")

},

    },

    template:`
    <div class="container mt-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <div>

    <h3>

        Applicants - {{drive.job_title}}

    </h3>

    <p class="text-muted">

        {{drive.description}}

    </p>

</div>

        <button
        class="btn btn-secondary"
        @click="$router.push('/company')">

            Back

        </button>
    </div>

    

<table class="table table-bordered">

<thead>

<tr>

<th>Name</th>
<th>Branch</th>
<th>Year</th>
<th>CGPA</th>
<th>Status</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

<tr

v-for="student in applicants"

:key="student.application_id">

<td>{{student.name}}</td>

<td>{{student.branch}}</td>

<td>{{student.year}}</td>

<td>{{student.cgpa}}</td>

<td>

    <span
    v-if="student.status=='shortlisted'"
    class="badge bg-success">

        Shortlisted

    </span>

    <span
    v-else-if="student.status=='waiting'"
    class="badge bg-warning text-dark">

        Waiting

    </span>

    <span
    v-else-if="student.status=='rejected'"
    class="badge bg-danger">

        Rejected

    </span>

    <span
    v-else
    class="badge bg-primary">

        Applied

    </span>

</td>

<td>

    <button
class="btn btn-success btn-sm me-1"
@click="updateStatus(student.application_id,'shortlisted')"
:disabled="student.status=='shortlisted'">

Shortlist

</button>

    <button
    class="btn btn-warning btn-sm me-1"
    @click="updateStatus(student.application_id,'waiting')"
    :disabled="student.status=='waiting'">

        Waiting

    </button>

    <button
    class="btn btn-danger btn-sm me-1"
    @click="updateStatus(student.application_id,'rejected')"
    :disabled="student.status=='rejected'">

        Reject

    </button>

    <button
    class="btn btn-info btn-sm"
    @click="viewResume(student.resume)">

        View Resume

    </button>

</td>

</tr>

</tbody>

</table>

</div>

`

}