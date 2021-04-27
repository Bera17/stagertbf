<template>
  <kendo-schedulerdatasource
    ref="remoteDataSource"
    :batch="true"
    transport-read-url="http://localhost:3100/api/records"
    transport-read-data-type="json"
    
    transport-create-url="http://localhost:3100/api/records"
    transport-create-type="POST"
    transport-create-data-type="json"

    transport-update-url="http://localhost:3100/api/records"
    transport-update-type="PUT"
    transport-update-data-type="json"
    
    transport-destroy-url="http://localhost:3100/api/records"
    transport-destroy-type="DELETE"
		transport-destroy-data-type="json"
    
    :transport-parameter-map="parameterMap"
    schema-data="records"
    schema-model-id="recordId"
    :schema-model-fields="fields"
    schema-timezone="Europe/Brussels"
  >
  </kendo-schedulerdatasource>

  <kendo-scheduler
    ref="scheduler"
    data-source-ref="remoteDataSource"
    :group="{ resources: ['Canaux'] }"
    :snap="false"
    :toolbar="['search']"
    :selectable="true"
    :footer="false"
    :mobile="true"
    :editable-template="editTemplate"
    @edit="onEdit"
    @save="onSave"
  >
    <kendo-scheduler-resource
      :field="'canalId'"
      :name="'Canaux'"
      :title="'Canal'"
      :data-source="arrayCanaux"
    >
    </kendo-scheduler-resource>

    <kendo-scheduler-view
      :type="'timeline'"
      :group="{ orientation: 'vertical' }"
      :selected="true"
      :event-template="eventTimelineDayTemplate"
      :major-tick="20"
      :column-width="15"
      :majorTimeHeaderTemplate="majorTimeHeaderTemplateTimelineDay"
    ></kendo-scheduler-view>
    <kendo-scheduler-view
      :type="'timelineWeek'"
      :group="{ orientation: 'vertical' }"
      :event-template="eventTimelineWeekTemplate"
      :column-width="60"
      :majorTimeHeaderTemplate="majorTimeHeaderTemplateTimelineWeek"
    ></kendo-scheduler-view>
    <kendo-scheduler-view
      :type="'timelineMonth'"
      :group="{ orientation: 'vertical' }"
    ></kendo-scheduler-view>
  </kendo-scheduler>
</template>

<script>
import $ from "jquery"; //eslint-disable-line
import kendo from "@progress/kendo-ui/js/kendo.scheduler";
import {
  Scheduler,
  SchedulerView,
  SchedulerResource,
} from "@progress/kendo-scheduler-vue-wrapper";
import { KendoSchedulerDataSource } from "@progress/kendo-datasource-vue-wrapper";
import "@progress/kendo-ui/js/kendo.combobox.js"; //eslint-disable-line

import "@progress/kendo-ui/js/messages/kendo.messages.fr-BE";
import "@progress/kendo-ui/js/cultures/kendo.culture.fr-BE";
import "@progress/kendo-ui/js/kendo.timezones"

