<template>
  <div>
    <button class="k-button" @click="toggleDialog">
      {{ visible ? "Close" : "Open" }} Window
    </button>
    <window
      v-if="visible"
      :title="'Metadonnées record'"
      :left="left"
      :top="top"
      :height="400"
      :modal="true"
      @close="toggleDialog"
      @move="handleMove"
    >
      <button
        v-for="(canal, index) in this.datasource"
        :key="index"
        @click="emitMetaData(index)"
      >
        {{ canal.text }}
      </button>
    </window>
  </div>
</template>

<script>
import { Window } from "@progress/kendo-vue-dialogs";
import kendo from "@progress/kendo-ui/js/kendo.window"; //eslint-disable-line
import $ from "jquery"; //eslint-disable-line

import * as canauxService from "../services/canauxApi";

export default {
  name: "BcView",
  components: {
    Window: Window,
  },
  data() {
    return {
      visible: false,
      left: 300,
      top: 250,
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
    canauxService.retrieve().then((response) => {
      this.datasource = response.map((canal) => {
        return {
          text: canal.nom,
          value: canal.canalId,
          type: canal.type,
          visible: canal.visible,
        };
      });
    });
  },
};
</script>

<style></style>
