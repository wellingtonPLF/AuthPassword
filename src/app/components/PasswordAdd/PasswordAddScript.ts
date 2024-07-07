import mainService from "../../shared/services/mainService";
import { mapState } from 'vuex'
import DeleteHandler from "../DeleteHandler/DeleteHandler.vue";

export default {
    name: "LogoAdd",
    components: {
        DeleteHandler
    },
    computed: {
        ...mapState('authReducer', {
            auth: (state: any) => state.auth
        }),
    },
    data() {
        return {
            error: "Password",
            edit: undefined,
            deleting: false,
            choice: undefined,
            objIndex: undefined,
            domain: "",
            arrayPassword: []
        }
    },
    methods: {
        saveAuth(item: any) {
            this.edit = undefined;
            const index = this.arrayPassword.indexOf(item);
            
            if (item.ativo) {
                const data = item.nome + "\n" + item.password;
                this.error = "Password...";
                mainService.updatePassword(this.auth, this.domain, index, data).then(
                    it => {
                        if (it) {
                            this.error = "Password";
                        }
                        else {
                            this.error = "Update Error!";
                        }
                    }
                    ).catch((_) => {
                        this.error = "Update Error!";
                    }
                );
            }
            else {
                const data = item.nome + "\n" + item.password;
                this.error = "Password...";
                mainService.savePassword(this.auth, this.domain, data).then(
                    it => {
                        if (it) {
                            item.ativo = true;
                            this.error = "Password";
                        }
                        else {
                            this.error = "Password Error!";
                        }                        
                    }
                    ).catch((_) => {
                        this.error = "Password Error!";
                    }
                );
            }
        },
        excluirAuth(index: number) {
            this.objIndex = index,
            this.deleting = true;
            this.scrollToTop();
        },
        updateAuth(index: number) {
            this.edit = index;
            this.choice = { ...this.arrayPassword[index]}
        },
        addNewPassword() : void {
            this.arrayPassword.push(
                {
                    nome: '',
                    password: '',
                    ativo: false
                }
            )
            this.edit = this.arrayPassword.length - 1;
        },
        cancel(index: number) {
            if (this.arrayPassword[index].ativo == false) {
                this.arrayPassword.splice(index, 1);
            }
            else {
                this.arrayPassword[index] = this.choice
                this.edit = undefined
            }
        },
        async copy(value: string) {
            if (value.length >= 4) {
                await navigator.clipboard.writeText(value);
            }
        },
        deleteOption(value: boolean) {
            if (value) {
                this.arrayPassword.splice(this.objIndex, 1);
                this.error = "Password...";
                mainService.deletePassword(this.domain, this.objIndex).then(
                    it => {
                        if  (it) {
                            this.error = "Password";
                        }
                        else {
                            this.error = "Password Error!";
                        }
                        
                    }
                    ).catch((_) => {
                        this.error = "Password Error!";
                    }
                );
            }
            this.deleting = !this.deleting
        },
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    },
    mounted() {
        this.domain = this.$route.params.name;
        mainService.get_all_password(this.auth, this.domain).then(
            it => {
                this.arrayPassword = it.map((obj) => {
                    const item = obj.split("\n");
                    return { nome: item[0], password: item[1], ativo: true}
                });
            }
            ).catch((_) => {
                this.error = "Can't get any password!";
            }
        );
    }
};