<template>
  <div class="divlogin">
    <form class="k-form" @submit.prevent="handleSubmit">
      <fieldset>
        <legend>Connexion :</legend>
        <div>
          <k-input
            :name="'email'"
            :type="'email'"
            v-model="email"
            :style="{ width: '100%' }"
            :label="'Adresse email'"
            :required="true"
          />
        </div>
        <div>
          <k-input
            :name="'password'"
            type="password"
            v-model="password"
            :style="{ width: '100%' }"
            :label="'Password'"
            :required="true"
            :min-length="6"
            :max-length="18"
          />
        </div>
      </fieldset>
      <div class="form-row" v-if="status === 'error'">
        Adresse email et/ou mot de passe incorrect!
      </div>
      <button type="submit" class="k-button k-primary">
        <span v-if="status === 'loading'">Connexion en cours ...</span>
        <span v-else>Connexion</span>
      </button>
    </form>
  </div>
</template>

<script>
import { Input } from "@progress/kendo-vue-inputs";
import { mapState } from "vuex";
import "../styles/authView.css";

export default {
  name: "AuthView",
  components: {
    "k-input": Input,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleSubmit: function () {
      let self = this;
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
        })
        .then(
          function () {
            self.$router.push("Scheduler");
          },
          function (error) {
            console.log(error);
          }
        );
    },
  },
  computed: {
    ...mapState(["status"]),
  },
};
</script>
