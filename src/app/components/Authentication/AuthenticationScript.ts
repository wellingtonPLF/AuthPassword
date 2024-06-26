import mainService from "../../shared/services/mainService"
import { mapActions } from "vuex";

export default {
    name: "Authentication",
    components: {},
    data() {
        return {
            error: "",
            registry: true,
            username: "",
            password: ""
        }
    },
    methods: {
        ...mapActions('authReducer', ['setAuth']),
        handleInput(event: any) {
            this.typedText = event.target.value;
            if (this.error != "") {
                this.error = ""
            }
        },
        runState(value: boolean) {
            if (value) {
                this.error = ""
                this.setAuth(this.password + "\n" + this.username)
                this.$router.push('/credentials');
            }
            else {
                this.error = "Error on Registry!"
            }
        },
        registrar() {
            const userLength = this.username.length;
            const bits = 31;
            const condition = bits - userLength;
            if (userLength < 13) {
                this.error = `username mínimo de 13 caracteres`
            }
            else if (this.password.length < condition) {
                this.error = `password mínimo de ${condition} caracteres`
            }
            else {
                mainService.registry(this.username, this.password).then(
                    it => {
                        this.runState(it)
                    }
                    ).catch( _ => {
                        this.error = "Error on Registry!"
                    }
                );
            }
        },
        authenticate() {
            mainService.authenticate(this.username, this.password).then(
                it => {
                    this.runState(it)
                }
                ).catch( _ => {
                    this.error = "Not valid!"
                }
            );
        }
    },
    mounted() {
        mainService.check_auth().then(
            it => {
                this.registry = it;
            }
            ).catch( _ => {
                this.error = "Error on check!"
            }
        );
    }
};
