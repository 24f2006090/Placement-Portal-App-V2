export default{

    data(){

        return{

    driveId:null,

    drive:{},

    applicants:[],

    interviewForm:{

        application_id:null,

        interview_date:"",

        interview_time:"",

        interview_mode:"Online",

        interview_venue:""

    }

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

openInterviewForm(student){

    this.interviewForm.application_id = student.application_id

    this.interviewForm.interview_date = ""

    this.interviewForm.interview_time = ""

    this.interviewForm.interview_mode = "Online"

    this.interviewForm.interview_venue = ""

},

scheduleInterview(){

    fetch(

        `/api/application/${this.interviewForm.application_id}/schedule`,

        {

            method:"PUT",

            headers:{

                ...this.getHeaders(),

                "Content-Type":"application/json"

            },

            body:JSON.stringify(this.interviewForm)

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
    v-if="student.status=='selected'"
    class="badge bg-success">

        Selected

    </span>

    <span
    v-else-if="student.status=='shortlisted'"
    class="badge bg-info">

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
class="btn btn-primary btn-sm me-1"
@click="updateStatus(student.application_id,'shortlisted')"
:disabled="student.status=='shortlisted'">

Shortlist

</button>

<button
        class="btn btn-success btn-sm me-1"
        @click="updateStatus(student.application_id,'selected')"
        :disabled="student.status=='selected'">

            Select

    </button>

    <button

        v-if="student.status=='shortlisted'"

        class="btn btn-dark btn-sm"

        data-bs-toggle="modal"

        data-bs-target="#interviewModal"

        @click="openInterviewForm(student)">

        Schedule Interview

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

        <div
        class="modal fade"
        id="interviewModal"
        tabindex="-1">

        <div class="modal-dialog">

        <div class="modal-content">

        <div class="modal-header">

        <h5>

        Schedule Interview

        </h5>

        <button
        class="btn-close"
        data-bs-dismiss="modal">
        </button>

        </div>

        <div class="modal-body">

        <input
        type="date"
        class="form-control mb-2"
        v-model="interviewForm.interview_date">

        <input
        type="time"
        class="form-control mb-2"
        v-model="interviewForm.interview_time">

        <select
        class="form-control mb-2"
        v-model="interviewForm.interview_mode">

        <option>

        Online

        </option>

        <option>

        Offline

        </option>

        </select>

        <input
        class="form-control"
        placeholder="Venue / Google Meet Link"
        v-model="interviewForm.interview_venue">

        </div>

        <div class="modal-footer">

        <button
        class="btn btn-success"
        @click="scheduleInterview"
        data-bs-dismiss="modal">

        Save

        </button>

        </div>

        </div>

        </div>

        </div>

</div>

`

}