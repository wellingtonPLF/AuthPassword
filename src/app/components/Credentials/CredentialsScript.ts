
export default {
    name: "Credentials",
    components: {},
    props: {
        listDomain: {
            type: Array,
            required: true
        },
        domainNames: {
            type: Array,
            required: true
        },
    },
    data() {
        return {}
    },
    methods: {
        async copy(value: string) {
            await navigator.clipboard.writeText(value);
        },
        deleteRegistry(index: number) {
            this.$emit('removeItem', index);
        }
    },
};