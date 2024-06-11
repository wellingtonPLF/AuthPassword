
export default {
    name: "LogoAdd",
    components: {},
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
