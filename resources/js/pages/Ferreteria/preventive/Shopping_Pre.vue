<template><v-app>
  <v-container fluid class="fondo">
    <v-row no-gutters>
      <v-col cols="12" class="productos-wrapper d-flex flex-wrap">
        <v-chip-group
          active-class="verde white--text"
          class="d-flex flex-wrap justify-center"
        >
          <v-chip
            v-for="(marca, i) in marcas"
            :key="i"
            @click="filtrarMarca(marca)"
            class="chip-filtro"
          >
            {{ marca }}
          </v-chip>
        </v-chip-group>
      </v-col>

      <v-col cols="12" class="pedidos-sidebar pr-3 pl-3">
        <v-card
          class="productos-container pa-3"
          style="max-height: 75vh; overflow-y: auto"
        >
          <div class="productos-scroll">
            <v-card
              v-for="(producto, index) in productosFiltrados"
              :key="index"
              class="producto-card d-flex flex-column pa-3"
            >
              <div class="decoracion-verde"></div>
              <v-row
                class="producto-info ml-5 align-center"
                @click="toggleDetalles(index)"
              >
                <v-col cols="10">
                  <strong>{{ producto.nombre }}</strong>
                  <p>
                    <span class="verde--text font-weight-bold">Marca:</span>
                    {{ producto.marca }} &nbsp;
                    <span class="verde--text font-weight-bold">Clave:</span>
                    {{ producto.clave }} &nbsp;
                    <span class="verde--text font-weight-bold">Código:</span>
                    {{ producto.codigo }}
                  </p>
                </v-col>
                <v-col cols="2" class="d-flex align-center justify-end">
                  <v-btn
                    icon
                    class="boton-azul"
                    @click.stop="agregarACarrito(producto)"
                  >
                    <v-icon class="white--text">mdi-plus</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    class="boton-azul ml-2"
                    @click.stop="toggleDetalles(index)"
                  >
                    <v-icon class="white--text">{{
                      producto.mostrarDetalles
                        ? "mdi-chevron-up"
                        : "mdi-chevron-down"
                    }}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-expand-transition>
                <div
                  v-if="producto.mostrarDetalles"
                  class="producto-detalle pa-0"
                >
                  <v-row class="ma-0 pa-0 pl-10 align-start">
                    <v-col cols="6" class="detalle-col">
                      <p>
                        <span class="verde--text font-weight-bold"
                          >Descripción:</span
                        >
                        {{ producto.descripcion }}
                      </p>
                      <p>
                        <span class="verde--text font-weight-bold"
                          >Precio público:</span
                        >
                        {{ producto.precio }}
                      </p>
                      <p>
                        <span class="verde--text font-weight-bold"
                          >Precio Mayoreo:</span
                        >
                        {{ producto.precioMayoreo }}
                      </p>
                      <p>
                        <span class="verde--text font-weight-bold">Clave:</span>
                        {{ producto.clave }}
                      </p>
                    </v-col>
                    <v-col cols="6" class="detalle-col">
                      <p>
                        <span class="verde--text font-weight-bold">Marca:</span>
                        {{ producto.marca }}
                      </p>
                      <p>
                        <span class="verde--text font-weight-bold"
                          >Código:</span
                        >
                        {{ producto.codigo }}
                      </p>
                      <p>
                        <span class="verde--text font-weight-bold">Peso:</span>
                        <strong>{{ producto.peso }}</strong>
                      </p>
                      <p>
                        <span class="verde--text font-weight-bold"
                          >Unidad:</span
                        >
                        <strong>{{ producto.unidad }}</strong>
                      </p>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>
            </v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botón inferior para móviles -->
    <v-btn class="boton-inferior-movil" @click="dialog = true">
      Ver Pedidos
    </v-btn>

    <!-- Modal de pedidos -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="font-weight-bold">Mis Pedidos</v-card-title>
        <v-card-text style="max-height: 60vh; overflow-y: auto">
          <div
            v-for="(item, index) in carrito"
            :key="index"
            class="pedido-item"
          >
            <v-divider></v-divider>
            <strong class="mb-2 d-block">{{ item.nombre }}</strong>
            <v-row align="center" class="cantidad-container mt-2">
              <div class="cantidad-wrapper">
                <v-btn
                  icon
                  class="cantidad-btn-outline"
                  @click="modificarCantidad(index, -1)"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <v-text-field
                  v-model="item.cantidad"
                  class="cantidad-box"
                  dense
                  solo
                  hide-details
                  background-color="transparent"
                  flat
                ></v-text-field>
                <v-btn
                  icon
                  class="cantidad-btn-outline"
                  @click="modificarCantidad(index, 1)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
              <span class="precio-dinamico font-weight-bold"
                >${{ (item.precio * item.cantidad).toFixed(2) }}</span
              >
            </v-row>
            <p class="disponibles">+50 disponibles</p>
            <v-btn
              small
              class="eliminar-btn"
              @click="modificarCantidad(index, -item.cantidad)"
              >Eliminar</v-btn
            >
          </div>
          <v-divider class="mt-3"></v-divider>
          <div class="total-container mt-5">
            <h3 class="font-weight-bold">Total</h3>
            <span class="font-weight-bold precio"
              >${{ totalCarrito.toFixed(2) }}</span
            >
          </div>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-row>
            <v-col cols="6">
              <v-btn block class="encargar-btn" @click="dialog = false"
                >Cerrar</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn block class="encargar-btn">Encargar</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  name: "Clientes - Preventista",
  layout: "preventista",
  head() {
    return {
      title: "Compras - Preventista",
      meta: [{ name: "compras", content: "Preventista" }],
    };
  },
  data() {
    return {
      dialog: false, // Controla la visibilidad del modal
      marcas: [
        "Todo",
        "Truper",
        "Expert",
        "Hermex",
        "Fiero",
        "Foset",
        "Klintek",
        "Pretul",
        "Ultracraft",
        "Volteck",
      ],
      productos: [
        {
          nombre: "Estuche con 50 cuchillas SKA",
          marca: "Truper",
          clave: "REP-CUT-650",
          codigo: "100101",
          precio: 125.0,
          precioMayoreo: 90.52,
          peso: "0.368",
          unidad: "Set",
          descripcion:
            "Estuche con 50 cuchillas SK4 de 18 mm para cutter, Truper.",
          mostrarDetalles: false,
        },
        {
          nombre: "Martillo de uña",
          marca: "Truper",
          clave: "H-UÑA-16",
          codigo: "100102",
          precio: 250.0,
          precioMayoreo: 200.0,
          peso: "0.500",
          unidad: "Pieza",
          descripcion:
            "Martillo de uña de acero forjado con mango de fibra de vidrio.",
          mostrarDetalles: false,
        },
        {
          nombre: "Destornillador de punta plana",
          marca: "Expert",
          clave: "DST-PLANA-6",
          codigo: "100103",
          precio: 80.0,
          precioMayoreo: 65.0,
          peso: "0.250",
          unidad: "Pieza",
          descripcion:
            "Destornillador de punta plana de 6 pulgadas con mango ergonómico.",
          mostrarDetalles: false,
        },
        {
          nombre: "Llave ajustable 10”",
          marca: "Truper",
          clave: "LLAVE-AJ-10",
          codigo: "100104",
          precio: 150.0,
          precioMayoreo: 120.0,
          peso: "0.750",
          unidad: "Pieza",
          descripcion: "Llave ajustable de 10 pulgadas en acero forjado.",
          mostrarDetalles: false,
        },
        {
          nombre: "Cinta métrica de 5m",
          marca: "Pretul",
          clave: "CINTA-MET-5M",
          codigo: "100105",
          precio: 95.0,
          precioMayoreo: 75.0,
          peso: "0.350",
          unidad: "Pieza",
          descripcion:
            "Cinta métrica de 5 metros con carcasa de plástico resistente.",
          mostrarDetalles: false,
        },
        {
          nombre: "Flexómetro de 8m",
          marca: "Fiero",
          clave: "FLEX-8M",
          codigo: "100106",
          precio: 180.0,
          precioMayoreo: 140.0,
          peso: "0.450",
          unidad: "Pieza",
          descripcion:
            "Flexómetro de 8 metros con gancho magnético y cinta reforzada.",
          mostrarDetalles: false,
        },
        {
          nombre: "Pinza de corte diagonal 6”",
          marca: "Volteck",
          clave: "PINZA-CORTE-6",
          codigo: "100107",
          precio: 130.0,
          precioMayoreo: 100.0,
          peso: "0.400",
          unidad: "Pieza",
          descripcion:
            "Pinza de corte diagonal de 6 pulgadas en acero al cromo-vanadio.",
          mostrarDetalles: false,
        },
      ],
      marcaSeleccionada: "Todo",
      carrito: [],
    };
  },
  computed: {
    productosFiltrados() {
      return this.marcaSeleccionada === "Todo"
        ? this.productos
        : this.productos.filter((p) => p.marca === this.marcaSeleccionada);
    },
    totalCarrito() {
      return this.carrito.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
      );
    },
  },
  methods: {
    filtrarMarca(marca) {
      this.marcaSeleccionada = marca;
    },
    toggleDetalles(index) {
      this.productos[index].mostrarDetalles =
        !this.productos[index].mostrarDetalles;
    },
    agregarACarrito(producto) {
      const existe = this.carrito.find((p) => p.clave === producto.clave);
      if (existe) {
        existe.cantidad++;
      } else {
        this.carrito.push({ ...producto, cantidad: 1 });
      }
    },
    modificarCantidad(index, cantidad) {
      this.carrito[index].cantidad += cantidad;
      if (this.carrito[index].cantidad <= 0) this.carrito.splice(index, 1);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/home.scss";
</style>
