export const state = () => ({
  invoiceData: [],
  currentInvoiceArray: null,
  invoicesLoaded: false,
  editInvoice: false,
  invoiceModal: false,
  modalActive: false,
});

export const mutations = {
  TOGGLE_INVOICE(state) {
    state.invoiceModal = !state.invoiceModal;
  },
  TOGGLE_MODAL(state) {
    state.modalActive = !state.modalActive;
  },
  SET_INVOICE_DATA(state, invoices) {
    state.invoiceData = invoices;
  },
  INVOICE_LOADED(state) {
    state.invoicesLoaded = true;
  },
  SET_CURRENT_INVOICE(state, id) {
    state.currentInvoiceArray = state.invoiceData.filter(invoice => {
      return invoice.invoiceId === id;
    });
  },
  TOGGLE_EDIT_INVOICE(state) {
    state.editInvoice = !state.editInvoice;
  },
  DELETE_INVOICE(state, id) {
    state.invoiceData = state.invoiceData.filter(invoice => {
      return invoice.docId !== id;
    });
  },
  UPDATE_STATUS_TO_PAID(state, docId) {
    state.invoiceData.forEach(invoice => {
      if (invoice.docId === docId) {
        invoice.invoicePaid = true;
        invoice.invoicePending = false;
      }
    });
  },
  UPDATE_STATUS_TO_PENDING(state, docId) {
    state.invoiceData.forEach(invoice => {
      if (invoice.docId === docId) {
        invoice.invoicePending = true;
        invoice.invoicePaid = false;
        invoice.invoiceDraft = false;
      }
    });
  }
};

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    const response = await fetch(process.env.baseUrl + '/invoices.json');

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    // convert to array and add docId
    let invoices = [];
    if (data) {
      invoices = Object.keys(data).map(key => {
        return {
          ...data[key],
          docId: key
        };
      });
    }
    commit('SET_INVOICE_DATA', invoices);
    commit('INVOICE_LOADED');

  },
  async GET_INVOICES({ commit, state }) {
    const response = await fetch(process.env.baseUrl + '/invoices.json');

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    // convert to array and add docId
    const invoices = Object.keys(data).map(key => {
      return {
        ...data[key],
        docId: key
      };
    });
    commit('INVOICE_LOADED');
    commit('SET_INVOICE_DATA', invoices);
  },
  async UPDATE_INVOICE({ commit, dispatch }, { docId, routeId }) {
    await dispatch('GET_INVOICES');
    commit('TOGGLE_INVOICE');
    commit('TOGGLE_EDIT_INVOICE');
    commit('SET_CURRENT_INVOICE', routeId);
  },
  async DELETE_INVOICE({ commit }, docId) {
    const response = await fetch(process.env.baseUrl + `/invoices/${docId}.json`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    commit('DELETE_INVOICE', docId);
  },
  async UPDATE_STATUS_TO_PAID({ commit }, docId) {
    const response = await fetch(process.env.baseUrl + `/invoices/${docId}.json`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    commit('UPDATE_STATUS_TO_PAID', docId);
    const invoice = await response.json();
    invoice.invoicePaid = true;
    invoice.invoicePending = false;
    fetch(process.env.baseUrl + `/invoices/${docId}.json`, {
      method: 'PUT',
      body: JSON.stringify(invoice)
    });
  },
  async UPDATE_STATUS_TO_PENDING({ commit }, docId) {
    const response = await fetch(process.env.baseUrl + `/invoices/${docId}.json`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    commit('UPDATE_STATUS_TO_PENDING', docId);
    const invoice = await response.json();
    invoice.invoicePending = true;
    invoice.invoicePaid = false;
    invoice.invoiceDraft = false;
    fetch(process.env.baseUrl + `/invoices/${docId}.json`, {
      method: 'PUT',
      body: JSON.stringify(invoice)
    });
  },
};

export const getters = {
};

