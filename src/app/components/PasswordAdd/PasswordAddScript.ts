import passwordService from "../../shared/services/passwordService";


export default {
    name: "LogoAdd",
    components: {},
    data() {
        return {
            xxx: 'None',
            edit: undefined,
            arrayPassword: [
                {
                    id: 1,
                    nome: 'wellplf@gmail.com',
                    password: '12345',
                    ativo: true
                }
            ]
        }
    },
    methods: {
        addNewPassword(index: number) : void {
            this.arrayPassword.push(
                {
                    nome: '',
                    password: '',
                    ativo: false
                }
            )
            this.edit = this.arrayPassword.length - 1;
        },
        saveAuth(item: any) {
            this.edit = undefined;
            
            if (item.ativo) {    
                passwordService.updatePassword(item).then(
                    it => {
                        this.xxx = it;
                    }
                    ).catch((e) => {
                        this.xxx = 'ERROR';
                        console.error("Error at UpdatePassword");
                    }
                );
            }
            else {
                passwordService.savePassword(item).then(
                    it => {
                        item.ativo = true;
                        this.xxx = it;
                        // item.id = it.id;
                    }
                    ).catch((e) => {
                        this.xxx = 'ERROR';
                        console.error("Error at SavePassword");
                    }
                );
            }
        },
        updateAuth(index: number) {
            this.edit = index;            
        },
        cancel(index: number) {
            if (this.arrayPassword[index].ativo == false) {
                this.arrayPassword.splice(index, 1);
            }
            else {
                this.edit = undefined
            }
        },
        excluirAuth(index: number) {
            const obj = this.arrayPassword[index];
            this.arrayPassword.splice(index, 1);
            passwordService.deletePassword(obj.id).then(
                it => {
                    this.xxx = it;
                }
                ).catch((_) => {
                    this.xxx = 'ERROR';
                    console.error("Error at DeletePassword");
                }
            );
        },
        async copy(value: string) {
            if (value.length >= 4) {
                await navigator.clipboard.writeText(value);
            }
        }
    }
};


// methods: {
//     addNewPassword() : void {
//         this.arrayPassword.push(
//             {
//                 nome: '',
//                 password: '',
//                 ativo: false
//             }
//         )
//         this.edit = this.arrayPassword.length - 1;
//     },
//     saveAuth(item: any) {
//         this.edit = undefined;
        
//         if (item.ativo) {    
//             passwordService.updatePassword(item).then(_ => {}).catch((_) => {});
//         }
//         else {
//             passwordService.savePassword(item).then(
//                 it => {
//                     item.ativo = true;
//                     item.id = it.id;
//             }).catch((_) => {});
//         }
//     },
//     updateAuth(index: number) {
//         this.edit = index;            
//     },
//     cancel(index: number) {
//         if (this.arrayPassword[index].ativo == false) {
//             this.arrayPassword.splice(index, 1);
//         }
//         else {
//             this.edit = undefined
//         }
//     },
//     excluirAuth(index: number) {
//         this.arrayPassword.splice(index, 1);
//         const obj = this.arrayPassword[index];
//         passwordService.deletePassword(obj.id).then(_ => {}).catch((_) => {});
//     },
//     async copy(value: string) {
//         if (value.length >= 4) {
//             await navigator.clipboard.writeText(value);
//         }
//     }
// }