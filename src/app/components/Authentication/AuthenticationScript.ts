import passwordService from "../../shared/services/passwordService";

export default {
    name: "Authentication",
    components: {},
    data() {
        return {
            x: "OKOK"
        }
    },
    methods: {
        trySomething() {
            passwordService.get_all_domain().then(
                it => {
                    this.x = it;
                    console.log(`Result: ${it}`);
                }
                ).catch((e) => {
                    this.x = e;
                    console.error("Error at TrySomething");
                }
            );
        }
    }
};
