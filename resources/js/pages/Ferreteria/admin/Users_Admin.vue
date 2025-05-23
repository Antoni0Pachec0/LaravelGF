<template><v-app>
  <v-container fluid class="pa-4">
    <v-row class="mb-6">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="text-h5 font-weight-medium">Agrega nuevos usuarios</h1>
        <v-btn
          color="success"
          class="white--text px-4"
          @click="openAddUserDialog"
        >
          <v-icon left>mdi-account-plus</v-icon>
          Añadir usuario
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="usuario in usuarios"
        :key="usuario.id_usuario"
        cols="12"
        sm="6"
        md="4"
        lg="4"
        class="py-1"
      >
        <v-card
          outlined
          class="user-card"
          style="border-radius: 5px; border-left: 10px solid #4caf50"
        >
          <v-card-text class="py-4 px-4">
            <div class="d-flex align-center">
              <v-avatar
                color="#4CAF50"
                size="40"
                class="white--text font-weight-bold"
              >
                {{ getInitials(usuario.nombre) }}
              </v-avatar>
              <div class="ml-4">
                <div class="font-weight-medium">
                  {{ usuario.nombre }} {{ usuario.apellido_p }}
                </div>
                <div class="d-flex align-center mt-1">
                  <v-icon small class="mr-1">mdi-phone</v-icon>
                  <span>{{ usuario.numero_cel }}</span>
                </div>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                icon
                color="error"
                class="mx-1"
                @click="confirmEliminarUsuario(usuario.id_usuario)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn
                icon
                color="success"
                class="mx-1"
                @click="editarUsuario(usuario)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="headline font-weight-bold">
          {{ formTitle }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="guardarUsuario">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.nombre"
                    label="Nombre"
                    required
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.apellido_p"
                    label="Apellido Paterno"
                    required
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.apellido_m"
                    label="Apellido Materno"
                    required
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.numero_cel"
                    label="Número Celular"
                    :rules="[
                      (v) =>
                        /^\d{10}$/.test(v) ||
                        'Debe ser un número de 10 dígitos',
                    ]"
                    maxlength="10"
                    required
                    type="tel"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.password_user"
                    :type="showPassword ? 'text' : 'password'"
                    label="Contraseña"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPassword = !showPassword"
                    :rules="[(v) => !!v || 'Campo requerido']"
                    required
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    :items="tipoUsuarios"
                    v-model="editedItem.tipo_usuario"
                    label="Tipo de Usuario"
                    required
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    :items="localidades"
                    v-model="editedItem.id_localidad"
                    label="Localidad"
                    item-text="nombre"
                    item-value="id"
                    required
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.direccion"
                    label="Dirección"
                    required
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="editedItem.curp" label="CURP" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="editedItem.clave" label="Clave" />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cerrarDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="guardarUsuario">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      usuarios: [],
      dialog: false,
      editedItem: {},
      showPassword: false,
      tipoUsuarios: ["cliente", "admin", "empleado"],
      localidades: [
        { id: 1, nombre: "El Salado" },
        { id: 2, nombre: "Tecamachalco" },
        { id: 3, nombre: "El Laurel" },
        { id: 4, nombre: "Alseseca" },
        { id: 5, nombre: "Xochimilco" },
        { id: 6, nombre: "Zozutla" },
        { id: 7, nombre: "Yehualtepec" },
        { id: 8, nombre: "Nazareno" },
        { id: 9, nombre: "Xaltepec" },
        { id: 10, nombre: "Ocotlan" },
        { id: 11, nombre: "La Purisima" },
        { id: 12, nombre: "Palmar de Bravo" },
        { id: 13, nombre: "Cuacnopalan" },
        { id: 14, nombre: "San Mateo" },
        { id: 15, nombre: "Vergel" },
        { id: 16, nombre: "San Juan" },
        { id: 17, nombre: "Santa Rosa" },
        { id: 18, nombre: "Huixcolotla" },
        { id: 19, nombre: "San Martin Caltenco" },
        { id: 20, nombre: "Tochtepec" },
        { id: 21, nombre: "Quecholac" },
        { id: 22, nombre: "Tenango" },
        { id: 23, nombre: "San Simon de Bravo" },
        { id: 24, nombre: "Compañia" },
        { id: 25, nombre: "Acatzingo" },
      ],
    };
  },
  computed: {
    formTitle() {
      return this.editedItem.id_usuario ? "Editar Usuario" : "Nuevo Usuario";
    },
  },
  methods: {
    async fetchUsuarios() {
      try {
        const allUsers = await this.$api.getClientes();
        const currentUserId = parseInt(
          localStorage.getItem("userId") || sessionStorage.getItem("userId")
        );
        this.usuarios = allUsers.filter((u) => u.id_usuario !== currentUserId);
      } catch (e) {
        console.error("Error cargando usuarios", e);
      }
    },
    openAddUserDialog() {
      this.editedItem = {};
      this.dialog = true;
    },
    editarUsuario(usuario) {
      this.editedItem = { ...usuario, password_user: "" }; // limpiamos la contraseña
      this.dialog = true;
    },
    cerrarDialog() {
      this.dialog = false;
      this.editedItem = {};
      this.showPassword = false;
    },
    async guardarUsuario() {
      try {
        if (this.editedItem.id_usuario) {
          await this.$axios.$put(
            `/clientes/update/${this.editedItem.id_usuario}`,
            this.editedItem
          );
        } else {
          await this.$axios.$post("/clientes/register", this.editedItem);
        }
        await this.fetchUsuarios();
        this.cerrarDialog();
      } catch (e) {
        console.error("Error guardando usuario", e);
      }
    },
    confirmEliminarUsuario(id) {
      if (confirm("¿Estás seguro de eliminar este usuario?")) {
        this.eliminarUsuario(id);
      }
    },
    async eliminarUsuario(id) {
      try {
        await this.$axios.$delete(`/clientes/delete/${id}`);
        await this.fetchUsuarios();
      } catch (e) {
        console.error("Error eliminando usuario", e);
      }
    },
    getInitials(nombre) {
      return nombre
        ? nombre
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
        : "";
    },
  },
  mounted() {
    this.fetchUsuarios();
  },
};
</script>

<style scoped>
.user-card {
  transition: all 0.2s;
  background-color: white;
}

.v-btn:hover {
  opacity: 0.9;
}
</style>
