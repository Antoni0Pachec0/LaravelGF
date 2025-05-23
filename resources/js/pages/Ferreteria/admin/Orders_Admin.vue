<template><v-app>
  <v-container fluid class="fondo">
    <v-row no-gutters>
      <!-- Chips de marca -->
      <v-col cols="12" class="productos-wrapper d-flex flex-wrap">
        <v-chip-group
          active-class="verde white--text"
          class="d-flex flex-wrap justify-center"
        >
          <v-chip
            v-for="(marca, i) in marcas"
            :key="i"
            @click="filtrarMarca(marca)"
            :class="{ 'chip-selected': marca === marcaSeleccionada }"
            class="chip-filtro"
          >
            {{ marca }}
          </v-chip>
        </v-chip-group>
      </v-col>

      <!-- Productos -->
      <v-col cols="12" class="pedidos-sidebar pr-3 pl-3">
        <v-card
          class="productos-container pa-3"
          style="max-height: 75vh; overflow-y: auto"
        >
          <div class="productos-scroll" ref="productosScroll">
            <v-card
              v-for="(producto, index) in productos"
              :key="producto.id_producto || index"
              class="producto-card d-flex flex-column pa-3"
            >
              <div class="decoracion-verde"></div>
              <v-row class="producto-info ml-5 align-center">
                <v-col cols="11" @click="toggleDetalles(index)">
                  <strong>{{ producto.descripcion }}</strong>
                  <p>
                    <span class="verde--text font-weight-bold">Marca:</span>
                    {{ producto.marca }}
                    &nbsp;
                    <span class="verde--text font-weight-bold">Clave:</span>
                    {{ producto.clave }}
                    &nbsp;
                    <span class="verde--text font-weight-bold">Código:</span>
                    {{ producto.codigo }}
                  </p>
                </v-col>
                <v-col cols="1" class="d-flex align-center justify-end">
                  <v-btn
                    icon
                    class="boton-azul"
                    @click.stop="toggleDetalles(index)"
                  >
                    <v-icon class="white--text">
                      {{
                        producto.mostrarDetalles
                          ? "mdi-chevron-up"
                          : "mdi-chevron-down"
                      }}
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-expand-transition>
                <div
                  v-if="producto.mostrarDetalles"
                  class="producto-detalle pa-0"
                >
                  <v-row class="ma-0 pa-0 pl-10 align-start">
                    <v-col cols="6">
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
                        ${{ producto.precio_publico_con_IVA }}
                      </p>
                      <p>
                        <span class="verde--text font-weight-bold"
                          >Precio Mayoreo:</span
                        >
                        ${{ producto.precio_mayoreo_con_IVA }}
                      </p>
                      <p>
                        <span class="verde--text font-weight-bold">Clave:</span>
                        {{ producto.clave }}
                      </p>
                    </v-col>
                    <v-col cols="6">
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
                        {{ producto.peso_kg }}
                      </p>
                      <p>
                        <span class="verde--text font-weight-bold"
                          >Unidad:</span
                        >
                        {{ producto.unidad }}
                      </p>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>
            </v-card>

            <div v-if="productos.length === 0" class="text-center py-4">
              <span>No se encontraron productos</span>
            </div>
          </div>

          <!-- Paginación -->
          <v-row justify="center" align="center" class="mt-4">
            <v-btn
              icon
              @click="paginaActual > 1 && cambiarPagina(paginaActual - 1)"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <div
              class="d-flex align-center justify-center"
              style="min-width: 80px"
            >
              <v-text-field
                v-model.number="paginaActual"
                type="number"
                class="mx-2 text-center"
                style="max-width: 80px"
                @keyup.enter="cambiarPagina(paginaActual)"
                @blur="cambiarPagina(paginaActual)"
              />
              <span>/ {{ totalPaginas }}</span>
            </div>
            <v-btn
              icon
              @click="
                paginaActual < totalPaginas && cambiarPagina(paginaActual + 1)
              "
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "VistaProductosAdmin",
  layout: "admin",
  data() {
    return {
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
      productos: [],
      marcaSeleccionada: "Todo",
      paginaActual: 1,
      totalPaginas: 1,
    };
  },
  methods: {
    filtrarMarca(marca) {
      this.marcaSeleccionada = marca;
      this.paginaActual = 1;
      this.obtenerProductos();
      this.$nextTick(() => {
        if (this.$refs.productosScroll) {
          this.$refs.productosScroll.scrollTop = 0;
        }
      });
    },
    toggleDetalles(index) {
      this.$set(
        this.productos[index],
        "mostrarDetalles",
        !this.productos[index].mostrarDetalles
      );
    },
    async obtenerProductos() {
      try {
        let res;
        if (this.marcaSeleccionada === "Todo") {
          res = await this.$api.getProductos({
            page: this.paginaActual,
            limit: 50,
          });
        } else {
          res = await this.$api.searchProductos(this.marcaSeleccionada, {
            page: this.paginaActual,
            limit: 50,
          });
        }
        this.productos = res.data.map((p) => ({
          ...p,
          mostrarDetalles: false,
        }));
        const limit = res.limit || 50;
        this.totalPaginas = Math.ceil(res.total / limit);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    },
    cambiarPagina(pagina) {
      if (pagina < 1 || pagina > this.totalPaginas) return;
      this.paginaActual = pagina;
      this.obtenerProductos();
    },
  },
  mounted() {
    this.obtenerProductos();
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/home.scss";
</style>