export default {
  name: "HelloWorld",
  components: {
    "kendo-scheduler": Scheduler,
    "kendo-scheduler-view": SchedulerView,
    "kendo-scheduler-resource": SchedulerResource,
    "kendo-schedulerdatasource": KendoSchedulerDataSource, //eslint-disable-line
  },
  props: {
    msg: String,
  },
  methods: {
    parameterMap: function (data, operation) {
      console.log("ParameterMap operation " + operation);
      if (operation !== "read") {
        //
        return { models: kendo.stringify(data) };
      }
    },
    onEdit: function () {
      console.log("Event :: change");
      this.initSelectCanaux();
      this.initSelectRestrictions();
      this.initSelectBcTypes();
      this.initSelectPads();
      this.initSelectAssets();
      this.initSelectSeries();
    },
    initSelectCanaux: function () {
      kendo.jQuery("#canaux").kendoComboBox({
        placeholder: "Selectionner canal",
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
          data: this.arrayCanaux,
        },
      });
    },
    initSelectRestrictions: function () {
      kendo.jQuery("#restrictions").kendoComboBox({
        placeholder: "Selectionner restriction",
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
          data: this.arrayRestrictions,
        },
      });
    },
    initSelectBcTypes: function () {
      kendo.jQuery("#bcTypes").kendoComboBox({
        placeholder: "Selectionner bc type",
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
          data: this.arrayBcTypes,
        },
      });
    },
    initSelectPads: function () {
      kendo.jQuery("#pads").kendoComboBox({
        placeholder: "Selectionner pad",
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
          data: this.arrayPads,
        },
      });
    },
    initSelectAssets: function () {
      kendo.jQuery("#assets").kendoComboBox({
        placeholder: "Selectionner asset",
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
          data: this.arrayAssets,
        },
      });
    },
    initSelectSeries: function () {
      kendo.jQuery("#series").kendoComboBox({
        placeholder: "Selectionner serie",
        dataTextField: "text",
        dataValueField: "value",
        dataSource: {
          data: this.arraySeries,
        },
      });
    },
    onSave: function () {
      console.log("Event :: save");
    },
    onCreate: function () {
      console.log("function onCreate");
    },
    mainForm: function () {
      return `
      <h2>
        <strong> Etat : <input name="etat" disabled data-bind="value:etat" /> </strong>
        <strong> Avancement : <input name="avancement" disabled data-bind="value:avancement" />% </strong>
      </h2>
      <div name="main">
      <h3>Main</h3>
          <div class="k-edit-label"><label for="titre">Titre</label></div>
          <div data-container-for="titre" class="k-edit-field">
            <input type="text" class="k-textbox" name="titre" required="required" data-bind="value:titre">
          </div>
        <div class="k-edit-label"> <label for="start">Start</label> </div>
        <div data-container-for="start" class="k-edit-field">
          <input type="text"
                data-role="datetimepicker"
                data-interval="15"
                data-type="date"
                data-bind="value:start,invisible:isAllDay"
                data-component-type="modern"
                name="start"/>
          <input type="text" 
                data-type="date" 
                data-role="datepicker" 
                data-bind="value:start,visible:isAllDay"
                name="start" />
          <span data-for="start" class="k-invalid-msg" style="display: none;"></span>
        </div>
        <div class="k-edit-label"><label for="end">End</label></div>
        <div data-container-for="end" class="k-edit-field">
          <input type="text" 
                data-type="date" 
                data-role="datetimepicker" 
                data-interval="15"
                data-bind="value:end,invisible:isAllDay"
                data-component-type="modern"
                name="end"
                data-datecompare-msg="La date de fin doit etre plus grande ou égale que la date de début" />
          <input type="text" 
                data-type="date" 
                data-role="datepicker" 
                data-bind="value:end,visible:isAllDay" 
                name="end" 
                data-datecompare-msg="La date de fin doit etre plus grande ou égale que la date de début" />
          <span data-bind="text: startTimezone, invisible: endTimezone"></span>
          <span data-for="end" class="k-invalid-msg" style="display: none;"></span>
        </div>

        <div class="k-edit-label"><label for="recurrenceRule">Repeter</label></div>
        <div data-container-for="recurrenceRule" class="k-edit-field">
          <div name="recurrenceRule"
                data-bind="value:recurrenceRule"  
                data-role="recurrenceeditor" >
          </div>
        </div>
        
        <div class="k-edit-label"><label for="encodingUnit">Canaux </label></div>
        <div data-container-for="encondingUnit" class="k-edit-field">
          <input id="canaux" name="canalid" data-bind="value:canalId" style="width:100%;" />
        </div>
      </div>
        `;
    },
    sourceDestForm: function () {
      return `
        
        <div name="destinationSource">
        <h3>Destination - Source</h3>
            <div class="k-edit-label"><label for="source">Source</label></div>
            <div data-container-for="source" class="k-edit-field">
              <input type="text" class="k-textbox" name="source" data-bind="value:source">
            </div>
            <div class="k-edit-label"><label for="typeSource">Type Source</label></div>
            <div data-container-for="typeSource" class="k-edit-field">
              <table id="typeSources"> 
                <thead>
                  <tr>
                    <th> <label for="labelAdobe"> Vers adobe </lable></th>
                    <th> <label for="labelWeb"> Pour web </lable> </th>
                    <th> <label for="labelAvid"> Vers Avid </lable> </th>
                    <th> <label for="labelArchive"> Pour archive </lable></th>
                    <th> <label for="labelDiffusion"> Vers diffusion </lable></th>
                  </tr>
                </thead>
                <tbody>
                  <tr> 
                    <td> <input type="checkbox" data-type="boolean" data-bind="checked:isAdobe" name="adobe" id="labelAdobe" /> </td>
                    <td> <input type="checkbox" data-bind="checked:isWeb" name="web" id="labelWeb" /> </td>
                    <td> <input type="checkbox" data-bind="checked:isAvid" name="avid" id="labelAvid" /> </td>
                    <td> <input type="checkbox" data-bind="checked:isArchive" name="archive" id="labelArchive" /> </td>
                    <td> <input type="checkbox" data-bind="checked:isDiffusion" name="diffusion" id="labelDiffusion" /> </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
      `;
    },
    restrictionForm: function () {
      return `
        
        <div name="restrictions">
        <h3>Restriction</h3>
          <div class="k-edit-label"><label for="restrictions">Restrictions</label></div>
          <div data-container-for="restrictions" class="k-edit-field">
            <input id="restrictions" name="restrictionId" data-bind="value:restrictionId" />
          </div>
          <div class="k-edit-label"><label for="descrRestriction">Restriction</label></div>
          <div data-container-for="descrRestriction" class="k-edit-field">
            <input type="text" class="k-textbox" name="restriction" data-bind="value:restriction">
          </div>
        </div>
      `;
    },
    infoMedia: function () {
      return (
        `
        <div name="infoMedia">
        <h3>Info Media</h3>
          ` +
        this.bcType() +
        `
          <div class="k-edit-label"><label for="purge">Purge</label></div>
          <div data-container-for="purge" class="k-edit-field">
            <input type="text"
                  data-role="datetimepicker"
                  data-interval="15"
                  data-type="date"
                  data-bind="value:purgeDate"
                  data-culture="fr-BE"
                  data-format="dd/MM/yyyy HH:mm"
                  data-component-type="modern"
                  name="purgeDate" />
            <span data-bind="text: startTimezone"></span>
            <span data-for="purge" class="k-invalid-msg" style="display: none;"></span>
          </div>
          <div class="k-edit-label"><label for="validPAD">Validation PAD</label></div>
          <div data-container-for="validPAD" class="k-edit-field">
            <input id="pads" name="padId" data-bind="value:padId" />
          </div>
          <div class="k-edit-label"><label for="natureAsset">Nature Asset</label></div>
          <div data-container-for="natureAsset" class="k-edit-field">
            <input id="assets" name="assetId" data-bind="value:asset" />
          </div>
          <div class="k-edit-label"><label for="demandeur">Demandeur</label></div>
          <div data-container-for="demandeur" class="k-edit-field">
            <input type="text" class="k-textbox" name="demandeur" data-bind="value:demandeur">
          </div>

          <div class="k-edit-label"><label for="serie">Serie</label></div>
          <div data-container-for="serie" class="k-edit-field">
            <input id="series" name="serieId" data-bind="value:serieId" />
          </div>

          <div class="k-edit-label"><label for="commentaire">Commentaire</label></div>
          <div data-container-for="commentaire" class="k-edit-field">
            <input type="text" class="k-textbox" name="commentaire" data-bind="value:commentaire">
          </div>
        </div>
      `
      );
    },
    bcType: function () {
      return `
          <div class="k-edit-label"><label for="bcTypes">Bc Types</label></div>
          <div data-container-for="bcTypes" class="k-edit-field">
            <input id="bcTypes" name="bcTypeId" data-bind="value:bcTypeId" />
          </div>
          <div class="k-edit-label"><label for="bcUmid">BC UMID</label></div>
          <div data-container-for="bcUmid" class="k-edit-field">
            <input type="text" class="k-textbox" name="bcUmid" data-bind="value:bcUmid">
          </div>
          <div class="k-edit-label"><label for="bcTitle">BC Titre</label></div>
          <div data-container-for="bcTitle" class="k-edit-field">
            <input type="text" class="k-textbox" name="bcTitle" data-bind="value:bcTitle">
          </div>
          <div class="k-edit-label"><label for="bcMemo">BC Memo</label></div>
          <div data-container-for="bcMemo" class="k-edit-field">
            <input type="text" class="k-textbox" name="bcMemo" data-bind="value:bcMemo">
          </div>
      `;
    },
    metaEdit: function () {
      return `
        <div name="metaEdit">
          <h3> Metadonees Editoriales </h3>
          <div class="k-edit-label"><label for="resume">Resume</label></div>
          <div data-container-for="resume" class="k-edit-field">
            <input type="text" class="k-textbox" name="resume" data-bind="value:resume">
          </div>
        </div>
      `;
    },
    editTemplate: function () {
      return (
        this.mainForm() +
        this.sourceDestForm() +
        this.restrictionForm() +
        this.infoMedia() +
        this.metaEdit()
      );
    },
  },
  data() {
    let kendoDate = kendo.date.today();
    let arrayCanaux = [];
    for (let i = 0; i < 15; i++) {
      arrayCanaux[i] = { text: "A-NOC-" + i + "", value: i };
    }
    let arrayRestrictions = [];
    for (let i = 0; i < 3; i++) {
      arrayRestrictions[i] = { text: "Restriction " + i + "", value: i };
    }
    let arrayBcTypes = [];
    for (let i = 0; i < 3; i++) {
      arrayBcTypes[i] = { text: "BcType " + i + "", value: i };
    }
    let arrayPads = [];
    for (let i = 0; i < 3; i++) {
      arrayPads[i] = { text: "Pad " + i + "", value: i };
    }
    let arrayAssets = [];
    for (let i = 0; i < 3; i++) {
      arrayAssets[i] = { text: "Asset " + i + "", value: i };
    }
    let arraySeries = [];
    for (let i = 0; i < 3; i++) {
      arraySeries[i] = { text: "Serie " + i + "", value: i };
    }
    let majorTimeHeaderTemplateTimelineDay = kendo.template(
      `<strong style="font-size:9px">
              #=kendo.toString(date, 'H:mm')# 
              #var d=kendo.toString(date, 'mm'); midMinute= kendo.parseInt(d)+10#
              <p class="midMinutes"> #= midMinute # </p> 
            </strong>`
    );
    let majorTimeHeaderTemplateTimelineWeek = kendo.template(
      `<strong style="font-size:14px">
              #=kendo.toString(date, 'HH:mm')#
              #var d=kendo.toString(date, 'H'); midMinute= kendo.parseInt(d)+1#
              <p class="midHours"> #=midMinute#:00 </p> 
            </strong>`
    );
    let eventTimelineDayTemplate = `<div class="recordDayTemplate"> 
                          #: kendo.toString(start, "hh:mm") # -
                          #: kendo.toString(end, "hh:mm")# ~
                          #: avancement #% ~
                          #: titre #
                        </div>`;
    let eventTimelineWeekTemplate = `<div class="recordWeekTemplate">
                          #: avancement #% ~
                          #: titre  #
                         </div>`;

    return {
      kendoDate,
      arrayCanaux,
      arrayRestrictions,
      arrayBcTypes,
      arrayPads,
      arrayAssets,
      arraySeries,
      majorTimeHeaderTemplateTimelineDay,
      majorTimeHeaderTemplateTimelineWeek,
      eventTimelineDayTemplate,
      eventTimelineWeekTemplate,
      fields: {
        recordId: { from: "recordId", type: "number" },
        etat: { from: "etat", defaultValue: "Création" },
        avancement: { from: "avancement", defaultValue: "0" },
        titre: {
          from: "titre",
          defaultValue: "No titre ",
          validation: { required: true },
        },
        start: { type: "date", from: "start" },
        end: { type: "date", from: "end" },
        recurrenceId: { from: "RecurrenceID" },
        recurrenceRule: { from: "RecurrenceRule" },
        recurrenceException: { from: "RecurrenceException" },
        canalId: { from: "canalId" },
        source: { from: "Source" },
        isAdobe: { type: "boolean", from: "IsAdobe" },
        isWeb: { type: "boolean", from: "IsWeb" },
        isAvide: { type: "boolean", from: "IsAvide" },
        isArchive: { type: "boolean", from: "IsArchive" },
        isDiffusion: { type: "boolean", from: "IsDiffusion" },
        restrictionId: { from: "RestrictionId" },
        descrRestriction: { from: "DescrRestriction" },
        bcTypeId: { from: "BcTypeId" },
        bcUmid: { from: "BcUmid" },
        bcTitle: { from: "BcTitle" },
        bcMemo: { from: "BcMemo" },
        purgeDate: { type: "date", from: "PurgeDate" },
        padId: { from: "PadId" },
        asset: { from: "Asset" },
        demandeur: { from: "Demandeur" },
        serieId: { from: "SerieId" },
        commentaire: { from: "Commentaire" },
        resume: { from: "Resume" },
      },
    };
  },
  mounted() {
    var isMobile = Boolean(kendo.support.mobileOS);
    if (isMobile) {
      this.$refs.scheduler.kendoWidget().resize();
    }
    //
    kendo.culture("fr-BE");
  },
};
</script>

