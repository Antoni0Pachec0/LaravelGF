<template><v-app>
  <v-container fluid class="full-screen">
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="pa-4 card-container">
          <v-row>
            <v-col cols="12">
              <h3 class="font-weight-bold text-primary title-text">
                <span class="delivery-text">Llega entre el 24 de Febrero</span>
              </h3>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <div class="tracking-container">
            <div v-if="isMobile" class="timeline">
              <div
                v-for="(step, index) in steps"
                :key="index"
                class="timeline-item"
              >
                <div
                  class="timeline-line"
                  :class="{ completed: index < currentStep }"
                ></div>
                <div
                  class="timeline-circle"
                  :class="{ completed: index < currentStep }"
                ></div>
                <div class="timeline-content">
                  <p
                    class="step-title"
                    :class="{ highlight: index <= currentStep }"
                  >
                    {{ step.title }}
                  </p>
                  <small class="step-date">{{
                    step.date || "Pendiente"
                  }}</small>
                </div>
              </div>
            </div>

            <div v-else class="progress-horizontal">
              <div class="progress-line">
                <div
                  class="progress-line-completed"
                  :style="{ width: progressWidth }"
                ></div>
              </div>
              <div class="steps">
                <div v-for="(step, index) in steps" :key="index" class="step">
                  <div
                    class="circle"
                    :class="{ completed: index < currentStep }"
                  ></div>
                  <p
                    class="step-title"
                    :class="{ highlight: index <= currentStep }"
                  >
                    {{ step.title }}
                  </p>
                  <small class="step-date">{{
                    step.date || "Pendiente"
                  }}</small>
                </div>
              </div>
            </div>
          </div>

          <v-divider class="my-4"></v-divider>

          <v-row>
            <v-col cols="12">
              <h4 class="font-weight-medium">Detalles de seguimiento</h4>
              <v-expand-transition>
                <div class="tracking-details">
                  <div
                    v-for="(detail, index) in displayedDetails"
                    :key="index"
                    class="detail-item"
                  >
                    <span class="detail-date">{{ detail.date }}</span>
                    <p class="detail-text">{{ detail.text }}</p>
                  </div>
                </div>
              </v-expand-transition>
            </v-col>
          </v-row>

          <v-row v-if="details.length > 2">
            <v-col cols="12" class="text-left">
              <v-btn
                text
                color="primary"
                class="font-weight-bold btn-details"
                @click="toggleDetails"
              >
                {{ showAllDetails ? "Ocultar detalles ▲" : "Ver detalles ▼" }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "preventista",
  head() {
    return {
      title: "Pedidos - Preventista",
      meta: [{ name: "pedidos", content: "Preventista" }],
    };
  },
  data() {
    return {
      currentStep: 2,
      showAllDetails: false,
      isMobile: process.client ? window.innerWidth < 600 : false,
      steps: [
        { title: "Pedido confirmado", date: "Lunes, Enero 31 2025" },
        { title: "En preparación", date: "Lunes, Febrero 02 2025" },
        { title: "En camino", date: "Pendiente" },
        { title: "Entregado", date: "Pendiente" },
      ],
      details: [
        {
          date: "Lunes, Enero 31 2025",
          text: "Hemos recibido tu pedido y está en proceso de validación.",
        },
        {
          date: "Lunes, Febrero 02 2025",
          text: "Estamos reuniendo los productos de tu pedido.",
        },
        {
          date: "Martes, Febrero 03 2025",
          text: "Tu pedido ha sido empacado y está listo para ser enviado.",
        },
        {
          date: "Miércoles, Febrero 04 2025",
          text: "Tu paquete ha salido de nuestro almacén.",
        },
        {
          date: "Jueves, Febrero 05 2025",
          text: "El repartidor tiene tu pedido y está en camino.",
        },
      ],
    };
  },
  computed: {
    displayedDetails() {
      return this.showAllDetails ? this.details : this.details.slice(0, 2);
    },
    progressWidth() {
      return this.currentStep === 2
        ? "50%"
        : this.currentStep > 2
        ? "100%"
        : "25%";
    },
  },
  methods: {
    toggleDetails() {
      this.showAllDetails = !this.showAllDetails;
    },
    updateIsMobile() {
      this.isMobile = window.innerWidth < 600;
    },
  },
  mounted() {
    window.addEventListener("resize", this.updateIsMobile);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateIsMobile);
  },
};
</script>

<style scoped>
.full-screen {
  min-height: 100vh;
  background-color: #f3f3f3;
  padding-top: 20px;
}

.card-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 95%;
  margin: auto;
}

.delivery-text {
  color: #2c3e50;
  font-weight: bold;
}

.timeline {
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 20px;
}

.timeline-item {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
}

.timeline-line {
  position: absolute;
  width: 3px;
  height: 100%;
  left: 7px;
  top: 16px;
  background-color: #c4c4c4;
}

.timeline-line.completed {
  background-color: #247323;
}

.timeline-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #c4c4c4;
  margin-right: 10px;
  z-index: 2;
  position: relative;
}

.timeline-circle.completed {
  background-color: #247323;
}

.progress-horizontal {
  width: 100%;
  position: relative;
}

.progress-line {
  width: 100%;
  height: 4px;
  background-color: #c4c4c4;
  position: relative;
  overflow: hidden;
}

.progress-line-completed {
  height: 100%;
  background-color: #247323;
  position: absolute;
  top: 0;
  left: 0;
  transition: width 0.3s ease-in-out;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-top: -10px;
}

.circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #c4c4c4;
}

.circle.completed {
  background-color: #247323;
}

.tracking-details {
  max-height: 1000px;
  overflow: hidden;
  transition: all 0.5s ease;
}

.detail-item {
  margin-bottom: 12px;
  padding-left: 10px;
}

.detail-date {
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
}

.detail-text {
  margin: 4px 0 0 0;
  color: #555;
  font-size: 14px;
}

.btn-details {
  text-transform: uppercase;
  font-weight: bold;
  color: #2c3e50 !important;
}
</style>
