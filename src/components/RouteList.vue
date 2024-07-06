<template>
    <section class="route-list">
        <div class="route-list-header">
            <h3 class="ui header">Route List</h3>
            <select @change="sortRoute($event)">
                <option selected disabled>Sort</option>
                <optgroup label="Distance">
                    <option value="distance-asc">Short</option>
                    <option value="distance-desc">Long</option>
                </optgroup>
                <optgroup label="Duration">
                    <option value="duration-asc">Fastest</option>
                    <option value="duration-desc">Slowest</option>
                </optgroup>
            </select>
            <button type="button" class="ui button show-all" @click="showAllRoutes">Show All</button>
        </div>
        <div 
            class="item" 
            v-for="route in routes" 
            :key="route.id" 
            @click="routeItemPressed(route)"
            :style="{'background-color': route.color}"
        >
            <div>{{ route.origin.address }}
                <i class="marker alternate icon"></i>
            </div>
            <div>{{ route.destination.address }}
                <i class="flag checkered icon"></i>
            </div>
            <div class="ui label small">{{ route.distance.text }}</div>
            <div class="ui label small">{{ route.duration.text }}</div>
        </div>
    </section>
</template>

<script>
import firebase from "firebase";
import { EventBus } from "@/EventBus";
/*import { useRouteStore } from "@/RouteStore"*/
import { routeStore } from "@/RouteStore"

export default {
    data() {
        return {
            routes: []
        };
    },

    created() {
        const db = firebase.firestore();
        db.collection("routes").onSnapshot(snap => {
            this.routes = [];
            snap.forEach(doc => {
                let route = doc.data();
                route.id = doc.id;
                this.routes.push(route);
            })
        });
    },

    methods: {
        sortRoute(e) {
            const sortName = e.target.value.split("-")[0];
            const sortOrder = e.target.value.split("-")[1];

            const db = firebase.firestore();
            db.collection("routes").orderBy(sortName + ".value", sortOrder).get()
            .then(snap => {
                this.routes = [];
                snap.forEach(doc => {
                    let route = doc.data();
                    route.id = doc.id;
                    this.routes.push(route);
                })
            });
        },

        routeItemPressed(route) {
            EventBus.$emit("routes-data", [route]);
        },
        
        showAllRoutes() {
            EventBus.$emit("routes-data", this.routes);
        }
    }
}

</script>

<style scoped>
.route-list {
    position: relative;
    z-index: 1;
    max-width: 250px;
    margin: 10px;
    background-color: white;
}

.route-list-header {
    padding: 10px;
}

.item {
    padding: 10px;
    cursor: pointer;
}

.show-all {
    padding: 4px 10px;
}

</style>