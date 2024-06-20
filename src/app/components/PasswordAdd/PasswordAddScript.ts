import mainService from "../../shared/services/mainService";
import { mapState } from 'vuex'

export default {
    name: "LogoAdd",
    components: {},
    computed: {
        ...mapState('authReducer', {
            auth: (state: any) => state.auth
        })
    },
    data() {
        return {
            error: "Password",
            edit: undefined,
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
            this.arrayPassword.splice(index, 1);
            this.error = "Password...";
            mainService.deletePassword(this.domain, index).then(
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
        },
        updateAuth(index: number) {
            this.edit = index;            
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
                this.edit = undefined
            }
        },
        async copy(value: string) {
            if (value.length >= 4) {
                await navigator.clipboard.writeText(value);
            }
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
                this.error = "Can't Get Any Password!";
            }
        );
    }
};