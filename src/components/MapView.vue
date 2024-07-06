<template>
    <section class="map" ref="map">
    </section>
</template>

<script>
import { EventBus } from "@/EventBus"
export default {
        data() {
            return {
                map: null
            };
        },

    mounted() {
        const directionsService = new google.maps.DirectionsService();

        EventBus.$on("routes-data", routes => {
            this.map = new google.maps.Map(
                this.$refs["map"],
                {
                    center: new google.maps.LatLng(47.608013, -122.335167),
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
            );

            routes.forEach(({ origin, destination, distance, duration, color }) => {
                directionsService.route(
                    {
                        origin: origin.address,
                        destination: destination.address,
                        travelMode: "DRIVING"
                    },
                    (res, status) => {
                        if (status === "OK") {
                            const directionsRenderer = new google.maps.DirectionsRenderer({
                                suppressMarkers: true,
                                directions: res,
                                map: this.map,
                                polylineOptions: {
                                    strokeColor: color,
                                    strokeWeight: 8
                                }
                            });

                            this.createInfoWindow(origin, "marker alternate", color);
                            this.createInfoWindow(destination, "flag checkered", color);

                            const overviewPath = (res.routes[0].overview_path);
                            const middleIndex = parseInt(overviewPath.length / 2);
                            const middleLoc = overviewPath[middleIndex];

                            const distanceLabel = new google.maps.InfoWindow({
                                content: `<div style="background-color: ${color}; padding: 5px"><i class="icon car"></i> ${distance.text} - ${duration.text}</div>`,
                                position: new google.maps.LatLng(
                                    middleLoc.lat(),
                                    middleLoc.lng()
                                )
                            })
                            distanceLabel.open(this.map, null);

                            directionsRenderer.setDirections(res);
                            directionsRenderer.setMap(this.map);

                            this.createPolyline(origin, overviewPath[0], color);
                            this.createPolyline(destination, overviewPath[overviewPath.length - 1], color);
                        }
                    }
                );
            })
        })
    },

    methods: {
        createInfoWindow(location, icon, color) {
            const label = new google.maps.InfoWindow({
                content: `<div style="background-color: ${color}; padding: 5px"><i class="${icon} icon"></i> ${location.address}</div>`,
                position: new google.maps.LatLng(location.lat, location.lng)
            });

            label.open(this.map, null);
        },

        createPolyline(location, op, color) {
            new google.maps.Polyline({
                path: [
                    {lat: location.lat, lng: location.lng},
                    {lat: op.lat(), lng: op.lng()}
                ],
                strokeColor: color,
                strokeOpacity: 1,
                strokeWeight: 8,
                map: this.map
            });
        }
    }
}
</script>

<style>
.map {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: red;
}

.gm-style-iw button {
    display: none !important;
}

.gm-style .gm-style-iw-c {
    padding: 0px !important;
}

.gm-style-iw-d {
    overflow: hidden !important;
}
</style>

