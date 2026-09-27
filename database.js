const DB_NAME = "AIBusinessNetworkDB";
const DB_VERSION = 1;

const STORES = {
  business: "business",
  products: "products",
  network: "network",
  requests: "requests",
  offers: "offers",
  transactions: "transactions",
  services: "services",
  notifications: "notifications"
};

let dbInstance = null;

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      
      Object.values(STORES).forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, {
            keyPath: "id",
            autoIncrement: true
          });
          
          store.createIndex("createdAt", "createdAt", {
            unique: false
          });
        }
      });
    };
    
    request.onsuccess = function(event) {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };
    
    request.onerror = function() {
      reject(request.error);
    };
  });
}

async function dbAdd(storeName, data) {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    
    const item = {
      ...data,
      createdAt: data.createdAt || new Date().toISOString()
    };
    
    const request = store.add(item);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbPut(storeName, data) {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    
    const request = store.put({
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbGetAll(storeName) {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function dbGet(storeName, id) {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.get(Number(id));
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function dbDelete(storeName, id) {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.delete(Number(id));
    
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

async function dbClear(storeName) {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.clear();
    
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}