<style>
div.k-widget.k-window {
  /* toute la fenetre du formulaire */
  width: auto !important;
  max-height: 80%;
  top: 6.2% !important;
}

div[name="recurrenceRule"] {
  /* depassement des options de recurrences */
  overflow-x: auto;
}

.k-widget.k-combobox.k-combobox-clearable {
  padding-left: 0px;
  width: auto !important;
}

.k-event {
  /* les enregistrements programmés dans le scheduler */
  height: fit-content !important;
  max-height: 50px;
}

.k-edit-field {
  text-align: left;
}

div.k-recur-view {
  /* dans le formulaire, les champs qui apparaissent lors du choix de la recurrence */
  font-style: italic;
}

#typeSources {
  /* le champ type Source dans le formulaire */
  border-collapse: collapse;
  text-align: center !important;
}
#typeSources > thead th {
  border-right: 1px solid black;
  padding-right: 3px !important;
  padding-left: 3px !important;
}

.k-edit-label {
  overflow-wrap: break-word;
}

.k-scheduler-content {
  overflow: auto;
}

.k-scheduler-timelineview
  > tbody
  > tr:first-child
  > td:last-child
  .k-scheduler-table
  > tbody
  > tr:nth-child(2)
  th {
  /* chaque case des minutes du header */
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 2px;
  padding-top: 2px;
}

