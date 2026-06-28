export default {

    data(){

        return{

            applications:[],
            studentName:''

        }

    },

    mounted(){

        this.loadHistory()
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
        loadHistory(){

            fetch(
                '/api/student/applications',
                {
                    headers:this.getHeaders()
                }
            )

            .then(res=>res.json())
            .then(data=>{

                this.applications=data

            })

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

        }

    },

    template:`

    <div class="container mt-4">

        <div class="card">

            <div class="card-header d-flex justify-content-between">

                <h4>Student Name: {{studentName}}</h4>

                <router-link
                class="btn btn-secondary"
                to="/student">

                    Back

                </router-link>

            </div>

            <div class="card-body">

                <table class="table table-bordered">

                    <thead>

                        <tr>

                            <th>ID</th>
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
                                {{app.application_id}}
                            </td>

                            <td>
                                {{app.drive_name || app.drive_id}}
                            </td>

                            <td>
                                {{app.company_name}}
                            </td>

                           <td>

                                    <span
                                    v-if="app.status=='selected'"
                                    class="badge bg-success">

                                        Selected

                                    </span>

                                    <span
                                    v-else-if="app.status=='shortlisted'"
                                    class="badge bg-info">

                                        Shortlisted

                                    </span>

                                    <span
                                    v-else-if="app.status=='waiting'"
                                    class="badge bg-warning text-dark">

                                        Waiting

                                    </span>

                                    <span
                                    v-else-if="app.status=='rejected'"
                                    class="badge bg-danger">

                                        Rejected

                                    </span>

                                    <span
                                    v-else
                                    class="badge bg-primary">

                                        Applied

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