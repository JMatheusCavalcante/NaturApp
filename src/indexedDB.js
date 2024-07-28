const DATABASE_NAME = 'MinhasContasApp';
const DATABASE_VERSION = 4; // Incrementa a versão do banco de dados para forçar a atualização
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
        const goalStore = db.createObjectStore(GOALS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        goalStore.createIndex('nome', 'nome', { unique: false });
        goalStore.createIndex('objetivo', 'objetivo', { unique: false });
        goalStore.createIndex('periodo', 'periodo', { unique: false });
        goalStore.createIndex('progresso', 'progresso', { unique: false });
        goalStore.createIndex('vendasAssociadas', 'vendasAssociadas', { unique: false });
      } else {
        const goalStore = event.target.transaction.objectStore(GOALS_STORE_NAME);
        if (!goalStore.indexNames.contains('progresso')) {
          goalStore.createIndex('progresso', 'progresso', { unique: false });
        }
        if (!goalStore.indexNames.contains('vendasAssociadas')) {
          goalStore.createIndex('vendasAssociadas', 'vendasAssociadas', { unique: false });
        }
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

// Função para adicionar uma venda
export const addSale = async (sale) => {
  const db = await openDB();
  const store = db.transaction(SALES_STORE_NAME, 'readwrite').objectStore(SALES_STORE_NAME);
  const saleRequest = store.add(sale);

  return new Promise((resolve, reject) => {
    saleRequest.onsuccess = async (event) => {
      const saleId = event.target.result;
      await updateGoalsWithSale(sale, saleId);
      resolve(saleId);
    };
    saleRequest.onerror = (event) => {
      reject('Erro ao adicionar venda: ' + event.target.errorCode);
    };
  });
};

// Função para atualizar as metas com a nova venda
const updateGoalsWithSale = async (sale, saleId) => {
  
  

  const goals = await getAllGoals();
  goals.forEach(async (goal) => {
    if (isSaleWithinGoalPeriod(sale, goal)) {
      const updatedSales = [...goal.vendasAssociadas, saleId];
      const updatedProgress = await calculateGoalProgress(goal, updatedSales);
      await updateGoalProgress(goal.id, updatedProgress, updatedSales);
    }
  });
};

// Função para verificar se a venda está dentro do período da meta
const isSaleWithinGoalPeriod = (sale, goal) => {
  const saleDate = new Date(sale.date);
  const [start, end] = goal.periodo;
  return saleDate >= new Date(start) && saleDate <= new Date(end);
};

// Função para calcular o progresso da meta (usando valores numéricos)
const calculateGoalProgress = async (goal, salesIds) => {
  const sales = await getSalesByIds(salesIds);
  const totalSalesValue = sales.reduce((acc, sale) => acc + parseFloat(sale.total), 0); // Converter para número
  const goalTarget = goal.objetivo;
  return Math.min((totalSalesValue / goalTarget) * 100, 100);
};

// Função para obter todas as vendas
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

// Função para deletar uma venda (chamando updateGoalsAfterSaleDeletion)
export const deleteSale = async (id) => {
  const db = await openDB();
  const transaction = db.transaction(SALES_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(SALES_STORE_NAME);

  return new Promise((resolve, reject) => {
    const deleteRequest = store.delete(id);
    deleteRequest.onsuccess = async () => {
      await updateGoalsAfterSaleDeletion(id);
      resolve();
    };
    deleteRequest.onerror = (event) => {
      reject('Erro ao deletar venda: ' + event.target.errorCode);
    };
  });
};

// Função para atualizar as metas após a exclusão de uma venda
const updateGoalsAfterSaleDeletion = async (saleId) => {
 
  
 

  const goals = await getAllGoals();
  for (const goal of goals) {
    if (goal.vendasAssociadas && goal.vendasAssociadas.includes(saleId)) {
      const updatedSales = goal.vendasAssociadas.filter(id => id !== saleId);
      const updatedProgress = await calculateGoalProgress(goal, updatedSales);
      await updateGoalProgress(goal.id, updatedProgress, updatedSales);
    }
  }
};

// Função para adicionar um custo
export const addExpense = async (expense) => {
  const db = await openDB();
  const store = db.transaction(EXPENSES_STORE_NAME, 'readwrite').objectStore(EXPENSES_STORE_NAME);
  return store.add(expense);
};

// Função para obter todos os custos
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

// Função para deletar um custo
export const deleteExpense = async (id) => {
  const db = await openDB();
  const store = db.transaction(EXPENSES_STORE_NAME, 'readwrite').objectStore(EXPENSES_STORE_NAME);
  return store.delete(id);
};

// Função para adicionar uma meta (garantindo que objetivo seja um número)
export const addGoal = async (goal) => {
  const db = await openDB();
  const store = db.transaction(GOALS_STORE_NAME, 'readwrite').objectStore(GOALS_STORE_NAME);
  goal.objetivo = parseFloat(goal.objetivo.replace(',', '.')); // Converter para número
  goal.progresso = 0; // Inicializa o progresso com 0%
  goal.vendasAssociadas = []; // Inicializa a lista de vendas associadas vazia
  return store.add(goal);
};

// Função para obter todas as metas
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

// Função para deletar uma meta
export const deleteGoal = async (id) => {
  const db = await openDB();
  const store = db.transaction(GOALS_STORE_NAME, 'readwrite').objectStore(GOALS_STORE_NAME);
  return store.delete(id);
};

// Função para atualizar o progresso da meta
export const updateGoalProgress = async (id, newProgress, newSales) => {
  const db = await openDB();
  const store = db.transaction(GOALS_STORE_NAME, 'readwrite').objectStore(GOALS_STORE_NAME);
  const request = store.get(id);
  return new Promise((resolve, reject) => {
    request.onsuccess = async () => {
      const goal = request.result;
      goal.progresso = newProgress;
      goal.vendasAssociadas = newSales;
      const updateRequest = store.put(goal);
      updateRequest.onsuccess = () => {
        resolve();
      };
      updateRequest.onerror = (event) => {
        reject('Erro ao atualizar meta: ' + event.target.errorCode);
      };
    };
    request.onerror = (event) => {
      reject('Erro ao obter meta: ' + event.target.errorCode);
    };
  });
};

// Função para obter vendas por ids
const getSalesByIds = async (ids) => {
  const db = await openDB();
  const transaction = db.transaction(SALES_STORE_NAME, 'readonly');
  const store = transaction.objectStore(SALES_STORE_NAME);

  const sales = [];
  for (const id of ids) {
    const request = store.get(id);
    await new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        sales.push(event.target.result);
        resolve();
      };
      request.onerror = (event) => {
        reject('Erro ao obter venda: ' + event.target.errorCode);
      };
    });
  }
  return sales;
};
