export default {
    data() {
        return {
            form: {
                name: "",
                branch: "",
                cgpa: "",
                year: "",
                phone: ""
            }
        };
    },

    mounted() {
        this.loadProfile();
    },

    methods: {
        getHeaders() {
            return {
                "Authorization-token": localStorage.getItem("auth_token"),
                "Content-Type": "application/json"
            };
        },

        loadProfile() {
            fetch("/api/student/profile", {
                headers: this.getHeaders()
            })
                .then(res => res.json())
                .then(data => {
                    this.form = data;
                });
        },

        saveProfile() {
            fetch("/api/student/profile", {
                method: "PUT",
                headers: this.getHeaders(),
                body: JSON.stringify(this.form)
            })
                .then(res => res.json())
                .then(data => {
                    alert(data.message);
                    this.$router.push("/student");
                });
        }
    },

    template: `
        <div class="container mt-4">
            <div class="card">
                <div class="card-header">
                    <h4>Edit Profile</h4>
                </div>

                <div class="card-body">
                    <label>Name</label>
                    <input
                        class="form-control mb-3"
                        v-model="form.name"
                    >

                    <label>Branch</label>
                    <input
                        class="form-control mb-3"
                        v-model="form.branch"
                    >

                    <label>CGPA</label>
                    <input
                        class="form-control mb-3"
                        v-model="form.cgpa"
                    >

                    <label>Year</label>
                    <input
                        class="form-control mb-3"
                        v-model="form.year"
                    >

                    <label>Phone</label>
                    <input
                        class="form-control mb-3"
                        v-model="form.phone"
                    >

                    <button
                        class="btn btn-success me-2"
                        @click="saveProfile"
                    >
                        Save Changes
                    </button>

                    <button
                        class="btn btn-secondary"
                        @click="$router.push('/student')"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `
}