const state = {
    mainAccountData: null
};

const mutations = {
    SET_MAIN_ACCOUNT_DATA(state, data) {
        state.mainAccountData = data;
    }
};

const actions = {
    async fetchMainAccountData({ commit }) {
        try {
            // Perform API request to fetch main account data
            const response = await axios.get('/api/mainAccount');
            commit('SET_MAIN_ACCOUNT_DATA', response.data);
        } catch (error) {
            console.error('Error fetching main account data:', error);
        }
    }
};

const getters = {
    mainAccountData: state => state.mainAccountData
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};