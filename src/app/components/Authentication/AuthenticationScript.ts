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
            const minimo = 5;
            if (this.username.length < minimo) {
                this.error = `username mínimo de ${minimo} caracteres`
            }
            else if (this.password.length < minimo) {
                this.error = `password mínimo de ${minimo} caracteres`
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
