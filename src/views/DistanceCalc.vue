<template>
    <main>
        <LocationForm />
        <RouteList />
        <MapView />
    </main>
</template>

<script>
import LocationForm from "@/components/LocationForm.vue";
import RouteList from "@/components/RouteList.vue";
import MapView from "@/components/MapView.vue";

export default {
    components: {
        LocationForm,
        RouteList,
        MapView
    }
}
</script>