table.k-scheduler-layout.k-scheduler-timelineview
  > tbody
  > tr:nth-child(1)
  > td:nth-child(1)
  table[class="k-scheduler-table"]
  > tbody
  > tr:nth-child(2) {
  /* vue web, rangé+colonne blanche vide qui prennent de la place pour rien */
  display: none;
}

/* table.k-scheduler-layout.k-scheduler-timelineview
  > tbody
  > tr:nth-child(1)
  > td:nth-child(2)
  table[class="k-scheduler-table"]
  > tbody
  .k-scheduler-date-group {
  header qui affiche la date d'ajrd'hui => ne sert a rien pour la vue timelineday
  display: none;
} */

/* tr[class="k-mobile-header k-mobile-vertical-header"]
  table[class="k-scheduler-table"]
  > tbody
  > tr:nth-child(1) {
  vue mobile, rangé blanche vide qui prend de la place pour rien
  display: none;
} */

.recordDayTemplate,
.recordWeekTemplate {
  /* dans le scheduler, les blocs des enregistrements programmés */
  font-size: 10px;
}
.midMinutes {
  /* vue timelineDay, dans le header du scheduler, les minutes intermediaires (10,30,50) */
  font-size: 8px;
  font-weight: 200;
  margin-top: auto;
  margin-bottom: auto;
}

