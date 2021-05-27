<template>
<div class="row example-wrapper">
    <div class="col-xs-12 col-sm-6 offset-sm-3 example-col">
        <div class="card">
            <div class="card-block">
                <form class="k-form" @submit.prevent="handleSubmit">
                    <fieldset>
                        <legend>Connexion : </legend>
                        <div class="mb-3">
                            <k-input
                                :name="'email'"
                                :type="'email'"
                                v-model="email"
                                :style="{ width: '100%' }"
                                :label="'Adresse email'"
                                :required='true'
                            />
                        </div>
                        <div class="mb-3">
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
                    <input type="submit" class="k-button k-primary" value="Se Connecter" />
                </form>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { Input } from '@progress/kendo-vue-inputs';
import * as auth from '../services/authentification'

export default {
    name: "AuthView",
    components: {
        'k-input': Input,
    },
    data(){
        return{
            email:"",
            password:"",
        }
    },
    methods: {
        handleSubmit: function() {
            let accountData = auth.getAccount(this.email, this.password);
            return this.$emit("submit", { account: accountData });
        }
    }
}
</script>