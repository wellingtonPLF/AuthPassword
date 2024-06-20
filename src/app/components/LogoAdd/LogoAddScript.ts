import { mapState } from 'vuex'
import mainService from '../../shared/services/mainService';
import { get_domain } from '../../shared/utils/general';

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
            arrayAuth: [
                "oasdaiusdausidpasudb",
                "oasdaiusdausidpasudbs"
            ]
        }
    },
    methods: {
        changeAddState(){
            this.myinput = '';
            this.addAuthentication = !this.addAuthentication;
        },
        excluirDomain(index: number) {
            const domain = get_domain(this.arrayAuth[index]);
            mainService.deleteDomain(domain).then( _ => {})
            this.arrayAuth.splice(index, 1);
        },
        saveAuth() {
            this.arrayAuth.push(this.myinput);
            mainService.create_domain(this.myinput).then( _ => {})
            this.changeAddState();
        },
        getPath(name: string) {
            const path = get_domain(name);
            return `/password/${path}`;
        }
    },
    mounted() {    
        mainService.get_all_domain().then(
          it => {
            this.arrayAuth = it;
          }
        )
    }
};
