import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

import colors from 'vuetify/lib/util/colors'

const vuetify = new Vuetify({
    theme: {
        themes: {
            light: {
                primary: colors.indigo.lighten1,
                secondary: colors.deepPurple.lighten1,
                accent: colors.shades.black,
                error: colors.red.accent3,
                info: colors.teal.lighten2,
                success: colors.lightGreen.lighten1
            }
        }
    }
})

export default vuetify