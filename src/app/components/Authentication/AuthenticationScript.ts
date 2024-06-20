import mainService from "../../shared/services/mainService"
import { mapActions } from "vuex";

export default {
    name: "Authentication",
    components: {},
    data() {
        return {
            error: "",
            username: "",
            password: ""
        }
    },
    methods: {
        ...mapActions('authReducer', ['setAuth']),
        authenticate() {
            mainService.authenticate(this.username, this.password).then(
                it => {
                    if (it) {
                        this.error = ""
                        this.setAuth(this.password + this.username)
                        this.$router.push('/credentials');
                    }
                    else {
                        this.error = "Not valid!"
                    }
                }
                ).catch((e) => {
                    console.error("Error at Authentication");
                }
            );
        }
    }
};
