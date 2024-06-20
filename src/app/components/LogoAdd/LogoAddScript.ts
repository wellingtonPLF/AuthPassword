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
            addAuthentication: false,
            myinput: '',
            arrayAuth: ['gmail.com.br', 'crunchyroll.com.br']
        }
    },
    methods: {
        changeAddState(){
            this.myinput = '';
            this.addAuthentication = !this.addAuthentication;
        },
        saveAuth() {
            this.arrayAuth.push(this.myinput);
            this.changeAddState();
        }
    }
};
