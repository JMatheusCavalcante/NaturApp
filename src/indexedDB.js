const DATABASE_NAME = 'MinhasContasApp';
const DATABASE_VERSION = 3; // Incrementa a versão do banco de dados para forçar a atualização
const SALES_STORE_NAME = 'vendas';
const EXPENSES_STORE_NAME = 'custos';
const GOALS_STORE_NAME = 'metas'; // Nome do novo store para metas

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(SALES_STORE_NAME)) {
        db.createObjectStore(SALES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(EXPENSES_STORE_NAME)) {
        db.createObjectStore(EXPENSES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(GOALS_STORE_NAME)) {
        db.createObjectStore(GOALS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject('Erro no IndexedDB: ' + event.target.errorCode);
    };
  });
};

export const addSale = async (sale) => {
  const db = await openDB();
  const store = db.transaction(SALES_STORE_NAME, 'readwrite').objectStore(SALES_STORE_NAME);
  return store.add(sale);
};

export const getAllSales = async () => {
  const db = await openDB();
  const store = db.transaction(SALES_STORE_NAME, 'readonly').objectStore(SALES_STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = (event) => {
      reject('Erro ao obter dados: ' + event.target.errorCode);
    };
  });
};

export const deleteSale = async (id) => {
  const db = await openDB();
  const store = db.transaction(SALES_STORE_NAME, 'readwrite').objectStore(SALES_STORE_NAME);
  return store.delete(id);
};

// Operações para Custos
export const addExpense = async (expense) => {
  const db = await openDB();
  const store = db.transaction(EXPENSES_STORE_NAME, 'readwrite').objectStore(EXPENSES_STORE_NAME);
  return store.add(expense);
};

export const getAllExpenses = async () => {
  const db = await openDB();
  const store = db.transaction(EXPENSES_STORE_NAME, 'readonly').objectStore(EXPENSES_STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = (event) => {
      reject('Erro ao obter dados: ' + event.target.errorCode);
    };
  });
};

export const deleteExpense = async (id) => {
  const db = await openDB();
  const store = db.transaction(EXPENSES_STORE_NAME, 'readwrite').objectStore(EXPENSES_STORE_NAME);
  return store.delete(id);
};

// Operações para Metas
export const addGoal = async (goal) => {
  const db = await openDB();
  const store = db.transaction(GOALS_STORE_NAME, 'readwrite').objectStore(GOALS_STORE_NAME);
  return store.add(goal);
};

export const getAllGoals = async () => {
  const db = await openDB();
  const store = db.transaction(GOALS_STORE_NAME, 'readonly').objectStore(GOALS_STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = (event) => {
      reject('Erro ao obter dados: ' + event.target.errorCode);
    };
  });
};

export const deleteGoal = async (id) => {
  const db = await openDB();
  const store = db.transaction(GOALS_STORE_NAME, 'readwrite').objectStore(GOALS_STORE_NAME);
  return store.delete(id);
};
