<template><v-app>
  <v-container fluid class="full-screen">
    <!-- Título y filtro de estados -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h2 class="font-weight-bold text-primary title-text">
          Seguimiento de tus pedidos
        </h2>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-select
          v-model="estadoFiltro"
          :items="estadosDisponibles"
          label="Filtrar por estado"
          dense
          outlined
          clearable
        />
      </v-col>
    </v-row>

    <!-- Lista de pedidos -->
    <v-row v-if="filteredOrders.length">
      <v-col v-for="order in filteredOrders" :key="order.id_pedido" cols="12">
        <v-card
          :class="{ 'cancelled-card': order.estado === 'cancelado' }"
          class="pa-4 card-container"
          outlined
        >
          <v-row>
            <v-col cols="12">
              <h3 class="font-weight-bold text-primary title-text">
                <span class="delivery-text">
                  Llega el {{ formatDate(order.fecha_entrega_estimada) }}
                </span>
              </h3>
            </v-col>
          </v-row>

          <v-divider class="my-2" />

          <v-row>
            <v-col cols="6">
              <p>
                <strong>Realizado:</strong>
                {{ formatDate(order.fecha_levantamiento_pedido) }}
              </p>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-chip :color="getChipColor(order.estado)" text-color="white">
                {{ order.estado.toUpperCase() }}
              </v-chip>
            </v-col>
          </v-row>

          <v-divider class="my-2" />

          <!-- Seguimiento -->
          <div class="tracking-container">
            <div v-if="isMobile" class="timeline">
              <div
                v-for="(step, index) in getTimelineSteps(order)"
                :key="index"
                class="timeline-item"
              >
                <div
                  class="timeline-line"
                  :class="{ completed: index <= getCurrentStep(order) }"
                />
                <div
                  class="timeline-circle"
                  :class="{ completed: index <= getCurrentStep(order) }"
                />
                <div class="timeline-content">
                  <p
                    class="step-title"
                    :class="{ highlight: index <= getCurrentStep(order) }"
                  >
                    {{ step.title }}
                  </p>
                  <small class="step-date">{{
                    step.date || "Por resolver"
                  }}</small>
                </div>
              </div>
            </div>
            <div v-else class="progress-horizontal">
              <div class="progress-line">
                <div
                  class="progress-line-completed"
                  :style="{ width: getProgressWidth(order) }"
                />
              </div>
              <div class="steps">
                <div
                  v-for="(step, index) in getTimelineSteps(order)"
                  :key="index"
                  class="step"
                >
                  <div
                    class="circle"
                    :class="{ completed: index <= getCurrentStep(order) }"
                  />
                  <p
                    class="step-title"
                    :class="{ highlight: index <= getCurrentStep(order) }"
                  >
                    {{ step.title }}
                  </p>
                  <small class="step-date">{{
                    step.date || "Por resolver"
                  }}</small>
                </div>
              </div>
            </div>
          </div>

          <v-divider class="my-4" />

          <!-- Detalles -->
          <v-row>
            <v-col cols="12">
              <h4 class="font-weight-medium">Detalles de seguimiento</h4>
              <v-expand-transition>
                <div class="tracking-details">
                  <div
                    v-for="(detail, index) in order.showDetails
                      ? getDetails(order)
                      : getDetails(order).slice(0, 2)"
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
          <v-row v-if="getDetails(order).length > 2">
            <v-col cols="12" class="text-left">
              <v-btn
                text
                color="primary"
                class="font-weight-bold btn-details"
                @click="toggleDetails(order)"
              >
                {{
                  order.showDetails ? "Ocultar detalles ▲" : "Ver detalles ▼"
                }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-alert type="info">No tienes pedidos activos para mostrar.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      estadoFiltro: null,
      estadosDisponibles: [
        "Enviado",
        "Pendiente",
        "Ruta",
        "Entregado",
        "Cancelado",
      ],
      isMobile: process.client ? window.innerWidth < 600 : false,
    };
  },
  computed: {
    filteredOrders() {
      return this.estadoFiltro
        ? this.orders.filter(
            (o) => o.estado === this.estadoFiltro.toLowerCase()
          )
        : this.orders;
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    updateIsMobile() {
      this.isMobile = window.innerWidth < 600;
    },
    getPreparationDate(order) {
      // Ahora muestra exactamente la fecha de levantamiento
      return this.formatDate(order.fecha_levantamiento_pedido);
    },
    getShippingDate(order) {
      // Ahora muestra la fecha estimada de entrega
      return this.formatDate(order.fecha_entrega_estimada);
    },
    getTimelineSteps(order) {
      const steps = [
        { title: "Recibido", date: this.getPreparationDate(order) },
        { title: "Pendiente", date: this.getPreparationDate(order) },
        { title: "En ruta", date: this.getShippingDate(order) },
        { title: "Entregado", date: this.getShippingDate(order) },
      ];
      if (order.estado === "cancelado") {
        steps.unshift({
          title: "Cancelado",
          date: this.formatDate(order.updatedAt),
        });
      }
      return steps;
    },
    getCurrentStep(order) {
      switch (order.estado) {
        case "cancelado":
          return 0;
        case "enviado":
          return 0;
        case "ruta":
          return 2;
        case "entregado":
          return 3;
        default:
          return 1;
      }
    },
    getProgressWidth(order) {
      const total = this.getTimelineSteps(order).length - 1;
      const current = this.getCurrentStep(order);
      return (current / total) * 100 + "%";
    },
    getDetails(order) {
      return [
        {
          date: this.getPreparationDate(order),
          text: "Tu pedido ha sido recibido.",
        },
        {
          date: this.getPreparationDate(order),
          text: "El administrador ha revisado tu pedido.",
        },
        {
          date: this.getShippingDate(order),
          text: "Tu pedido está en camino.",
        },
        {
          date: this.getShippingDate(order),
          text: "Tu pedido ha sido entregado.",
        },
      ];
    },
    toggleDetails(order) {
      this.$set(order, "showDetails", !order.showDetails);
    },
    getChipColor(estado) {
      return estado === "cancelado" ? "red darken-2" : "primary";
    },
    fetchOrders() {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      this.$api
        .getUserOrders(userId, "Todas")
        .then((resp) => {
          this.orders = resp.map((o) => ({ ...o, showDetails: false }));
        })
        .catch(console.error);
    },
  },
  mounted() {
    this.fetchOrders();
    window.addEventListener("resize", this.updateIsMobile);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateIsMobile);
  },
};
</script>

<style scoped>
.cancelled-card {
  border-left: 6px solid red;
  background-color: #ffe6e6;
}
.timeline .highlight,
.progress-horizontal .highlight {
  font-weight: bold;
  color: #1976d2;
}
.timeline-circle.completed,
.circle.completed {
  background-color: #1976d2;
}
.timeline-line.completed,
.progress-line-completed {
  background-color: #1976d2;
}
</style>

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
  margin-bottom: 16px;
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

/* Tarjeta para pedidos cancelados */
.cancelled-card {
  background-color: #ffe6e6 !important;
}
</style>
