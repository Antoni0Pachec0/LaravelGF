<script setup lang="ts">
import useHomeCli from '@/composables/client/home_cli'

const {
  dialog,
  mostrarPedidos,
  marcas,
  productos,
  carrito,
  marcaSeleccionada,
  paginaActual,
  totalPaginas,
  paginaCarrito,
  totalPaginasCarrito,
  carritoPaginado,
  isMobile,
  inicioCarrito,
  totalCarrito,
  filtrarMarca,
  toggleDetalles,
  agregarACarrito,
  modificarCantidad,
  cambiarPagina,
  cambiarPaginaCarrito,
  encargarPedido
} = useHomeCli()
</script>

<template>
  <div>
    <!-- Layouts condicionales -->

    <!-- Tu contenido principal -->
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
        <v-col
          :cols="isMobile ? 12 : mostrarPedidos ? 8 : 12"
          class="pedidos-sidebar pr-3 pl-3 transition-width"
        >
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
                <v-row
                  class="producto-info ml-5 align-center"
                  @click="toggleDetalles(index)"
                >
                  <v-col cols="10">
                    <strong>{{ producto.descripcion }}</strong>
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

        <!-- Pedidos (solo escritorio) -->
        <v-col
          cols="4"
          v-if="mostrarPedidos && !isMobile"
          class="pedidos-sidebar pr-3 pl-3"
        >
          <v-card
            class="pedidos-card pa-4 d-flex flex-column"
            style="height: 75vh"
          >
            <div style="overflow-y: auto; flex: 1">
              <h2 class="font-weight-bold">Mis Pedidos</h2>
              <div
                v-for="(item, index) in carritoPaginado"
                :key="index"
                class="pedido-item"
              >
                <v-divider></v-divider>
                <strong class="mb-2 d-block">{{ item.descripcion }}</strong>
                <v-row align="center" class="cantidad-container mt-2">
                  <div class="cantidad-wrapper">
                    <v-btn
                      icon
                      class="cantidad-btn-outline"
                      @click="modificarCantidad(index + inicioCarrito, -1)"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <v-text-field
                      v-model="item.cantidad"
                      class="cantidad-box"
                      dense
                      solo
                      hide-details
                      flat
                    />
                    <v-btn
                      icon
                      class="cantidad-btn-outline"
                      @click="modificarCantidad(index + inicioCarrito, 1)"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </div>
                  <span class="precio-dinamico font-weight-bold">
                    ${{
                      (item.precio * item.cantidad).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }}
                  </span>
                </v-row>
                <p class="disponibles">+50 disponibles</p>
                <v-btn
                  small
                  class="eliminar-btn"
                  @click="
                    modificarCantidad(index + inicioCarrito, -item.cantidad)
                  "
                >
                  Eliminar
                </v-btn>
              </div>
            </div>
            <div>
              <v-divider class="my-2"></v-divider>
              <div class="total-container mb-2">
                <h3 class="font-weight-bold">Total</h3>
                <span class="font-weight-bold precio">
                  ${{
                    totalCarrito.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                </span>
              </div>
              <v-row justify="center" align="center">
                <v-btn
                  icon
                  @click="
                    paginaCarrito > 1 && cambiarPaginaCarrito(paginaCarrito - 1)
                  "
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <div
                  class="d-flex align-center justify-center"
                  style="min-width: 80px"
                >
                  <v-text-field
                    v-model.number="paginaCarrito"
                    type="number"
                    class="mx-2 text-center"
                    style="max-width: 80px"
                    @keyup.enter="cambiarPaginaCarrito(paginaCarrito)"
                    @blur="cambiarPaginaCarrito(paginaCarrito)"
                  />
                  <span>/ {{ totalPaginasCarrito }}</span>
                </div>
                <v-btn
                  icon
                  @click="
                    paginaCarrito < totalPaginasCarrito &&
                      cambiarPaginaCarrito(paginaCarrito + 1)
                  "
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-row>
              <v-btn block class="encargar-btn mt-2" @click="encargarPedido">
                Encargar
              </v-btn>
            </div>
          </v-card>
        </v-col>

        <!-- Botón flotante (móvil) -->
        <v-btn
          v-if="mostrarPedidos && isMobile"
          class="boton-inferior-movil"
          @click="dialog = true"
        >
          Ver Pedidos
        </v-btn>

        <!-- Modal (móvil) -->
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
                <strong class="mb-2 d-block">{{ item.descripcion }}</strong>
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
                      flat
                    />
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
                >
                  Eliminar
                </v-btn>
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
                  <v-btn block class="encargar-btn" @click="encargarPedido"
                    >Encargar</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/client/home_cli.scss" as *;
</style>