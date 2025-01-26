<template>
  <div>
    <MenuInicio />
    <Bienvenida id="inicio" />
    <SobreNosotros />
    <CarruselAnuncios id="anuncios" />
    <ProximosEventos />
    <RedesSociales />
    <Pastor />
    <Servicios />
    <Ministerios />
    <Ubicacion />
    <PieDePagina />
    <BotonTop />
  </div>
</template>

<script>
import PieDePagina from "./PieDePagina.vue";
import Ubicacion from "./Ubicacion.vue";
import Servicios from "./Servicios.vue";
import Pastor from "./Pastor.vue";
import Bienvenida from "./Bienvenida.vue";
import MenuInicio from "./MenuInicio.vue";
import ProximosEventos from "./Eventos/ProximosEventos.vue";
import CarruselAnuncios from "./Anuncios/CarruselAnuncios.vue";
import Ministerios from "./Ministerios.vue";
import BotonTop from "./BotonTop.vue";
import SobreNosotros from "./SobreNosotros.vue";
import RedesSociales from "./RedesSociales.vue";

export default {
  components: {
    PieDePagina,
    Ubicacion,
    Ministerios,
    Servicios,
    Pastor,
    CarruselAnuncios,
    Bienvenida,
    MenuInicio,
    SobreNosotros,
    ProximosEventos,
    BotonTop,
    RedesSociales,
  },
};
</script>
