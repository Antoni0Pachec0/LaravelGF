<template><v-app>
  <v-container class="pa-0">
    <!-- Barra de navegación superior con selector de tipo -->
    <v-app-bar flat color="#f8f9fa" height="60">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            class="text-none d-flex align-center"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon left>{{ catalogTypeIcon }}</v-icon>
            {{ catalogType }}
            <v-icon small right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="setCatalogType('Productos')">
            <v-icon>
              <v-icon>mdi-package-variant-closed</v-icon>
            </v-icon>
            <v-list-item-title>Productos</v-list-item-title>
          </v-list-item>
          <v-list-item @click="setCatalogType('Ofertas')">
            <v-icon>
              <v-icon>mdi-tag-multiple</v-icon>
            </v-icon>
            <v-list-item-title>Ofertas</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-card class="mx-auto my-4" max-width="900px" elevation="1">
      <v-card-text class="text-center py-8">
        <h1 class="text-h4 font-weight-medium mb-8">
          Agrega el nuevo catálogo de {{ catalogType.toLowerCase() }}
        </h1>

        <!-- Área de arrastrar y soltar -->
        <v-card
          class="upload-area mx-auto mb-4"
          outlined
          height="200"
          max-width="550px"
          :class="{ 'upload-active': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleFileDrop"
          @click="triggerFileInput"
        >
          <v-card-text
            class="d-flex flex-column align-center justify-center fill-height"
          >
            <v-icon size="70" :color="isDragging ? 'success' : 'grey darken-2'">
              {{
                fileSelected ? "mdi-file-pdf-box" : "mdi-file-upload-outline"
              }}
            </v-icon>
            <h3 class="text-h6 font-weight-medium mt-3">
              {{
                fileSelected ? selectedFile.name : "Arrastrar y soltar archivo"
              }}
            </h3>
            <p class="text-subtitle-2 grey--text mt-2">
              {{
                fileSelected
                  ? `Tamaño: ${formatFileSize(selectedFile.size)}`
                  : "O busca en tus archivos"
              }}
            </p>
            <v-chip v-if="fileError" color="error" class="mt-2" small>
              {{ fileError }}
            </v-chip>
          </v-card-text>
        </v-card>

        <!-- Botón principal -->
        <v-btn
          color="success"
          width="220"
          height="50"
          class="white--text font-weight-medium"
          @click="fileSelected ? uploadFile() : triggerFileInput()"
          :disabled="fileSelected && fileError"
        >
          {{
            fileSelected && !fileError ? "Subir catálogo" : "Explorar Archivos"
          }}
        </v-btn>

        <!-- Input de archivo oculto -->
        <input
          ref="fileInput"
          type="file"
          accept=".pdf"
          style="display: none"
          @change="handleFileSelected"
        />
      </v-card-text>
    </v-card>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="successDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5"> Catálogo subido con éxito </v-card-title>
        <v-card-text>
          <p>
            El catálogo de {{ catalogType.toLowerCase() }} ha sido cargado
            correctamente.
          </p>
          <v-list class="success-list">
            <v-list-item>
              <v-icon>
                <v-icon color="success">mdi-check</v-icon>
              </v-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  selectedFile ? selectedFile.name : ""
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-icon>
                <v-icon color="success">{{ catalogTypeIcon }}</v-icon>
              </v-icon>
              <v-list-item-content>
                <v-list-item-title>Tipo: {{ catalogType }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="successDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "CatalogoUploader",
  layout: "admin",
  head() {
    return {
      title: "Catálogos - Administrador",
      meta: [{ name: "catalogos", content: "Administrador" }],
    };
  },
  data() {
    return {
      isDragging: false,
      fileSelected: false,
      selectedFile: null,
      fileError: "",
      successDialog: false,
      catalogType: "Productos",
    };
  },
  computed: {
    catalogTypeIcon() {
      return this.catalogType === "Productos"
        ? "mdi-package-variant-closed"
        : "mdi-tag-multiple";
    },
  },
  methods: {
    setCatalogType(type) {
      this.catalogType = type;
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        this.validateAndSetFile(file);
      }
    },

    handleFileDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file) {
        this.validateAndSetFile(file);
      }
    },

    validateAndSetFile(file) {
      // Verificar si es un PDF
      if (file.type !== "application/pdf") {
        this.fileError = "Solo se permiten archivos PDF";
        this.fileSelected = true;
        this.selectedFile = file;
        return;
      }

      this.fileError = "";
      this.fileSelected = true;
      this.selectedFile = file;
    },

    formatFileSize(bytes) {
      if (bytes < 1024) {
        return bytes + " bytes";
      } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
      } else {
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
      }
    },

    uploadFile() {
      // Simulación de carga exitosa
      setTimeout(() => {
        this.successDialog = true;
        // Reiniciar estado después de subir
        this.resetForm();
      }, 1000);
    },

    resetForm() {
      this.isDragging = false;
      this.fileSelected = false;
      this.selectedFile = null;
      this.fileError = "";
      this.$refs.fileInput.value = "";
    },
  },
};
</script>

<style scoped>
.upload-area {
  cursor: pointer;
  border: 2px dashed #e0e0e0;
  transition: all 0.2s ease;
}
.upload-area:hover {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}
.upload-active {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
}

/* Mejora del diseño del v-list en el diálogo */
.success-list {
  padding: 0;
  margin-top: 16px;
}
.success-list .v-list-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 0;
}
.success-list .v-list-item:last-of-type {
  border-bottom: none;
}
</style>
