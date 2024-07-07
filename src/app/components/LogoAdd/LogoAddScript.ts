import { mapState, mapActions } from 'vuex'
import mainService from '../../shared/services/mainService';
import { get_domain, sleep } from '../../shared/utils/general';
import DeleteHandler from '../DeleteHandler/DeleteHandler.vue';

export default {
    name: "LogoAdd",
    components: {
        DeleteHandler
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
            addAuthentication: false,
            dialog: false,
            deleting: false,
            myinput: '',
            enter: false,
            searchValue: "",
            choice: undefined,
            objIndex: undefined,
            arrayAuth: [
                // "asndfpóabf1",
                // "asndfpóabf2",
                // "asndfpóabf3",
                // "asndfpóabf4",
                // "asndfpóabf5",
                // "asndfpóabf6",
                // "asndfpóabf7",
                // "asndfpóabf8",
                // "asndfpóabf9",
                // "asndfpóabf10",
                // "asndfpóabf11",
                // "asndfpóabf12",
                // "asndfpóabf13",
                // "asndfpóabf14",
                // "asndfpóabf15",
                // "asndfpóabf16",
                // "asndfpóabf17",
                // "asndfpóabf18",
                // "asndfpóabf19",
                // "asndfpóabf20",
                // "asndfpóabf21",
                // "asndfpóabf22",
                // "asndfpóabf23",
                // "asndfpóabf24",
                // "asndfpóabf25",
                // "asndfpóabf26",
                // "asndfpóabf27",
                // "asndfpóabf28",
                // "asndfpóabf29",
                // "asndfpóabf30",
                // "asndfpóabf31",
                // "asndfpóabf32",
                // "asndfpóabf33",
                // "asndfpóabf34",
                // "asndfpóabf35",
                // "asndfpóabf36",
                // "asndfpóabf37",
                // "asndfpóabf38",
                // "asndfpóabf39",
                // "asndfpóabf40",
                // "asndfpóabf41",
                // "asndfpóabf42",
                // "asndfpóabf43",
                // "asndfpóabf44",
                // "asndfpóabf45",
                // "asndfpóabf46",
                // "asndfpóabf47",
                // "asndfpóabf48",
                // "asndfpóabf49",
                // "asndfpóabf50",
                // "asndfpóabf51",
                // "asndfpóabf52",
                // "asndfpóabf53",
                // "asndfpóabf54",
                // "asndfpóabf55",
                // "asndfpóabf56",
                // "asndfpóabf57",
                // "asndfpóabf58",
                // "asndfpóabf59",
                // "asndfpóabf60",
                // "asndfpóabf61",
                // "asndfpóabf62",
                // "asndfpóabf63",
                // "asndfpóabf64",
            ]
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
            window.scrollTo({
                top: value,
                behavior: 'smooth'
            });
        },
        getLinkPosition(index: number) {
            this.setScroll({ position: window.scrollY, index});
        },
        search() {
            if (!this.dialog) {
                sleep(0.1).then(() => {
                    this.$refs.search.focus();
                })
            }
            else {
                // const x = ["Valorant", "League of legends", "The legend of zelda", "Hantaro", "Yu-gi-oh", "Dragon Ball Z", "Minecraft"]
                // const fuseSearch = new Fuse(x, { includeScore: true });
                // const z = fuseSearch.search("Valo");
                // this.error = z;

                // const fuseSearch = new Fuse(this.arrayAuth);
                // const result = fuseSearch.search(this.searchValue)
                // const index = 29; //indexOf(result)

                // const found = document.getElementById(`cred_${index}`);
                // if (found != undefined) {
                //     const linkRect = found!.getBoundingClientRect();
                
                //     const obj = { position: linkRect.top + window.scrollY - 6 , index};
                //     this.scrollTo(obj.position);
                //     this.choice = obj.index;
                // }
            }
            this.dialog = !this.dialog;
        }
    },
    mounted() {
        this.scrollTo(this.scroll.position);
        this.choice = this.scroll.index;
        mainService.get_all_domain().then(
          it => {
            this.arrayAuth = it;
          }
        )
    }
};
