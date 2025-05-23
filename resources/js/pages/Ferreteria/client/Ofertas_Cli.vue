<template><v-app>
  <v-container fluid class="fill-height">
    <div id="pdf-viewer" class="pdf-viewer"></div>
  </v-container>
</template>

<script>
import PDFObject from "pdfobject";

export default {
  mounted() {
    this.loadPdf();
  },
  methods: {
    loadPdf() {
      const fileURL = "https://catalgo-forpa.s3.us-east-1.amazonaws.com/catalogo.pdf";
      if (this.isMobile()) {
        window.location.href = fileURL;
      } else {
        PDFObject.embed(fileURL, "#pdf-viewer");
      }
    },
    isMobile() {
      return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
}
.pdf-viewer {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
}
</style>
