<template>
  <kendo-schedulerdatasource
    ref="remoteDataSource"
    :batch="true"
    transport-read-url="https://localhost:3100/api/records"
    transport-read-type="GET"
    transport-read-data-type="json"
    transport-create-url="https://localhost:3100/api/records"
    transport-create-type="POST"
    transport-create-data-type="json"
    transport-update-url="https://localhost:3100/api/records"
    transport-update-type="PUT"
    transport-update-data-type="json"
    transport-destroy-url="https://localhost:3100/api/records"
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
    id="scheduler"
    data-source-ref="remoteDataSource"
    :group="{ resources: ['Canaux'] }"
    :snap="false"
    :toolbar="['search']"
    :selectable="true"
    :footer="false"
    :mobile="true"
    :editable-template="recordTemplate"
    @edit="onEdit"
    @save="onSave"
    @cancel="onCancel"
    @move="onMove"
    @add="onAdd"
    @resize="onResize"
    @dataBound="onDataBound"
  >
    <bc-view @get-metadata-record="getMetaData" />
    <kendo-scheduler-resource
      :field="'canalId'"
      :name="'Canaux'"
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
import "../styles/scheduler.css";
import $ from "jquery"; //eslint-disable-line
import kendo from "@progress/kendo-ui/js/kendo.all";

import {
  Scheduler,
  SchedulerView,
  SchedulerResource,
} from "@progress/kendo-scheduler-vue-wrapper";
import { KendoSchedulerDataSource } from "@progress/kendo-datasource-vue-wrapper";
import "@progress/kendo-ui/js/kendo.combobox.js";

import "@progress/kendo-ui/js/messages/kendo.messages.fr-BE";
import "@progress/kendo-ui/js/cultures/kendo.culture.fr-BE";
import "@progress/kendo-ui/js/kendo.timezones";

import * as canauxService from "../services/canauxApi";
import BcViewVue from "./BcView.vue";

