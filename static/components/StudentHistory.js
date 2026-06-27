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
                                class="badge bg-success"
                                v-if="app.status=='applied'">

                                    Applied

                                </span>

                                <span
                                class="badge bg-danger"
                                v-else-if="app.status=='cancelled'">

                                    Cancelled

                                </span>

                                <span
                                class="badge bg-warning"
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