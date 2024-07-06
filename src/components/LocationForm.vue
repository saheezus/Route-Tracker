<template>
    <section class="location-form">
        <div class="ui form">
            <div class="ui message red small" v-show="error">{{ error }}</div>
            <div class="two fields">
                <div class="field">
                    <div class="ui left icon input">
                        <i class="marker alternate icon"></i>
                        <input type="text" placeholder="Start" ref="origin" />
                    </div>
                </div>
                <div class="field">
                    <div class="ui left icon input">
                        <i class="flag checkered icon"></i>
                        <input type="text" placeholder="Destination" ref="destination" />
                    </div>
                </div>
                <button 
                    type="button" 
                    class="ui button small green" 
                    @click="goButtonPressed" 
                    :class="{loading: spinner}"
                >Go</button>
            </div>
        </div>
    </section>
</template>

<script>

import axios from "axios";
import firebase from "firebase";
const corsHeader = "https://cors-anywhere.herokuapp.com/";

export default {

    data() {
        return {
            key: `${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
            error: "",
            route: {
                color: "",
                origin: {
                    address: "",
                    lat: 0,
                    lng: 0
                },
                destination: {
                    address: "",
                    lat: 0,
                    lng: 0
                },
                distance: {},
                duration: {}
            },
            spinner: false
        }
    },

    mounted() {
        for (let ref in this.$refs) {
            const autocomplete = new google.maps.places.Autocomplete(
                this.$refs[ref],
                {
                    bounds: new google.maps.LatLngBounds(
                        new google.maps.LatLng(47.655334, -122.303520)
                    )
                }
            )
            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                this.route[ref].address = `${place.name}, ${place.vicinity}`
                this.route[ref].lat = place.geometry.location.lat();
                this.route[ref].lng = place.geometry.location.lng();
            })
        }
    },

    methods: {
        goButtonPressed() {
            this.spinner = true;

            const URL = `${corsHeader}https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.route.origin.lat},${this.route.origin.lng}&destinations=${this.route.destination.lat},${this.route.destination.lng}&key=${this.key}`;

            axios.get(URL)
            .then(res => {
                if (res.data.error_message) {
                    this.error = res.data.error_message;
                } else {
                    const elements = res.data.rows[0].elements;

                    if (elements[0].status === "ZERO_RESULTS") {
                        this.error = "No results found";
                    } else {
                        this.route.distance = elements[0].distance;
                        this.route.duration = elements[0].duration;
                        this.route.color = this.getRandomColor();
                        this.error = "";
                        this.saveRoute();
                    }
                    this.spinner = false;
                }
            })
            .catch(err => {
                this.error = err.message;
                this.spinner = false;
            })
        },

        saveRoute() {
            const db = firebase.firestore();
            db.collection("routes").doc().set(this.route);
        },

        getRandomColor() {
            let chars = "0123456789ABCDEF";
            let color = "#";
            for (let i = 0; i < 6; i++) {
                color += chars[Math.floor(Math.random() * 16)];
            }
            return color;
        }
    }
}

</script>

<style scoped>
.location-form {
    position: relative;
    z-index: 1;
    max-width: 610px;
    margin: 10px;
}
</style>