export default {
  name: "Scheduler",
  components: {
    "bc-view": BcViewVue, //eslint-disable-line
    "kendo-scheduler": Scheduler,
    "kendo-scheduler-view": SchedulerView,
    "kendo-scheduler-resource": SchedulerResource,
    "kendo-schedulerdatasource": KendoSchedulerDataSource,
  },
  methods: {
    parameterMap: function (data, operation) {
      console.log("ParameterMap operation " + operation);
      // if (operation === "read") {
      //   let scheduler = this.$refs.scheduler.kendoWidget();
      //   return {
      //     currentDay: {
      //       start: scheduler.view().startDate(),
      //     },
      //   };
      // }
      if (operation !== "read") {
        return { models: kendo.stringify(data) };
      }
    },
    scrollToCurrentTime: function () {
      let time = new Date();
      time.setHours(time.getHours() - 2);
      time.setMinutes(0);
      time.setSeconds(0);
      time.setMilliseconds(0);
      let targetTime = kendo.toString(time, "HH:mm");

      let scheduler = this.$refs.scheduler.kendoWidget();
      let contentDiv = scheduler.element.find("div.k-scheduler-content");
      let premiereRangee = contentDiv.find("tr")[0];
      let casesTd = $(premiereRangee).find("td");

      for (let i = 0; i < casesTd.length; i++) {
        let element = $(casesTd[i]);
        let slot = scheduler.slotByElement(element);
        let slotTime = kendo.toString(slot.startDate, "HH:mm");

        if (targetTime === slotTime) {
          contentDiv.scrollLeft(0);
          let elementTop = element.offset().left;
          let containerTop = contentDiv.offset().left;
          contentDiv.scrollLeft(elementTop - containerTop);
        }
      }
    },
    onDataBound: function () {
      this.eventsColor();

      setTimeout(() => this.scrollToCurrentTime(), 1); //lance la fonction trop rapidement donc il faut setTimeout

      this.initContextMenu();
      this.eventListenerViewChanged();
    },
    refreshScheduler: function () {
      let scheduler = this.$refs.scheduler.kendoWidget();
      if (this.peutRefresh) {
        scheduler.dataSource.read();
        scheduler.view(scheduler.view().name);
      }
    },
    onAdd: function () {
      console.log("Event :: create");
      this.peutRefresh = false;
    },
    onCancel: function () {
      console.log("Event :: cancel");
      this.peutRefresh = true;
    },
    onSave: function () {
      console.log("Event :: save");
      this.peutRefresh = true;
    },
    onMove: function () {
      console.log("Event :: move");
      this.peutRefresh = false;
    },
    onResize: function () {
      console.log("Event :: resize");
      this.peutRefresh = false;
    },
    onEdit: function (e) {
      console.log("Event :: edit");
      this.peutRefresh = false;

      this.hideNeverOptionFromRecurrence(e);
      this.initSelectCanaux();
      this.initSelectRestrictions();
      this.initSelectBcTypes();
      this.initSelectPads();
      this.initSelectAssets();
      this.initSelectSeries();
    },
    hideNeverOptionFromRecurrence: function (e) {
      //!\ Si rien n'est selectionné, le scheduler envoie une recurrenceRule infini.
      // Il faut donc soit le catch coté serveur, soit check les champs avant validation du form
      const kendoReccurr = e.container
        .find("[data-role=recurrenceeditor]")
        .data("kendoRecurrenceEditor");
      //console.log(kendoReccurr);
      kendoReccurr.setOptions({
        change: function (e) {
          let buttonNever = e.sender._buttonNever;
          if (buttonNever) {
            $(buttonNever).prop("checked", false);
            $(buttonNever[0]).parent().remove();
          }
        },
      });
    },
    initContextMenu: function () {
      let newelement = $(`<ul id="target"></ul>`);
      kendo.jQuery(newelement).kendoContextMenu({
        target: ".k-event",
        select: function (e) {
          let index = $(e.item).index();
          e.sender.options.dataSource[index].click(e);
        },
        dataSource: [
          {
            text: "Retry",
            click: function (e) {
              let scheduler = kendo.jQuery("#scheduler").data("kendoScheduler");
              let recordToUpdate = scheduler.dataSource.getByUid(
                e.target.dataset.uid
              );
              if (recordToUpdate.etat === "Error") {
                recordToUpdate.set("etat", "Demarré");
                scheduler.dataSource.sync();
              } else {
                console.log("Ne retry pas");
              }
            },
          },
        ],
      });
    },
    initSelectCanaux: function () {
      kendo.jQuery("#canaux").kendoComboBox({
        placeholder: "Selectionner canal",
        dataTextField: "nom",
        dataValueField: "canalId",
        dataSource: {
          data: this.dbCanaux,
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
    recordTemplate: function () {
      return (
        this.mainForm() +
        this.sourceDestForm() +
        this.restrictionForm() +
        this.infoMedia() +
        this.metaEdit()
      );
    },
    eventsColor: function () {
      let scheduler = this.$refs.scheduler.kendoWidget();
      let view = scheduler.view();
      let events = scheduler.dataSource.view();
      let eventElement;
      let event;

      for (var idx = 0, length = events.length; idx < length; idx++) {
        event = events[idx];
        if (event.etat === "Attente") {
          eventElement = view.element.find("[data-uid=" + event.uid + "]");
          eventElement.css("background-color", "grey");
        } else if (event.etat === "Demarré") {
          eventElement = view.element.find("[data-uid=" + event.uid + "]");
          eventElement.css("background-color", "cyan");
        } else if (event.etat === "Fini") {
          eventElement = view.element.find("[data-uid=" + event.uid + "]");
          eventElement.css("background-color", "green");
        } else if (event.etat === "Erreur") {
          eventElement = view.element.find("[data-uid=" + event.uid + "]");
          eventElement.css("background-color", "red");
        }
      }
    },
    getCanauxDb: function () {
      canauxService.retrieve().then((response) => {
        this.arrayCanaux = response.map((canal) => {
          return {
            text: canal.nom,
            value: canal.canalId,
            type: canal.type,
            visible: canal.visible,
          };
        });
        //Pour faire fonctionner le grouping server-side
        var scheduler = this.$refs.scheduler.kendoWidget();
        scheduler.resources[0].dataSource.data(this.arrayCanaux);
        scheduler.view(scheduler.viewName());
        //Pour la comboBox
        this.dbCanaux = response;
      });
    },
    getMetaData: function (data) {
      this.$refs.scheduler.kendoWidget().addEvent({
        isAdobe: data.metaData.IsAdobe,
        isWeb: data.metaData.IsWeb,
        isAvide: data.metaData.IsAvide,
        isArchive: data.metaData.IsArchive,
        isDiffusion: data.metaData.IsDiffusion,
        restrictionId: data.metaData.RestrictionId,
        descrRestriction: data.metaData.DescrRestriction,
        bcTypeId: data.metaData.BcTypeId,
        bcUmid: data.metaData.BcUmid,
        bcTitle: data.metaData.BcTitle,
        bcMemo: data.metaData.BcMemo,
        purgeDate: data.metaData.PurgeDate,
        padId: data.metaData.PadId,
        asset: data.metaData.Asset,
        demandeur: data.metaData.Demandeur,
        serieId: data.metaData.SerieId,
        commentaire: data.metaData.Commentaire,
        resume: data.metaData.Resume,
      });
    },
    eventListenerViewChanged: function () {
      document
        .querySelectorAll(
          "button.k-button.k-button-icon.k-icon-button.k-nav-prev, button.k-button.k-button-icon.k-icon-button.k-nav-next"
        )
        .forEach((result) =>
          result.addEventListener("click", () =>
            this.$refs.scheduler.kendoWidget().dataSource.read()
          )
        );
    },
  },
  data() {
    let kendoDate = kendo.date.today();
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
    let majorTimeHeaderTemplateTimelineDay = kendo.template(`<strong style="font-size:9px">
              #=kendo.toString(date, 'H:mm')# 
              #var d=kendo.toString(date, 'mm'); midMinute= kendo.parseInt(d)+10#
              <p class="midMinutes"> #= midMinute # </p> 
            </strong>`);
    let majorTimeHeaderTemplateTimelineWeek = kendo.template(
      `<strong style="font-size:14px">
              #=kendo.toString(date, 'HH:mm')#
              #var d=kendo.toString(date, 'H'); midMinute= kendo.parseInt(d)+1#
              <p class="midHours"> #=midMinute#:00 </p> 
            </strong>`
    );
    let eventTimelineDayTemplate = `
        <div class="recordDayTemplate"> 
          #: kendo.toString(start, "HH:mm") # -
          #: kendo.toString(end, "HH:mm")# ~
          #: avancement #% ~
          #: titre #
        </div>
        `;
    let eventTimelineWeekTemplate = `
        <div class="recordWeekTemplate">
          #: avancement #% ~
          #: titre  #
        </div>
        `;
    let peutRefresh = true;
    return {
      kendoDate,
      arrayCanaux: [],
      dbCanaux: [],
      arrayRestrictions,
      arrayBcTypes,
      arrayPads,
      arrayAssets,
      arraySeries,
      majorTimeHeaderTemplateTimelineDay,
      majorTimeHeaderTemplateTimelineWeek,
      eventTimelineDayTemplate,
      eventTimelineWeekTemplate,
      peutRefresh,
      fields: {
        recordId: { from: "recordId", type: "number" },
        etat: { from: "etat", defaultValue: "Attente" },
        avancement: { from: "avancement", defaultValue: "0" },
        titre: {
          from: "titre",
          defaultValue: "No titre ",
          validation: { required: true },
        },
        start: { type: "date", from: "start" },
        end: { type: "date", from: "end" },
        recurrenceId: { from: "recurrenceId" },
        recurrenceRule: { from: "recurrenceRule" },
        recurrenceException: { from: "recurrenceException" },
        canalId: { from: "canalId" },
        source: { from: "source" },
        isAdobe: { type: "boolean", from: "isAdobe" },
        isWeb: { type: "boolean", from: "isWeb" },
        isAvide: { type: "boolean", from: "isAvide" },
        isArchive: { type: "boolean", from: "isArchive" },
        isDiffusion: { type: "boolean", from: "isDiffusion" },
        restrictionId: { from: "restrictionId" },
        descrRestriction: { from: "descrRestriction" },
        bcTypeId: { from: "bcTypeId" },
        bcUmid: { from: "bcUmid" },
        bcTitle: { from: "bcTitle" },
        bcMemo: { from: "bcMemo" },
        purgeDate: { type: "date", from: "purgeDate" },
        padId: { from: "padId" },
        asset: { from: "asset" },
        demandeur: { from: "demandeur" },
        serieId: { from: "serieId" },
        commentaire: { from: "commentaire" },
        resume: { from: "resume" },
      },
    };
  },
  mounted() {
    kendo.culture("fr-BE");
    //
    var isMobile = Boolean(kendo.support.mobileOS);
    if (isMobile) {
      this.$refs.scheduler.kendoWidget().resize();
    }
    //
    this.getCanauxDb();
    //
    // setInterval(() => {
    //   this.refreshScheduler()
    // }, 9000);
  },
};
</script>
