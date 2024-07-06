import { reactive } from "vue";
export const routeStore = ({
    currentRoute: {},
    setRoute(r) {
        this.currentRoute = r;
    }
})
