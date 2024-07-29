const DATABASE_NAME = 'MinhasContasApp';
const DATABASE_VERSION = 4;
const SALES_STORE_NAME = 'vendas';
const EXPENSES_STORE_NAME = 'custos';
const GOALS_STORE_NAME = 'metas';

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
        goalStore.createIndex('dataCriacao', 'dataCriacao', { unique: false });
      } else {
        const goalStore = event.target.transaction.objectStore(GOALS_STORE_NAME);
        if (!goalStore.indexNames.contains('progresso')) {
          goalStore.createIndex('progresso', 'progresso', { unique: false });
        }
        if (!goalStore.indexNames.contains('vendasAssociadas')) {
          goalStore.createIndex('vendasAssociadas', 'vendasAssociadas', { unique: false });
        }
        if (!goalStore.indexNames.contains('dataCriacao')) {
          goalStore.createIndex('dataCriacao', 'dataCriacao', { unique: false });
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

export const addSale = async (sale) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(SALES_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(SALES_STORE_NAME);
    const saleRequest = store.add(sale);

    const saleId = await new Promise((resolve, reject) => {
      saleRequest.onsuccess = (event) => resolve(event.target.result);
      saleRequest.onerror = (event) => reject('Erro ao adicionar venda: ' + event.target.errorCode);
    });

    // Utilize a data fornecida no formulário para comparações
    const saleDate = new Date(sale.date); // Certifique-se de que 'sale.date' está no formato adequado

    await updateGoalsWithSale(saleDate, saleId); // Passe a data da venda para a função de atualização
    return saleId;
  } catch (error) {
    console.error(error);
  }
};

const updateGoalsWithSale = async (saleDate, saleId) => {
  const goals = await getAllGoals();
  goals.forEach(async (goal) => {
    const goalCreationDate = new Date(goal.dataCriacao);

    console.log(`Data da Venda: ${saleDate.toISOString()}`);
    console.log(`Data da Criação da Meta: ${goalCreationDate.toISOString()}`);

    if (saleDate >= goalCreationDate) {
      const updatedSales = [...(goal.vendasAssociadas || []), saleId];
      const updatedProgress = await calculateGoalProgress(goal, updatedSales);
      await updateGoalProgress(goal.id, updatedProgress, updatedSales);
    }
  });
};

const calculateGoalProgress = async (goal, sales) => {
  const db = await openDB();
  const store = db.transaction(SALES_STORE_NAME, 'readonly').objectStore(SALES_STORE_NAME);
  const salesData = await Promise.all(sales.map(saleId => store.get(saleId)));

  // Certifique-se de que os dados de vendas estão corretos
  console.log('Dados das Vendas:', salesData);

  // Calcule o total de vendas
  const totalSales = salesData.reduce((acc, sale) => {
    // Converta as propriedades para números
    const sanduiches = parseFloat(sale.sanduiches) || 0;
    const caldo = parseFloat(sale.caldo) || 0;
    const cafe = parseFloat(sale.cafe) || 0;

    // Calcule o total
    return acc + (sanduiches * 5 + caldo * 5 + cafe * 2);
  }, 0);

  console.log('Total de Vendas:', totalSales);

  // Verifique o objetivo
  if (goal.objetivo === 0) return 0; // Evitar divisão por zero

  // Calcule o progresso
  const progress = (totalSales / goal.objetivo) * 100;
  console.log('Progresso Calculado:', progress);

  // Garantir que o progresso não exceda 100%
  return Math.min(progress, 100);
};

const getAllItems = async (storeName) => {
  try {
    const db = await openDB();
    const store = db.transaction(storeName, 'readonly').objectStore(storeName);
    const request = store.getAll();
    return await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject('Erro ao obter dados: ' + event.target.errorCode);
    });
  } catch (error) {
    console.error(error);
  }
};

export const getAllSales = () => getAllItems(SALES_STORE_NAME);
export const getAllExpenses = () => getAllItems(EXPENSES_STORE_NAME);

const deleteItem = async (storeName, id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    return await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject('Erro ao deletar item: ' + event.target.errorCode);
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteSale = (id) => deleteItem(SALES_STORE_NAME, id);
export const deleteExpense = (id) => deleteItem(EXPENSES_STORE_NAME, id);

export const addExpense = async (expense) => {
  const db = await openDB();
  const store = db.transaction(EXPENSES_STORE_NAME, 'readwrite').objectStore(EXPENSES_STORE_NAME);
  return store.add(expense);
};

export const addGoal = async (goal) => {
  const db = await openDB();
  const store = db.transaction(GOALS_STORE_NAME, 'readwrite').objectStore(GOALS_STORE_NAME);
  goal.objetivo = parseFloat(goal.objetivo.replace(',', '.')); // Garantir que objetivo seja um número
  goal.progresso = 0; // Progresso inicial de 0%
  goal.vendasAssociadas = [];

  // Captura a data atual em formato local
  const now = new Date();
  goal.dataCriacao = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

  console.log(`Meta criada: Nome: ${goal.nome}, Data de Criação: ${goal.dataCriacao}`);  
  return store.add(goal);
};

export const getAllGoals = async () => {
  return getAllItems(GOALS_STORE_NAME);
};

export const deleteGoal = (id) => {
  return deleteItem(GOALS_STORE_NAME, id);
};

export const updateGoalProgress = async (id, newProgress, newSales) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(GOALS_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(GOALS_STORE_NAME);
    const request = store.get(id);

    const goal = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject('Erro ao obter meta: ' + event.target.errorCode);
    });

    goal.progresso = newProgress;
    goal.vendasAssociadas = newSales;
    const updateRequest = store.put(goal);

    await new Promise((resolve, reject) => {
      updateRequest.onsuccess = () => resolve();
      updateRequest.onerror = (event) => reject('Erro ao atualizar meta: ' + event.target.errorCode);
    });

    return goal;
  } catch (error) {
    console.error(error);
  }
};
