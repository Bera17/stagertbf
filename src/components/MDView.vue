<template>
    <window
        id="windowMD"
        :width="'300px'"
        :title="'Window title'"
        style="display:none;"
        :actions="actions"
        :content="{
            url: 'http://localhost:3100/api/metadata',
            dataType: 'json',
            iframe: false,
            template: `
              <ul>
                # for (let i=0; i < data.mediaRequests.length; i++){ #
                    <li class='listMD' style='padding-bottom:5px;'> 
                      #= data.mediaRequests[i].BcUmid # - 
                      #= data.mediaRequests[i].BcTitle # - 
                      #= data.mediaRequests[i].SerieId #
                    </li>
                # } # 
              </ul>`
        }"   
    >
    </window>
    <span class="k-button" @click="onClick">Afficher meta données</span>
</template>


<script>
import * as metadataService from "../services/metadataApi";//eslint-disable-line
import kendo from "@progress/kendo-ui/js/kendo.window"; //eslint-disable-line
import $ from "jquery"; //eslint-disable-line

import '@progress/kendo-ui/js/kendo.window'
import { Window } from '@progress/kendo-window-vue-wrapper'

function testFunction(data){ //eslint-disable-line
    console.log("static function", data);
}
export default {
  name: "MDView",
  emits: ["get-metadata-record"],
  components: {
      "window": Window
  },
  data() {
    return {
      dataSource: [],
      actions: ['Minimize','Close'],
      visible: false,
      left: 300,
      top: 250,
      windowTemplate: `
              <ul>
                # for (let i=0; i < data.mediaRequests.length; i++){ #
                    <li style='padding-bottom:5px;' onclick='#=getTest(data.mediaRequests[i])#' > 
                      #= data.mediaRequests[i].BcUmid # - 
                      #= data.mediaRequests[i].BcTitle # - 
                      #= data.mediaRequests[i].SerieId #
                    </li>
                # } # 
              </ul>`,
      windowsTemplateWithEventListener:`
              <ul>
                # for (let i=0; i < data.mediaRequests.length; i++){ #
                    <li class='listMD' id='#= data.mediaRequests[i].BcUmid #' style='padding-bottom:5px;'> 
                      #= data.mediaRequests[i].BcUmid # - 
                      #= data.mediaRequests[i].BcTitle # - 
                      #= data.mediaRequests[i].SerieId #
                    </li>
                # } # 
              </ul>`,
              testFunction
      
    };
  },
  methods: {
    onClick: function () {
			var window = kendo.jQuery("#windowMD").data().kendoWindow

      //### Technique EventListener
      // document.querySelectorAll('.listMD').forEach(item => {
      //   item.addEventListener('click', event => {
      //     this.emitMetaData(event);


      //   })
      // })
      // window.refresh({
      //   content: this.windowTemplate
      // })
			window.center().open();
      //console.log(this.datasource[0].BcTitle);
	},
    emitMetaData: function(e) {
        console.log(e);
      // return this.$emit("get-metadata-record", {
      //   metaData: this.datasource[0].BcTitle,
      // });
    },
  },
  mounted(){
    metadataService.retrieve().then((response) =>{
      this.dataSource = response.mediaRequests;
    });
  }
}
</script>