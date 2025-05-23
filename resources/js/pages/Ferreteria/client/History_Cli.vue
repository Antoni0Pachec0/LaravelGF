<template><v-app>
  <v-app>
    <v-container fluid class="pa-0" style="background-color: #f3f3f3">
      <!-- Filtro de pedidos -->
      <v-row align="center" class="px-4 py-2">
        <v-col cols="12" sm="6" class="d-flex align-center">
          <v-icon left>mdi-tune-variant</v-icon>
          <select v-model="selectedFilter" class="custom-select">
            <option v-for="(f, i) in filters" :key="i" :value="f.value">
              {{ f.text }}
            </option>
          </select>
          <v-icon right>mdi-menu-down</v-icon>
          <v-divider vertical class="mx-4" />
          <span class="order-count">{{ sortedPurchases.length }} compras</span>
        </v-col>
      </v-row>

      <!-- Tarjetas de pedidos -->
      <v-row class="px-4">
        <v-col
          v-for="order in sortedPurchases"
          :key="order.id_pedido"
          cols="12"
        >
          <v-card
            outlined
            class="order-card"
            @click="viewOrder(order, false)"
            style="cursor: pointer"
          >
            <v-row class="px-4 pt-3 pb-1 align-center justify-space-between">
              <v-col cols="12" md="6" class="d-flex align-center">
                <span class="order-date">
                  Realizado: {{ formatDate(order.fecha_levantamiento_pedido) }}
                </span>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="text-md-right text-left mt-2 mt-md-0"
              >
                <v-chip
                  :color="statusColor(order.estado)"
                  text-color="white"
                  class="font-weight-bold"
                >
                  {{ capitalize(order.estado) }}
                </v-chip>
              </v-col>
            </v-row>

            <v-divider class="my-2" />

            <v-row class="px-4">
              <v-col cols="12" md="6">
                <div><strong>Dirección:</strong> {{ order.direccion }}</div>
                <div>
                  <strong>Método de pago:</strong> {{ order.metodo_de_pago }}
                </div>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="text-md-right text-left mt-2 mt-md-0"
              >
                <span class="text-h6 font-weight-bold text--primary">
                  Total: ${{ formatCurrency(order.total) }}
                </span>
              </v-col>
            </v-row>

            <!-- Botones (solo visibles al pasar el cursor) -->
            <v-row class="px-4 pt-2 pb-2 d-flex justify-end align-center">
              <v-btn
                small
                color="#247323"
                dark
                @click.stop="viewOrder(order, true)"
                v-if="order.estado.toLowerCase() === 'enviado'"
              >
                <v-icon left small>mdi-pencil</v-icon> Editar
              </v-btn>
              <v-btn
                small
                color="red darken-1"
                dark
                class="ml-2"
                @click.stop="deleteFullOrder(order.id_pedido)"
                v-if="order.estado.toLowerCase() === 'enviado'"
              >
                <v-icon left small>mdi-delete</v-icon> Eliminar
              </v-btn>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <!-- Modal de productos -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title class="modal-header d-flex align-center">
            Productos del pedido
            <v-spacer />
            <v-btn
              icon
              small
              v-if="
                selectedOrder &&
                selectedOrder.estado.toLowerCase() === 'enviado'
              "
              @click="toggleEdit"
            >
              <v-icon>{{
                isEditing ? "mdi-close-circle" : "mdi-pencil"
              }}</v-icon>
            </v-btn>
            <v-btn icon @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-divider />

          <v-card-text style="max-height: 400px; overflow-y: auto">
            <v-list two-line>
              <v-list-item
                v-for="p in activeProducts"
                :key="p.id_producto"
                class="striped d-flex align-center"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ p.descripcion }}</v-list-item-title>
                  <v-list-item-subtitle class="d-flex align-center">
                    <span class="label">Cant:</span>
                    <v-text-field
                      v-if="isEditing"
                      v-model.number="p.cantidad"
                      type="number"
                      dense
                      class="qty-input mx-2"
                      @change="recalcTotal"
                    />
                    <span v-else>{{ p.cantidad }}</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                    >Precio: ${{
                      formatCurrency(p.precio_unitario)
                    }}</v-list-item-subtitle
                  >
                </v-list-item-content>

                <v-btn
                  icon
                  color="red"
                  v-if="isEditing"
                  @click="deleteProduct(p.id_producto)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              color="red"
              v-if="isEditing"
              @click="deleteFullOrder(selectedOrder.id_pedido)"
            >
              Eliminar Pedido
            </v-btn>
            <v-btn text v-if="isEditing" @click="closeDialog">Cancelar</v-btn>
            <v-btn color="primary" v-if="isEditing" @click="saveChanges"
              >Guardar</v-btn
            >
            <v-btn text v-else @click="closeDialog">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "HistoryCli",
  data() {
    return {
      selectedFilter: "Todas",
      filters: [
        { text: "Todas", value: "Todas" },
        { text: "Entregado", value: "Entregado" },
        { text: "Pendiente", value: "Pendiente" },
        { text: "Enviado", value: "Enviado" },
        { text: "Cancelado", value: "Cancelado" },
      ],
      purchases: [],
      dialog: false,
      isEditing: false,
      activeProducts: [],
      selectedOrder: null,
    };
  },
  computed: {
    sortedPurchases() {
      const list =
        this.selectedFilter === "Todas"
          ? this.purchases
          : this.purchases.filter((o) => o.estado === this.selectedFilter);
      return [...list].sort(
        (a, b) =>
          new Date(b.fecha_levantamiento_pedido) -
          new Date(a.fecha_levantamiento_pedido)
      );
    },
  },
  mounted() {
    const id = localStorage.getItem("userId");
    if (id) this.fetchPurchases(id);
  },
  methods: {
    fetchPurchases(id) {
      this.$api
        .getUserOrders(id)
        .then((r) => (this.purchases = r))
        .catch(console.error);
    },
    formatDate(d) {
      return new Date(d).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    formatCurrency(v) {
      return Number(v || 0).toFixed(2);
    },
    statusColor(e) {
      switch (e.toLowerCase()) {
        case "entregado":
          return "green darken-2";
        case "pendiente":
          return "amber lighten-1";
        case "enviado":
          return "blue lighten-1";
        case "cancelado":
          return "red darken-2";
        default:
          return "grey lighten-1";
      }
    },
    capitalize(s) {
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    },
    viewOrder(o, edit) {
      this.selectedOrder = o;
      this.isEditing = edit;
      this.dialog = true;
      this.$api
        .getOrderProducts(o.id_pedido)
        .then(
          (ps) =>
            (this.activeProducts = edit ? JSON.parse(JSON.stringify(ps)) : ps)
        )
        .catch(console.error);
    },
    closeDialog() {
      this.dialog = false;
      this.isEditing = false;
      this.activeProducts = [];
      this.selectedOrder = null;
    },
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    recalcTotal() {
      let t = 0;
      this.activeProducts.forEach((p) => (t += p.cantidad * p.precio_unitario));
      if (this.selectedOrder) this.selectedOrder.total = t;
    },
    async saveChanges() {
      if (!this.selectedOrder) return;

      try {
        await this.$api.editProducts(this.selectedOrder.id_pedido, {
          productos: this.activeProducts,
        });

        // Actualizar total manualmente desde frontend
        let nuevoTotal = 0;
        this.activeProducts.forEach(
          (p) => (nuevoTotal += p.cantidad * p.precio_unitario)
        );
        this.selectedOrder.total = nuevoTotal;

        // Actualizar en la base de datos también
        await this.$api.editOrderDetails(this.selectedOrder.id_pedido, {
          estado: this.selectedOrder.estado,
          total: nuevoTotal,
          metodo_de_pago: this.selectedOrder.metodo_de_pago,
          fecha_entrega_estimada: this.selectedOrder.fecha_entrega_estimada,
          direccion: this.selectedOrder.direccion,
        });

        await this.fetchPurchases(localStorage.getItem("userId"));
        this.closeDialog(); // Ahora sí cierra correctamente
      } catch (e) {
        console.error(e);
      }
    },

    async deleteFullOrder(id) {
      if (!confirm("¿Eliminar este pedido?")) return;
      try {
        await this.$api.deleteOrder(id);
        await this.fetchPurchases(localStorage.getItem("userId"));
        this.closeDialog();
      } catch (e) {
        console.error(e);
      }
    },
    async deleteProduct(id) {
      if (!confirm("¿Eliminar producto?")) return;
      try {
        await this.$api.deleteProductFromOrder(
          this.selectedOrder.id_pedido,
          id
        );
        this.activeProducts = this.activeProducts.filter(
          (p) => p.id_producto !== id
        );
        this.recalcTotal();
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style scoped>
.order-card {
  border-radius: 12px;
  background-color: #ffffff;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
  padding-top: 0px;
  padding-bottom: 12px;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-btn {
  min-width: 110px;
  font-size: 13px;
}

.order-date {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
}

.v-chip {
  border-radius: 12px;
  font-size: 14px;
  padding: 0 12px;
}

.v-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.text--primary {
  color: #247323 !important;
}

@media (max-width: 768px) {
  .order-date {
    font-size: 15px;
  }
}

.v-container {
  background-color: #f3f3f3;
  padding-top: 20px;
  min-height: 100vh;
}

/* Filtro */
.custom-select {
  width: 200px;
  padding: 8px 32px 8px 12px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 14px;
  color: #444;
  background-color: white;
  appearance: none;
  background-image: none;
}

.order-count {
  font-size: 14px;
  color: #555;
  margin-left: 8px;
}

/* Tarjeta de pedido */
.order-card {
  border-radius: 12px;
  background-color: #ffffff;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
  padding-top: 16px;
  padding-bottom: 16px;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title-text {
  font-size: 18px;
  color: #247323;
  margin-bottom: 0;
}

.delivery-text {
  font-weight: bold;
  color: #2c3e50;
  font-size: 16px;
}

.text--primary {
  color: #247323 !important;
}

/* Sección de acciones */
.gap-3 {
  gap: 12px;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.3px;
  border-radius: 8px;
}

/* Modal */
.modal-header {
  font-weight: bold;
  font-size: 18px;
  color: #2c3e50;
}

.qty-input {
  max-width: 70px;
  margin-left: 8px;
}

/* Lista de productos */
.striped:nth-child(odd) {
  background-color: #fafafa;
}

.striped:nth-child(even) {
  background-color: #fff;
}

.label {
  font-weight: 600;
  margin-right: 6px;
  color: #247323;
}

/* Responsivo */
@media (max-width: 600px) {
  .custom-select {
    width: 100%;
    margin-top: 8px;
  }

  .title-text,
  .delivery-text {
    font-size: 16px;
    text-align: left;
  }

  .gap-3 {
    flex-direction: column;
    gap: 8px !important;
  }

  .v-col.text-right {
    text-align: left !important;
    margin-top: 8px;
  }
}
</style>
