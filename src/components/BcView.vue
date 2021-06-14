<template>
  <div>
    <button class="k-button" @click="toggleDialog">
      {{ visible ? "Fermer" : "Afficher" }} metadonnées
    </button>
    <window
      v-if="visible"
      :title="'Metadonnées record'"
      :height="400"
      :modal="true"
      @close="toggleDialog"
      @move="handleMove"
    >
      <ul class="metadataUl">
        <li
          class="metadataLi"
          v-for="(canal, index) in this.datasource"
          :key="index"
          @click="emitMetaData(index)"
        >
          {{ canal.BcUmid }} -- {{ canal.BcTitle }} -- {{ canal.SerieId }}
        </li>
      </ul>
    </window>
  </div>
</template>

<script>
import { Window } from "@progress/kendo-vue-dialogs";
import kendo from "@progress/kendo-ui/js/kendo.window"; //eslint-disable-line
import $ from "jquery"; //eslint-disable-line
import "../styles/bc.css";

import * as metadataService from "../services/metadataApi";

export default {
  name: "BcView",
  components: {
    Window: Window,
  },
  data() {
    return {
      visible: false,
      datasource: [],
    };
  },
  methods: {
    toggleDialog() {
      this.visible = !this.visible;
    },
    handleMove(event) {
      this.left = event.left;
      this.top = event.top;
    },
    emitMetaData(indice) {
      this.visible = !this.visible;
      return this.$emit("get-metadata-record", {
        metaData: this.datasource[indice],
      });
    },
  },
  mounted() {
    metadataService.retrieve().then((response) => {
      this.datasource = response.mediaRequests;
    });
  },
};
</script>
