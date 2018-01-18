<script>
import Vue from 'vue'
import Validations from 'vuelidate'
import { email, required } from 'vuelidate/lib/validators'
import { Input, Button } from 'element-ui'
import EmptyLayout from '@/layouts/EmptyLayout'

Vue.use(Validations)
Vue.use(Input)
Vue.use(Button)

export default {
    components: {
        EmptyLayout
    },

    data() {
        return {
            username: '',
            password: '',
            loading: false,
            pwdType: 'password'
        }
    },

    methods: {
        showPwd() {
            if (this.pwdType === 'password') {
                this.pwdType = ''
            } 
            else {
                this.pwdType = 'password'
            }
        },

        handleLogin() {
            // this.$refs.loginForm.validate(valid => {
            //     if (valid) {
            //         this.loading = true
            //         this.$store.dispatch('Login', this.loginForm).then(() => {
            //             this.loading = false
            //             this.$router.push({ path: '/' })
            //         })
            //         .catch(() => {
            //             this.loading = false
            //         })
            //     } 
            //     else {
            //         console.log('error submit!!')
            //         return false
            //     }
            // })
        }
    },

    validations: {
        username: {
            required
        },
        password: {
            required
        }
    }
}
</script>


<template>
    <empty-layout>
        <div class="login-container">
            <div class="login-form">
                <div class="tac mbs">
                    <!-- <img src="/static/images/logo_header.png" alt="gmnst" /> -->
                    <img src="/static/images/g.svg" alt="gmnst" class="g" />
                </div>

                <!-- Username -->
                <div>
                    <div>{{ $t('Username') }}</div>
                    <div class="checkout_form_value">
                        <el-input v-model.trim="username"
                                @input="$v.username.$touch()"
                                autoComplete="on"></el-input>
                        <p role="alert" v-if="$v.username.$dirty && !$v.username.required">{{ $t('Required') }}</p>
                    </div>
                </div>

                <!-- Password-->
                <div>
                    <div>{{ $t('Password') }}</div>
                    <div class="checkout_form_value">
                        <el-input name="password"
                                v-model.trim="password" 
                                @input="$v.password.$touch()"
                                type="password"
                                autoComplete="on"></el-input>
                        <p role="alert" v-if="$v.password.$dirty && !$v.password.required">{{ $t('Required') }}</p>
                    </div>
                </div>

                <div class="mtl">
                    <el-button 
                        type="warning" 
                        style="width:100%;" 
                        :loading="loading" 
                        :disabled="this.$v.$invalid"
                        @click.native.prevent="handleLogin">Sign in</el-button>
                </div>
            </div>
        </div>
    </empty-layout>
</template>


<style lang="scss">
.layoutContainer {
    align-items: center;
    justify-content: center;
    background-color: #363e5d;
}

.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}

.login-form {
    flex: none;
    width: 350px;
}

.g {
    width: 75px;
}

</style>