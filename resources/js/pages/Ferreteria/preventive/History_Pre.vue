<template><v-app>
  <v-app>
    <v-container
      fluid
      class="d-flex flex-column"
      style="padding: 10px; background-color: #f3f3f3"
    >
      <v-row class="d-flex align-center" style="margin-bottom: 0">
        <v-col cols="12" sm="6" class="d-flex align-center">
          <div class="select-container">
            <i class="mdi mdi-tune-variant custom-icon"></i>
            <select v-model="selectedFilter" class="custom-select">
              <option
                v-for="(filter, index) in filters"
                :key="index"
                :value="filter.value"
              >
                {{ filter.text }}
              </option>
            </select>
            <i class="mdi mdi-menu-down custom-icon-right"></i>
          </div>

          <v-divider
            vertical
            style="
              height: 40px;
              border-left: 2px solid #7a7a7a;
              margin-left: 20px;
              margin-right: 10px;
            "
          ></v-divider>
          <span style="font-size: 14px; color: #7a7a7a; font-weight: 500">
            {{ filteredPurchases.length }} Compras
          </span>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="(purchase, index) in filteredPurchases"
          :key="index"
          cols="12"
        >
          <v-card
            class="mb-4"
            outlined
            style="
              max-width: 1200px;
              margin-left: auto;
              margin-right: auto;
              background-color: #ffffff;
              border-radius: 16px;
              height: 200px;
              padding: 8px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              overflow: hidden;
            "
          >
            <!-- Fecha y separación -->
            <v-card-title
              class="d-flex justify-between align-center"
              style="padding-bottom: 2px"
            >
              <span style="font-size: 20px; color: #29235c; margin: 0">{{
                formatDate(purchase.date)
              }}</span>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-subtitle
              class="text-h6"
              :style="{
                color: purchase.status === 'Entregado' ? '#247323' : 'orange',
              }"
              style="
                margin-top: 2px;
                color: #29235c;
                font-size: 12px;
                padding: 5px;
                margin-left: 11px;
              "
            >
              {{ purchase.status }}
            </v-card-subtitle>

            <v-card-subtitle
              v-if="purchase.status === 'Entregado'"
              class="text-body-2"
              style="
                font-weight: bold;
                color: black;
                font-size: 12px;
                padding: 1px;
                margin-left: 15px;
              "
            >
              Llegó el {{ formatDate(purchase.details) }}
            </v-card-subtitle>

            <!-- Descripción y unidades -->
            <v-card-text
              style="
                font-size: 14px;
                overflow-y: auto;
                padding: 1px;
                margin-left: 15px;
              "
            >
              <p style="margin: 0; color: grey">{{ purchase.description }}</p>
              <p style="font-size: 12px; color: #757575; margin: 1">
                {{ purchase.units }} Unidad(es)
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: "preventista",
  head() {
    return {
      title: "Historial - Preventista",
      meta: [{ name: "historial", content: "Preventista" }],
    };
  },
  data() {
    return {
      selectedFilter: "Todas", // Default filter value
      filters: [
        { text: "Todas", value: "Todas", icon: "mdi-all-inclusive" },
        {
          text: "Entregado",
          value: "Entregado",
          icon: "mdi-checkbox-marked-circle",
        },
        { text: "Pendiente", value: "Pendiente", icon: "mdi-clock-outline" },
      ], // Filter options with icons
      purchases: [
        {
          date: "2023-01-23",
          status: "Entregado",
          description: "Estuche con 50 cuchillas SKA",
          details: "2023-01-28",
          units: 1,
        },
        {
          date: "2023-01-10",
          status: "Entregado",
          description: "Estuche con 50 cuchillas SKA",
          details: "2023-01-15",
          units: 20,
        },
        {
          date: "2025-02-05",
          status: "Entregado",
          description: "Estuche con 50 cuchillas SKA",
          details: "2025-02-10",
          units: 1,
        },
        {
          date: "2025-02-18",
          status: "Entregado",
          description: "Estuche con 50 cuchillas SKA",
          details: "2025-02-26",
          units: 20,
        },
        {
          date: "2025-03-01",
          status: "Pendiente",
          description: "Estuche con 50 cuchillas SKA",
          details: "Esperando fecha de entrega",
          units: 10,
        },
        {
          date: "2025-03-05",
          status: "Pendiente",
          description: "Estuche con 50 cuchillas SKA",
          details: "Esperando fecha de entrega",
          units: 5,
        },
      ],
    };
  },
  computed: {
    filteredPurchases() {
      if (this.selectedFilter === "Todas") {
        return this.purchases;
      }
      return this.purchases.filter(
        (purchase) => purchase.status === this.selectedFilter
      ); // Filter by selected status
    },
  },
  methods: {
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("es-ES", options);
    },
  },
};
</script>

<style scoped>
.card-no-shadow {
  box-shadow: none !important;
}

.white-text {
  color: #ffffff !important;
}

.v-col {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.v-card-title {
  font-weight: bold;
}

.v-chip {
  font-weight: bold;
}

h1 {
  color: #29235c;
  font-size: 24px;
  margin-bottom: 20px;
}

.v-card-subtitle {
  font-size: 16px;
  color: gray;
}

.v-card-text {
  font-size: 12px;
  padding: 0;
}

.select-container {
  position: relative;
  width: 30%;
  display: flex;
  align-items: center;
}

.custom-select {
  padding-left: 30px;
  padding-right: 30px;
  font-size: 14px;
  border-radius: 20px;
  outline: none;
  background-color: #f3f3f3;
  width: 100%;
}

.custom-select option {
  font-size: 14px;
  color: #29235c;
}

.custom-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #29235c;
  pointer-events: none;
}

.custom-icon-right {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #29235c;
  pointer-events: none;
}

@media (max-width: 600px) {
  .v-col {
    margin-left: 0 !important;
  }

  .v-card {
    width: 100%;
    max-width: 350px;
  }

  .custom-select {
    font-size: 12px;
  }

  .custom-icon-right,
  .custom-icon {
    font-size: 14px;
  }
  .select-container {
    width: 35%;
  }
}

@media (min-width: 601px) {
  .v-card {
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
