const state = {
    categories: []
};

const mutations = {
    SET_CATEGORIES(state, categories) {
        state.categories = categories;
    },
    ADD_CATEGORY(state, category) {
        state.categories.push(category);
    },
    UPDATE_CATEGORY(state, updatedCategory) {
        const index = state.categories.findIndex(c => c.id === updatedCategory.id);
        if (index !== -1) {
            state.categories.splice(index, 1, updatedCategory);
        }
    },
    DELETE_CATEGORY(state, categoryId) {
        state.categories = state.categories.filter(c => c.id !== categoryId);
    }
};

const actions = {
    async fetchCategories({ commit }) {
        try {
            const response = await axios.get('/api/categories');
            commit('SET_CATEGORIES', response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    },
    async addCategory({ commit }, category) {
        try {
            const response = await axios.post('/api/categories', category);
            commit('ADD_CATEGORY', response.data);
        } catch (error) {
            console.error('Error adding category:', error);
        }
    },
    async updateCategory({ commit }, updatedCategory) {
        try {
            await axios.put(`/api/categories/${updatedCategory.id}`, updatedCategory);
            commit('UPDATE_CATEGORY', updatedCategory);
        } catch (error) {
            console.error('Error updating category:', error);
        }
    },
    async deleteCategory({ commit }, categoryId) {
        try {
            await axios.delete(`/api/categories/${categoryId}`);
            commit('DELETE_CATEGORY', categoryId);
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }
};

const getters = {
    categories: state => state.categories
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
