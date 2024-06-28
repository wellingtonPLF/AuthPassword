
export default {
    name: "DeleteHandler",
    components: {},
    data() {
        return {
        }
    },
    methods: {
        applyDelete(event: any) {
            this.$emit('optionDelete', event)
        }
    },
};
