<template>
  <div>
    <!-- <kendo-schedulerdatasource
      ref="remoteDataSource"
      :batch="true"
      schema-model-id="recordId"
      :schema-model-fields="fields"
    >
    </kendo-schedulerdatasource> -->

    <!-- data-source-ref="remoteDataSource" -->
    <kendo-scheduler
      id="scheduler"
      :date="kendoDate"
      :data-source="localDataSource"
      :group="group"
      :resources="resources"
      :event-template="eventTemplate"
      :snap="false"
      :toolbar="['search']"
      :selectable="true"
      :footer="false"
      :editable-template="editTemplate"
      schema-model-id="recordId"
      :schema-model-fields="fields"
      @edit="onEdit"
    >
      <kendo-scheduler-view
        :type="'timeline'"
        :group="{ orientation: 'vertical' }"
        :selected="true"
        :major-tick="20"
        :column-width="15"
        :selected-date-format="dateFormatTimeLine"
        :majorTimeHeaderTemplate="majorTimeHeaderTemplateTimeline"
      ></kendo-scheduler-view>

      <kendo-scheduler-view
        :type="'timelineWeek'"
        :group="{ orientation: 'vertical' }"
        :column-width="60"
      ></kendo-scheduler-view>
      <kendo-scheduler-view
        :type="'timelineMonth'"
        :group="{ orientation: 'vertical' }"
      ></kendo-scheduler-view>
      <kendo-scheduler-view
        :type="'month'"
        :group="{ date: true }"
        :day-template="monthDayTemplate"
      ></kendo-scheduler-view>
    </kendo-scheduler>
  </div>
</template>

