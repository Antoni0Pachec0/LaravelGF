<template><v-app>
  <v-container class="error-page" fluid>
    <v-row align="center" justify="center" class="error-wrapper" no-gutters>
      <!-- Imagen de conexión -->
      <v-col cols="12" md="6" class="text-center order-1 order-md-2 pa-4">
        <v-img
          src="/img/offline.png"
          alt="Sin conexión"
          class="mx-auto offline-img"
          contain
        />
      </v-col>

      <!-- Texto -->
      <v-col cols="12" md="6" class="order-2 order-md-1 pa-4">
        <div class="text-container animated fadeInUp">
          <h1 class="error-title">¡Sin conexión a Internet!</h1>
          <p class="error-subtitle">
            Parece que perdiste la conexión.<br />
            Verifica tu red y vuelve a intentarlo.
          </p>
          <v-btn class="btn-go-home" x-large @click="retry">
            <v-icon left>mdi-refresh</v-icon>
            Reintentar
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ErrorConexion",
  methods: {
    retry() {
      window.location.reload();
    },
  },
};
</script>

<style scoped>
.error-page {
  background-color: #f3f3f3;
  min-height: 100vh;
  overflow-x: hidden;
  font-family: "Segoe UI", sans-serif;
  display: flex;
  align-items: center;
}

.error-wrapper {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.text-container {
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
  animation: fadeInUp 1s ease;
  transition: all 0.3s ease;
}

@media (min-width: 960px) {
  .text-container {
    text-align: left;
    margin-left: auto;
    padding-left: 16px;
  }
}

.error-title {
  font-size: 2rem;
  font-weight: 800;
  color: #29235c;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

.error-subtitle {
  font-size: 1.3rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.2rem;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.03);
}

.btn-go-home {
  background-color: #29235c !important;
  color: #ffffff;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 12px 28px;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.btn-go-home:hover {
  background-color: #118737 !important;
  transform: scale(1.05);
}

/* Imagen animada */
.offline-img {
  animation: float 5s ease-in-out infinite;
  max-width: 100%;
  max-height: 450px;
}

@media (min-width: 960px) {
  .offline-img {
    max-height: 580px;
  }

  .error-title {
    font-size: 3.6rem;
  }

  .error-subtitle {
    font-size: 1.5rem;
  }

  .btn-go-home {
    font-size: 1.2rem;
    margin-top: 1.5rem;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
