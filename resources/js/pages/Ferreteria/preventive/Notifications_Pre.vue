<template><v-app>
  <div class="notifications-container">
    <v-card class="notifications-card">
      <v-list>
        <div
          v-for="(noti, index) in notificaciones"
          :key="index"
          class="notification-item"
        >
          <div class="d-flex justify-space-between align-center">
            <span class="notification-title">{{ noti.titulo }}</span>
            <small class="text-muted">{{ noti.fecha }}</small>
          </div>
          <p class="notification-text">{{ noti.mensaje }}</p>
          <v-divider v-if="index !== notificaciones.length - 1"></v-divider>
        </div>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  layout: "preventista",
  head() {
    return {
      title: "Notificaciones - Preventista",
      meta: [{ name: "notificaciones", content: "Preventista" }],
    };
  },
  data() {
    return {
      notificaciones: [
        {
          titulo: "📢 Oferta especial en Estuche con 50 cuchillas SKA",
          mensaje:
            "Precio público: $125 | Precio Mayoreo: $90.52. ¡Aprovecha la promoción esta semana!",
          fecha: "01/03",
        },
        {
          titulo: "🔄 Reposición de stock: Martillo de uña",
          mensaje:
            "Clave: H-UÑA-16 | Código: 100102. ¡Ya está disponible nuevamente en tienda!",
          fecha: "02/03",
        },
        {
          titulo: "⚡ Descuento en Destornilladores de punta plana",
          mensaje:
            "Clave: DST-PLANA-6 | Código: 100103. Obtén un 15% de descuento en tu compra.",
          fecha: "03/03",
        },
        {
          titulo: "🚀 Últimas piezas disponibles: Llave ajustable 10”",
          mensaje:
            "Clave: LLAVE-AJ-10 | Código: 100104. ¡Solo quedan 5 unidades en stock!",
          fecha: "04/03",
        },
        {
          titulo: "🛠️ Nueva herramienta en catálogo: Serrucho profesional",
          mensaje:
            "Clave: SERR-PRO-12 | Código: 100105. ¡Ya disponible en nuestra tienda! Revisa las especificaciones y precios en nuestro catálogo.",
          fecha: "05/03",
        },
        {
          titulo: "🎯 Promoción en taladros industriales",
          mensaje:
            "Clave: TAL-IND-20 | Código: 100106. ¡Descuento del 20% esta semana!",
          fecha: "06/03",
        },
      ],
    };
  },
};
</script>

<style scoped>
.notifications-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f3f3f3;
}

.notifications-card {
  width: 100%;
  max-width: 750px !important;
  background: white;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 960px) {
  .notifications-card {
    max-width: 90%;
  }
}

@media (max-width: 600px) {
  .notifications-card {
    max-width: 95%;
  }
}

.text-muted {
  color: #757575;
}

.notification-item {
  padding: 12px 16px;
  min-height: 80px;
  background-color: white;
}

.notification-title {
  font-size: 16px;
  font-weight: bold;
}

.notification-text {
  font-size: 14px;
}

.v-divider {
  margin: 0;
}
</style>