<script>
//import "@progress/kendo-ui/js/messages/kendo.messages.fr-BE.js";
import kendo from "@progress/kendo-ui/js/kendo.scheduler";
import "@progress/kendo-ui/js/kendo.scheduler";
import "@progress/kendo-theme-default/dist/all.css";
import { Scheduler } from "@progress/kendo-scheduler-vue-wrapper";
import { KendoSchedulerDataSource } from "@progress/kendo-datasource-vue-wrapper";
import { SchedulerView } from "@progress/kendo-scheduler-vue-wrapper";
import $ from "jquery"; //eslint-disable-line
import "@progress/kendo-scheduler-vue-wrapper";
export default {
  name: "HelloWorld",
  components: {
    "kendo-scheduler": Scheduler,
    "kendo-scheduler-view": SchedulerView,
    "kendo-schedulerdatasource": KendoSchedulerDataSource, //eslint-disable-line
  },
  props: {
    msg: String,
  },
  methods: {
    onEdit: function () {
      console.log("Event :: change");
    },
    mainForm: function () {
      return `
      <h3>Main</h3>
      <div name="main">
          <div class="k-edit-label"><label for="title">Title</label></div>
          <div data-container-for="title" class="k-edit-field">
            <input type="text" class="k-textbox" name="title" required="required" data-bind="value:title">
          </div>
        <div class="k-edit-label">
          <label for="start">Start</label>
        </div>
        <div data-container-for="start" class="k-edit-field">
          <input type="text"
                data-role="datetimepicker"
                data-interval="15"
                data-type="date"
                data-bind="value:start,invisible:isAllDay"
                name="start"/>
          <input type="text" 
                data-type="date" 
                data-role="datepicker" 
                data-bind="value:start,visible:isAllDay" 
                name="start" />
          <span data-bind="text: startTimezone"></span>
          <span data-for="start" class="k-invalid-msg" style="display: none;"></span>
        </div>
        <div class="k-edit-label"><label for="end">End</label></div>
        <div data-container-for="end" class="k-edit-field">
          <input type="text" 
                data-type="date" 
                data-role="datetimepicker" 
                data-bind="value:end,invisible:isAllDay" 
                name="end" 
                data-datecompare-msg="End date should be greater than or equal to the start date" />
          <input type="text" 
                data-type="date" 
                data-role="datepicker" 
                data-bind="value:end,visible:isAllDay" 
                name="end" 
                data-datecompare-msg="End date should be greater than or equal to the start date" />
          <span data-bind="text: endTimezone"></span>
          <span data-bind="text: startTimezone, invisible: endTimezone"></span>
          <span data-for="end" class="k-invalid-msg" style="display: none;"></span>
        </div>

        <div class="k-edit-label"><label for="encodingUnit">Canaux </label></div>
          <div data-container-for="encondingUnit" class="k-edit-field">
            <select id="canalId" data-bind="value:canalId" 
                                data-role="dropdownlist"
                                data-value-field="value" 
                                data-text-field="text"
                                data-source="arrayCanaux">
            </select>
          </div>
      </div>
        `;
    },
    sourceDestForm: function () {
      return `
        <h3>Destination - Source</h3>
        <div name="destinationSource">
            <div class="k-edit-label"><label for="source">Source</label></div>
            <div data-container-for="source" class="k-edit-field">
              <input type="text" class="k-textbox" name="source" data-bind="value:source">
            </div>
            <div class="k-edit-label"><label for="typeSource">Type Source</label></div>
            <div data-container-for="typeSource" class="k-edit-field">
              <label>Vers Adobe <input type="checkbox" data-type="boolean" data-bind="checked:isAdobe" name="adobe" /> </label>
              <label>Pour web <input type="checkbox" data-bind="checked:isWeb" name="web" /></label>
              <label>Vers Avid <input type="checkbox" data-bind="checked:isAvid" name="avid" /></label>
              <label>Pour Archive <input type="checkbox" data-bind="checked:isArchive" name="archive" /></label>
              <label>Vers Diffusion <input type="checkbox" data-bind="checked:isDiffusion" name="diffusion" /></label>
            </div>
        </div>
      `;
    },
    restrictionForm: function () {
      return `
        <h3>Restriction</h3>
        <div name="restrictions">
          <div class="k-edit-label"><label for="restrictions">Restrictions</label></div>
          <div data-container-for="restrictions" class="k-edit-field">
            <select id="restrictionId" data-bind="value:restrictionId" data-role="dropdownlist"
                      data-value-field="value" data-text-field="text">
                <option value="1">Restriction 1</option>
            </select>
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
        <h3>Info Media</h3>
        <div name="infoMedia">
          ` +
        this.bcType() +
        `
          <div class="k-edit-label"><label for="purge">Purge</label></div>
          <div data-container-for="purge" class="k-edit-field">
            <input type="text"
                  data-role="datetimepicker"
                  data-interval="15"
                  data-type="date"
                  data-bind="value:purgeDate,invisible:isAllDay"
                  name="purgeDate"/>
            <input type="text" 
                  data-type="date" 
                  data-role="datepicker" 
                  data-bind="value:purgeDate,visible:isAllDay" 
                  name="purgeDate" />
            <span data-bind="text: startTimezone"></span>
            <span data-for="purge" class="k-invalid-msg" style="display: none;"></span>
          </div>
          <div class="k-edit-label"><label for="validPAD">Validation PAD</label></div>
          <div data-container-for="validPAD" class="k-edit-field">
            <select id="padId" data-bind="value:padId" data-role="dropdownlist"
                      data-value-field="value" data-text-field="text">
                <option value="1">PAD 1</option>
            </select>
          </div>
          <div class="k-edit-label"><label for="natureAsset">Nature Asset</label></div>
          <div data-container-for="natureAsset" class="k-edit-field">
            <select id="asset" data-bind="value:asset" data-role="dropdownlist"
                      data-value-field="value" data-text-field="text">
                <option value="1">Asset 1</option>
            </select>
          </div>
          <div class="k-edit-label"><label for="demandeur">Demandeur</label></div>
          <div data-container-for="demandeur" class="k-edit-field">
            <input type="text" class="k-textbox" name="demandeur" data-bind="value:demandeur">
          </div>

          <div class="k-edit-label"><label for="serie">Serie</label></div>
          <div data-container-for="serie" class="k-edit-field">
            <select id="serieId" data-bind="value:serieId" data-role="dropdownlist"
                      data-value-field="value" data-text-field="text">
                <option value="1">Serie 1</option>
            </select>
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
            <select id="bcTypeId" data-bind="value:bcTypeId" data-role="dropdownlist"
                      data-value-field="value" data-text-field="text">
                <option value="1">BCTYPE 1</option>
                <option value="2">BCTYPE 2</option>
                <option value="3">BCTYPE 3</option>
            </select>
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
    let localDataSource = [
      {
        id: 1,
        start: new Date("2021/3/31 08:00 AM"),
        end: new Date("2021/3/31 09:00 AM"),
        title: "Interview",
        canalId: 2,
      },
      {
        id: 2,
        start: new Date("2021/3/31 11:00"),
        end: new Date("2021/3/31 12:00"),
        title: "Meeting",
        canalId: 1,
      },
    ];
    let majorTimeHeaderTemplateTimeline = kendo.template(
      `<strong style="font-size:9px">
              #=kendo.toString(date, 'H:mm')# 
              #var d=kendo.toString(date, 'mm'); midMinute= kendo.parseInt(d)+10#
              <p class="midMinutes"> #= midMinute # </p> 
            </strong>`
    );
    let group = {
      resources: ["Canaux"],
    };
    let resources = [
      {
        field: "canalId",
        title: "Canal ID",
        name: "Canaux",
        dataSource: arrayCanaux,
      },
    ];
    let eventTemplate = `<div class="record-template"> 
                          #: kendo.toString(start, "hh:mm") # -
                          #: kendo.toString(end, "hh:mm")# ~ 
                          #: title #
                        </div>`;
    let dateFormatTimeLine = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }); // { 0:dddd, 'dd-MM-yyyy'}"
    let monthDayTemplate = kendo.template(
      "<strong>#= kendo.toString(date, 'ddd') #</strong>"
    );

    return {
      arrayCanaux,
      kendoDate,
      localDataSource,
      majorTimeHeaderTemplateTimeline,
      eventTemplate,
      group,
      resources,
      dateFormatTimeLine,
      monthDayTemplate,
      afficherSrcDest: false,
      fields: {
        recordId: { from: "RecordID", type: "number" },
        title: {
          from: "Title",
          defaultValue: "No title ",
          validation: { required: true },
        },
        start: { type: "date", from: "Start" },
        end: { type: "date", from: "End" },
        canalId: { from: "CanalId" },
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
};
</script>

<style>
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
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 2px;
  padding-top: 2px;
}

.k-scheduler-table > tbody > tr:nth-child(1) {
  height: auto;
}
.record-template {
  font-size: 10px;
}

.midMinutes {
  font-size: 8px;
  font-weight: 200;
  margin-top: auto;
  margin-bottom: auto;
}
</style>
