import { mapState } from 'vuex'

export default {
    name: "App",
    computed: {
        ...mapState('credReducer', {
            cred: (state: any) => state.cred
        })
    },
    components: {},
};
