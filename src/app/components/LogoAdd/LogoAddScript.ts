import { mapState, mapActions } from 'vuex'
import mainService from '../../shared/services/mainService';
import { get_domain, sleep } from '../../shared/utils/general';
import DeleteHandler from '../DeleteHandler/DeleteHandler.vue';
import { TrigramIndex } from '../../shared/utils/pg_trgm';
import Credentials from '../Credentials/Credentials.vue';
import Catalogo from '../Catalogo/Catalogo.vue';

export default {
    name: "LogoAdd",
    components: {
        DeleteHandler,
        Credentials,
        Catalogo
    },
    computed: {
        ...mapState('authReducer', {
            auth: (state: any) => state.auth
        }),
        ...mapState('scrollReducer', {
            scroll: (state: any) => state.scroll
        })
    },
    data() {
        return {
            listDomain: [],
            domainNames: [],
            cred: false,
            catalogo: false,
            addAuthentication: false,
            dialog: false,
            deleting: false,
            myinput: '',
            enter: false,
            searchValue: "",
            choice: undefined,
            objIndex: undefined,
            arrayAuth: []
        }
    },
    methods: {
        ...mapActions('scrollReducer', ['setScroll']),
        ...mapActions('credReducer', ['setCred']),

        changeAddState(){
            this.myinput = '';
            this.addAuthentication = !this.addAuthentication;
            this.setCred(this.addAuthentication);
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
            this.scrollTo(0);
        },
        saveAuth() {
            this.enter = true;
            this.arrayAuth.push(this.myinput);
            mainService.create_domain(this.myinput).then( _ => {})
            this.changeAddState();
        },
        getPath(name: string) {
            const path = get_domain(name);
            return `/password/${path}`;
        },
        scrollTo(value: number) {
            console.log(`Scrolling: ${this.scroll.position}`)
            window.scrollTo({
                top: value,
                behavior: 'smooth'
            });
        },
        getLinkPosition(event: any, index: number) {
            if (event.ctrlKey) {
                event.preventDefault();
                this.customFunction(index);
            }
            else {
                this.setScroll({ position: window.scrollY, index});
            }
        },
        search() {
            if (!this.dialog) {
                sleep(0.1).then(() => {
                    this.$refs.search.focus();
                })
            }
            else {
                const trigramIndex = new TrigramIndex(this.arrayAuth);
                const result = trigramIndex.find(this.searchValue)[0]
                if (result) {
                    const index = this.arrayAuth.indexOf(result.phrase);
                    const found = document.getElementById(`cred_${index}`);
                    if (found != undefined) {
                        const linkRect = found!.getBoundingClientRect();
                        const obj = { position: linkRect.top + window.scrollY - 300 , index};
                        this.scrollTo(obj.position);
                        this.choice = obj.index;
                    }
                    this.searchValue = ""
                }
            }
            this.dialog = !this.dialog;
        },
        customFunction(index: number) {
            const domain = get_domain(this.arrayAuth[index]);
            this.domainNames.push(domain);
            
            mainService.get_all_password(this.auth, domain).then(
                it => {
                    this.listDomain.push(it.map((obj) => {
                        const item = obj.split("\n");
                        return { nome: item[0], password: item[1], ativo: true}})
                    );
                }
            );
        },
        credState(){
            this.catalogo = false;
            this.cred = !this.cred;
        },
        catalogoState(){
            this.cred = false;
            this.catalogo = !this.catalogo;
        },
        handleEsc(event: any) {
            if (event.key === 'Escape') {
                this.dialog = !this.dialog;
                this.searchValue = ""
            }
        },  
        deleteRegistry(index: number) {
            this.listDomain.splice(index, 1);
            this.domainNames.splice(index, 1);
        },
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.handleEsc);
    },
    beforeMount() {
        mainService.get_all_domain().then(
          it => {
            this.arrayAuth = it;
          }
        )        
    },
    mounted() {
        window.addEventListener('keydown', this.handleEsc);
        this.choice = this.scroll.index;        
        this.scrollTo(this.scroll.position);
    }
};