.midHours {
  /* vue timelineWeek, dans le header du scheduler, les heures intermediaires */
  font-size: 10px;
  font-weight: 200;
  margin-top: auto;
  margin-bottom: auto;
}

div[name="recurrenceRule"] > div > span {
  overflow: visible !important;
}

@media (min-width: 330px) and (max-width: 640px) {
  table[class="k-scheduler-layout k-scheduler-timelineview"]
    > tbody
    > tr:nth-child(2)
    > td:nth-child(2)
    .k-scheduler-table
    > tbody
    tr
    td {
    /* vue timelineDay, chaque case du scheduler */
    height: 33px !important;
  }

  table.k-scheduler-layout.k-scheduler-timelineview
    > tbody
    > tr:nth-child(2)
    > td:nth-child(1)
    .k-scheduler-table
    > tbody
    > tr
    th {
    /* vue timelineDay, chaque case des canaux */
    padding-left: 2px;
    padding-right: 2px;
    padding-top: 2px;
    padding-bottom: 1px;
  }

  table.k-scheduler-layout.k-scheduler-timelineview
    > tbody
    > tr:nth-child(2)
    > td:nth-child(1)
    .k-scheduler-table
    > tbody
    > tr
    th
    span {
    height: 41px !important;
    white-space: normal;
    overflow-wrap: break-word;
    font-size: 10px;
  }

  table.k-scheduler-layout.k-scheduler-timelineWeekview
    > tbody
    > tr:nth-child(2)
    > td:nth-child(1)
    .k-scheduler-table
    > tbody
    tr
    th {
    /* vue timelineWeek, chaque case des canaux */
    padding-left: 2px;
    padding-right: 2px;
    padding-top: 2px;
    padding-bottom: 1px;
  }

  table.k-scheduler-layout.k-scheduler-timelineWeekview
    > tbody
    > tr:nth-child(2)
    > td:nth-child(1)
    .k-scheduler-table
    > tbody
    > tr
    th
    span {
    /* vue timelineWeek, chaque case des canaux */
    height: 40px !important;
    white-space: normal;
    overflow-wrap: break-word;
    font-size: 10px;
  }

  table.k-scheduler-layout.k-scheduler-timelineWeekview
    > tbody
    > tr:nth-child(2)
    > td:nth-child(2)
    .k-scheduler-table
    > tbody
    > tr
    td {
    /* vue timelineWeek, chaque case du scheduler */
    /* height: 45px; */
  }

  /* Formulaire > */

  .k-edit-field,
  .k-textbox,
  .k-combobox {
    float: left !important;
    padding-left: 10px;
  }

  span[class="k-widget k-datetimepicker"] {
    width: auto !important;
    float: left;
  }
}

