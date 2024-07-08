import mainService from '../../shared/services/mainService';
import { mapState } from 'vuex'
import { get_domain } from '../../shared/utils/general';

export default {
    name: "Catalogo",
    components: {},
    computed: {
        ...mapState('authReducer', {
            auth: (state: any) => state.auth
        })
    },
    data() {
        return {
            arrayList: []
        }
    },
    methods: {
        findEmail(email: string, emails: string[]) {
            const r = emails.filter((obj) => obj == email)
            return r.length > 0
        }
    },
    mounted() { 

        mainService.get_all_domain().then(
            async it => {
                const emails: string[] = [];
                const domains = await Promise.all(it.map(async (e) => {
                    const domain = get_domain(e);

                    const arrayPassword = await mainService.get_all_password(this.auth, domain)
                    const result = arrayPassword.map((cred) => {
                        const email = cred.split("\n")[0];
                        const condition = this.findEmail(email, emails);
                        if (!condition) {
                            emails.push(email)
                        }
                        return email
                    })
                    return { domain, emails: result}
                }))

                this.arrayList = emails.map((email) => {

                    const arrayDomain = domains.map((value) => {
                        const found = this.findEmail(email, value.emails)
                        if (found) {
                            return value.domain;
                        }
                        return;
                    })

                    return { email, array: arrayDomain.filter((item) => item != undefined)}
                })
            }
        )
    }
};
