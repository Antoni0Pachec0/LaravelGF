<template><v-app>
  <div class="order-list fill-height">
    <!-- Filtros de estado y día -->
    <div class="d-flex align-center justify-space-between mb-4 px-4 flex-wrap">
      <div class="d-flex align-center">
        <v-select
          v-model="selectedFilter"
          :items="filterOptions"
          dense
          outlined
          hide-details
          class="filter-select mr-4"
          prepend-inner-icon="mdi-filter-variant"
          @change="filterOrders"
        />
        <div class="order-count grey--text text--darken-1">
          {{ filteredOrders.length }} pedidos
        </div>
      </div>

      <v-chip-group
        v-model="selectedDay"
        class="mt-2 mt-md-0 ml-md-5"
        row
        active-class="chip-active"
        @change="filterOrders"
      >
        <v-chip
          v-for="(day, i) in deliveryDays"
          :key="i"
          :value="day"
          class="ma-1"
          outlined
          color="yellow darken-2"
        >
          {{ day }}
        </v-chip>
      </v-chip-group>
    </div>

    <!-- Pedidos agrupados -->
    <div class="orders-container">
      <div
        v-for="(dateGroup, index) in groupedOrders"
        :key="index"
        class="date-group mb-6"
      >
        <div class="d-flex justify-space-between pa-4">
          <div class="date-header yellow--text text--darken-3 font-weight-bold">
            {{ dateGroup.date }}
          </div>
          <div class="route-id font-weight-bold yellow--text text--darken-3">
            Ruta {{ dateGroup.orders[0]?.id_ruta || "Sin Ruta" }} -
            {{ dateGroup.orders[0]?.nombre_ruta || "Sin nombre de ruta" }}
          </div>
        </div>

        <v-divider></v-divider>

        <div
          v-for="order in dateGroup.orders"
          :key="order.id_pedido"
          class="order-item"
        >
          <div class="order-content">
            <div class="order-left">
              <div class="order-number success--text font-weight-bold">
                ${{ order.total }} MXN
              </div>
              <div class="order-location font-weight-bold">
                {{ order.localidad_nombre }}
              </div>
              <div class="product-description">
                {{ order.direccion }}
              </div>
              <div class="order-quantity grey--text">
                {{ order.unidades }} Unidades
              </div>
            </div>

            <div class="order-center">
              <div class="customer-name">
                {{ order.nombre_completo }}
              </div>
              <div class="message-btn-container">
                <v-btn
                  text
                  small
                  color="success"
                  class="send-message-btn px-0"
                  @click="openMessage(order)"
                >
                  <v-icon small left>mdi-email-outline</v-icon>
                  Enviar Mensaje
                </v-btn>
              </div>
            </div>

            <div class="order-right">
              <v-btn
                color="success"
                outlined
                class="mr-3 view-order-btn"
                @click="verProductos(order)"
              >
                Ver Pedido
              </v-btn>

              <v-menu offset-y left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    outlined
                    color="light-green lighten-3"
                    class="status-btn"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ getDisplayStatus(order.estado) }}
                    <v-icon right>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(status, i) in statusOptions"
                    :key="i"
                    @click="updateStatus(order, status)"
                  >
                    <v-list-item-title>{{ status }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
          <v-divider></v-divider>
        </div>
      </div>
    </div>

    <!-- Modal de Enviar Mensaje -->
    <v-dialog v-model="mensajeVisible" max-width="600px" persistent>
      <v-card class="pa-4 rounded-xl">
        <v-card-title class="justify-center">
          <span class="text-h6 font-weight-bold yellow--text text--darken-2">
            Enviar mensaje a {{ destinatario }}
          </span>
        </v-card-title>

        <v-card-text class="pt-2 pb-0">
          <v-text-field
            v-model="mensajeTitulo"
            label="Título del mensaje"
            placeholder="Ej. Pedido urgente, Cambio de dirección..."
            outlined
            dense
            clearable
            class="mb-4"
          />
          <v-textarea
            v-model="mensaje"
            label="Contenido del mensaje"
            placeholder="Escribe aquí el contenido del mensaje..."
            rows="5"
            outlined
            auto-grow
            clearable
          />
        </v-card-text>

        <v-card-actions class="justify-end mt-4">
          <v-btn text color="grey" @click="mensajeVisible = false">
            Cancelar
          </v-btn>
          <v-btn color="success" dark @click="enviarMensaje"> Enviar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ✅ Modal de Productos del Pedido -->
    <v-dialog v-model="modalVisible" max-width="700px" persistent>
      <v-card>
        <v-card-title class="headline font-weight-bold">Productos del Pedido</v-card-title>
        <v-card-text>
          <v-simple-table dense>
            <thead>
              <tr>
                <th class="text-left">Descripción</th>
                <th class="text-right">Cantidad</th>
                <th class="text-right">Precio</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(producto, index) in productosPedido" :key="index">
                <td>{{ producto.descripcion }}</td>
                <td class="text-right">{{ producto.cantidad }}</td>
                <td class="text-right">${{ producto.precio_unitario }}</td>
                <td class="text-right">${{ producto.total }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="modalVisible = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      selectedFilter: "Todos",
      filterOptions: ["Todos", "pendiente", "ruta", "entregado", "cancelado"],
      statusOptions: ["pendiente", "ruta", "entregado", "cancelado"],
      deliveryDays: [
        "Todos",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ],
      selectedDay: "Todos",
      orders: [],
      filteredOrders: [],
      modalVisible: false,
      mensajeVisible: false,
      mensaje: "",
      mensajeTitulo: "",
      pedidoSeleccionado: null,
      productosPedido: [],
      destinatario: null,
    };
  },
  computed: {
    groupedOrders() {
      const groups = {};
      this.filteredOrders.forEach((order) => {
        const fecha = moment(order.fecha_levantamiento_pedido).format(
          "DD [de] MMMM (HH:mm)"
        );
        if (!groups[fecha]) groups[fecha] = { date: fecha, orders: [] };
        groups[fecha].orders.push(order);
      });
      return Object.values(groups);
    },
  },
  methods: {
    async fetchOrders() {
  try {
    const orders = await this.$api.getAllOrdersWithUnits();
    console.log("Pedidos recibidos:", orders); // 👈 esto debe mostrar los datos
    this.orders = orders;
    this.filterOrders();
  } catch (err) {
    console.error("Error al obtener pedidos:", err); // 👈 si hay error, lo verás aquí
  }
},
    removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
    filterOrders() {
      let result = [...this.orders];

      if (this.selectedFilter !== "Todos") {
        result = result.filter((o) => o.estado === this.selectedFilter);
      }

      if (this.selectedDay !== "Todos") {
        result = result.filter(
          (o) =>
            this.removeAccents((o.dia_entrega || "").toLowerCase().trim()) ===
            this.removeAccents(this.selectedDay.toLowerCase().trim())
        );
      }

      // Orden personalizado
      const noEntregados = result
        .filter((o) => o.estado !== "entregado")
        .sort(
          (a, b) =>
            new Date(b.fecha_levantamiento_pedido) -
            new Date(a.fecha_levantamiento_pedido)
        );

      const entregados = result
        .filter((o) => o.estado === "entregado")
        .sort(
          (a, b) =>
            new Date(b.fecha_levantamiento_pedido) -
            new Date(a.fecha_levantamiento_pedido)
        );

      this.filteredOrders = [...noEntregados, ...entregados];
    },

    getDisplayStatus(status) {
      return status === "enviado"
        ? "Nuevo"
        : status.charAt(0).toUpperCase() + status.slice(1);
    },
    async verProductos(order) {
  if (order.estado === "enviado") {
    await this.$api.setOrderToPending(order.id_pedido);
    order.estado = "pendiente";
  }
  this.productosPedido = await this.$api.getOrderProducts(order.id_pedido);
  this.pedidoSeleccionado = order;
  this.modalVisible = true;
},
    async updateStatus(order, status) {
      await this.$axios.$put(`/pedidos/${order.id_pedido}`, {
        ...order,
        estado: status,
      });
      order.estado = status;
      this.filterOrders(); // Reordenar después del cambio
    },
    openMessage(order) {
      this.destinatario = order.nombre_completo;
      this.mensajeVisible = true;
    },
    enviarMensaje() {
      console.log(
        `Mensaje a ${this.destinatario}: Título: ${this.mensajeTitulo} - ${this.mensaje}`
      );
      this.mensajeVisible = false;
      this.mensaje = "";
      this.mensajeTitulo = "";
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.chip-active {
  background-color: #ffd600 !important; /* amarillo fuerte */
  color: black !important; /* para que el texto sea legible */
  font-weight: bold;
}

.order-list {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  overflow-x: hidden;
}

.fill-height {
  height: 100%;
}

.orders-container {
  padding: 0 16px 16px 16px;
  overflow-x: visible;
  width: 100%;
}

.date-group {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
}

.filter-select {
  max-width: 180px;
}

.date-header {
  font-weight: 500;
  font-size: 16px;
  background-color: white;
}

.date-tag {
  font-size: 12px;
  color: #757575;
}

.order-item {
  width: 100%;
}

.order-content {
  display: flex;
  padding: 16px;
  width: 100%;
  flex-wrap: wrap;
}

.order-left {
  flex: 1;
  min-width: 200px;
  padding-right: 16px;
  margin-bottom: 16px;
}

.order-center {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 16px;
}

.order-right {
  flex: 1;
  min-width: 200px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
}

.order-number {
  color: #2e7d32;
  margin-bottom: 8px;
}

.order-location {
  margin-bottom: 8px;
}

.product-description {
  margin-bottom: 4px;
}

.customer-name {
  font-weight: 500;
  margin-bottom: 10px;
}

.message-btn-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.send-message-btn {
  text-transform: none;
  letter-spacing: 0;
}

.view-order-btn {
  text-transform: none;
  letter-spacing: 0;
  margin-bottom: 8px;
}

.status-btn {
  text-transform: none;
  letter-spacing: 0;
  color: #558b2f;
  background-color: #f1f8e9;
}

@media (min-width: 960px) {
  .orders-container {
    padding: 0 24px 24px 24px;
  }

  .order-content {
    flex-wrap: nowrap;
  }

  .order-left,
  .order-center,
  .order-right {
    margin-bottom: 0;
  }

  .order-center {
    text-align: center;
  }

  .view-order-btn {
    margin-bottom: 0;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .orders-container {
    padding: 0 20px 20px 20px;
  }

  .order-content {
    flex-wrap: wrap;
  }

  .order-left {
    flex: 0 0 45%;
  }

  .order-center {
    flex: 0 0 45%;
    text-align: right;
    align-items: flex-end;
  }

  .order-right {
    flex: 0 0 100%;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .view-order-btn,
  .status-btn {
    margin-bottom: 0;
  }
}

@media (max-width: 599px) {
  .orders-container {
    padding: 0 12px 12px 12px;
  }

  .order-content {
    flex-wrap: wrap;
    flex-direction: column;
  }

  .order-left,
  .order-center,
  .order-right {
    flex: 0 0 100%;
    min-width: 100%;
    text-align: center;
    align-items: center;
    justify-content: center;
  }

  .order-left {
    margin-bottom: 16px;
  }

  .order-center {
    margin-bottom: 16px;
  }

  .order-right {
    flex-direction: column;
    width: 100%;
  }

  .view-order-btn,
  .status-btn {
    width: 100%;
    margin-right: 0 !important;
  }

  .view-order-btn {
    margin-bottom: 8px;
  }
}
</style>