@media (min-width: 641px) and (max-width: 1366px) {
  table.k-scheduler-layout.k-scheduler-timelineview
    > tbody
    > tr:nth-child(2)
    > td:nth-child(1)
    .k-scheduler-table
    > tbody
    > tr
    th {
    /* chaque case des canaux */
    padding-left: 2px;
    padding-right: 2px;
    padding-top: 2px;
    padding-bottom: 1px;
  }

  table.k-scheduler-layout.k-scheduler-timelineview
    > tbody
    > tr:nth-child(2)
    > td:nth-child(1)
    .k-scheduler-table
    > tbody
    > tr
    th
    span {
    /* vue timeline, chaque case des canaux */
    height: 36px !important;
    white-space: normal;
    overflow-wrap: break-word;
    font-size: 10px;
  }

  table.k-scheduler-layout.k-scheduler-timelineWeekview
    > tbody
    > tr:nth-child(2)
    > td:nth-child(1)
    .k-scheduler-table
    > tbody
    tr
    th {
    /* vue timelineWeek, chaque case des canaux */
    padding-left: 2px;
    padding-right: 1px;
    padding-top: 2px;
    padding-bottom: 1px;
  }

  table.k-scheduler-layout.k-scheduler-timelineWeekview
    > tbody
    > tr:nth-child(2)
    > td:nth-child(1)
    .k-scheduler-table
    > tbody
    > tr
    th
    span {
    /* vue timelineWeek, chaque case des canaux */
    height: 45px !important;
    white-space: normal;
    overflow-wrap: break-word;
    font-size: 10px;
  }

  table.k-scheduler-layout.k-scheduler-timelineWeekview
    > tbody
    > tr:nth-child(2)
    > td:nth-child(2)
    .k-scheduler-table
    > tbody
    > tr
    td {
    /* vue timelineWeek, chaque case du scheduler */
    /* height: 50px; */
  }

  /* Formulaire > */
  .k-edit-field,
  .k-textbox,
  .k-combobox {
    float: left !important;
    padding-left: 10px;
  }
  .k-recur-view > .k-edit-field {
    width: auto !important;
  }
  span[class="k-widget k-datetimepicker"] {
    width: auto !important;
    float: left;
  }
}

@media (min-width: 1367px) {
  table.k-scheduler-layout.k-scheduler-timelineview
    > tbody
    > tr:nth-child(2)
    > td:nth-child(1)
    table[class="k-scheduler-table"]
    > tbody
    tr
    th {
    /* vue web, chaque case des canaux */
    white-space: normal;
    overflow-wrap: break-word;
    min-width: 80px;
    text-align: center;

    padding-left: 2px;
    padding-right: 2px;
    padding-top: 2px;
    padding-bottom: 1px;
  }

  /* Formulaire  */
  h3 {
    float: left;
    border-bottom: ridge;
  }
}
</style>
