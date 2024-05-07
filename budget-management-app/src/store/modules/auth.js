const state = {
    user: null,
    isAuthenticated: false
};

const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },
    SET_AUTHENTICATED(state, isAuthenticated) {
        state.isAuthenticated = isAuthenticated;
    }
};

const actions = {
    async login({ commit }, userData) {
        try {
            const response = await axios.post('/api/login', userData);
            commit('SET_USER', response.data.user);
            commit('SET_AUTHENTICATED', true);
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    },
    logout({ commit }) {
        commit('SET_USER', null);
        commit('SET_AUTHENTICATED', false);
        localStorage.removeItem('token');
    }
};

const getters = {
    user: state => state.user,
    isAuthenticated: state => state.isAuthenticated
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};