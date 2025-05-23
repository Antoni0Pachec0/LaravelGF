<template>
  <v-app>
    <v-container fluid class="pa-0 fill-height d-flex align-center justify-center">
      <!-- Barra lateral -->
      <div class="sidebar d-none d-md-block"></div>

      <v-row class="fill-height" no-gutters>
        <!-- Login -->
        <v-col cols="12" md="6" class="d-flex align-center justify-center pa-6">
          <v-card max-width="400" class="pa-6">
            <v-img
              src="/img/Logo_GrupoForpa.png"
              height="180"
              class="mb-4"
              contain
            />
            <h2 class="text-center mb-2">¡Bienvenido!</h2>
            <p class="text-center mb-4">Ingresa tus datos para acceder.</p>

            <v-form ref="loginForm" v-model="valid">
              <v-text-field
                v-model="phoneNumber"
                label="Número de teléfono"
                type="tel"
                :rules="phoneRules"
                maxlength="10"
                dense
                outlined
                class="mb-3"
                @input="handlePhoneNumberInput"
              />

              <v-text-field
                v-model="password"
                :type="passwordVisible ? 'text' : 'password'"
                label="Contraseña"
                :rules="passwordRules"
                dense
                outlined
                class="mb-3"
                append-icon="mdi-eye"
                @click:append="togglePasswordVisibility"
              />

              <v-checkbox
                v-model="rememberMe"
                label="Recordar esta sesión"
                class="mb-4"
              />

              <v-btn
                color="#118737"
                block
                type="submit"
                :disabled="!valid"
                class="white--text"
              >
                Iniciar sesión
              </v-btn>
            </v-form>

            <v-snackbar v-model="snackbar" color="error" top>
              {{ snackbarMessage }}
              <v-btn color="white" text @click="snackbar = false">Cerrar</v-btn>
            </v-snackbar>
          </v-card>
        </v-col>

        <!-- Carrusel -->
        <v-col
          cols="12"
          md="6"
          class="d-none d-md-flex align-center justify-end pa-0 image-carousel"
        >
          <v-carousel
            v-model="model"
            cycle
            show-arrows
            hide-delimiters
            height="100%"
          >
            <v-carousel-item v-for="(img, i) in images" :key="i">
              <v-img :src="img" cover height="100%" />
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      phoneNumber: '',
      password: '',
      rememberMe: false,
      valid: false,
      passwordVisible: false,
      snackbar: false,
      snackbarMessage: '',
      phoneRules: [
        v => !!v || 'Número de teléfono es requerido',
        v => /^\d{10}$/.test(v) || 'Debe tener 10 dígitos',
      ],
      passwordRules: [
        v => !!v || 'Contraseña es requerida',
        v => v.length >= 6 || 'Mínimo 6 caracteres',
      ],
      model: 0,
      images: [
        '/img/login_imagen1.jpg',
        '/img/login_imagen2.jpg',
        '/img/login_imagen3.jpg',
        '/img/login_imagen4.jpg',
      ],
    };
  },
  methods: {
    handlePhoneNumberInput(value) {
      let input = value.replace(/\D/g, '');
      if (input.length > 10) input = input.slice(0, 10);
      this.phoneNumber = input;
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 100vh;
  background-color: #29235c;
  z-index: 1;
}
.image-carousel {
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  overflow: hidden;
}
.white--text {
  color: #ffffff !important;
}
</style>
