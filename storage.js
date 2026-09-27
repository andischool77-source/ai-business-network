const Storage = {
  
  async add(store, data) {
    return await dbAdd(store, data);
  },
  
  async put(store, data) {
    return await dbPut(store, data);
  },
  
  async getAll(store) {
    return await dbGetAll(store);
  },
  
  async get(store, id) {
    return await dbGet(store, id);
  },
  
  async remove(store, id) {
    return await dbDelete(store, id);
  },
  
  async clear(store) {
    return await dbClear(store);
  },
  
  async count(store) {
    const data = await dbGetAll(store);
    return data.length;
  },
  
  async saveBusiness(data) {
    const existing = await dbGetAll(STORES.business);
    
    if (existing.length > 0) {
      return await dbPut(STORES.business, {
        ...existing[0],
        ...data
      });
    }
    
    return await dbAdd(STORES.business, data);
  },
  
  async getBusiness() {
    const data = await dbGetAll(STORES.business);
    return data[0] || null;
  },
  
  async addProduct(data) {
    return await dbAdd(STORES.products, data);
  },
  
  async addNetwork(data) {
    return await dbAdd(STORES.network, data);
  },
  
  async addRequest(data) {
    return await dbAdd(STORES.requests, data);
  },
  
  async addOffer(data) {
    return await dbAdd(STORES.offers, data);
  },
  
  async addTransaction(data) {
    return await dbAdd(STORES.transactions, data);
  },
  
  async addService(data) {
    return await dbAdd(STORES.services, data);
  },
  
  async addNotification(data) {
    return await dbAdd(STORES.notifications, data);
  }
};