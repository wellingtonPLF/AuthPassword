import { mapState } from 'vuex'
import mainService from '../../shared/services/mainService';
import { get_domain } from '../../shared/utils/general';
import DeleteHandler from '../DeleteHandler/DeleteHandler.vue';

export default {
    name: "LogoAdd",
    components: {
        DeleteHandler
    },
    computed: {
        ...mapState('authReducer', {
            auth: (state: any) => state.auth
        })
    },
    data() {
        return {
            addAuthentication: false,
            deleting: false,
            myinput: '',
            objIndex: undefined,
            arrayAuth: []
        }
    },
    methods: {
        changeAddState(){
            this.myinput = '';
            this.addAuthentication = !this.addAuthentication;
        },
        deleteOption(value: boolean) {
            if (value) {
                const domain = get_domain(this.arrayAuth[this.objIndex]);
                mainService.deleteDomain(domain).then( _ => {})
                this.arrayAuth.splice(this.objIndex, 1);
            }
            this.deleting = !this.deleting
        },
        excluirDomain(index: number) {
            this.objIndex = index;
            this.deleting = true;
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
