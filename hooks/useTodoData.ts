import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export interface Task {
  id: string;
  title: string;
  done: boolean;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}

const INITIAL_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Reminders',
    color: '#FF3B30',
    tasks: [
      { id: '1', title: 'Buy groceries', done: false, color: '#FF3B30' },
      { id: '2', title: 'Call mom', done: true, color: '#FF3B30' },
    ],
  },
  {
    id: '2',
    name: 'Work',
    color: '#007AFF',
    tasks: [
      { id: '3', title: 'Finish report', done: false, color: '#007AFF' },
      { id: '4', title: 'Email client', done: false, color: '#007AFF' },
    ],
  },
  {
    id: '3',
    name: 'Personal',
    color: '#34C759',
    tasks: [
      { id: '5', title: 'Exercise', done: false, color: '#34C759' },
      { id: '6', title: 'Read book', done: true, color: '#34C759' },
    ],
  },
];

const STORAGE_KEY = '@todo_app_categories';

export const useTodoData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化數據
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setCategories(JSON.parse(data));
      } else {
        setCategories(INITIAL_CATEGORIES);
        await saveData(INITIAL_CATEGORIES);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setCategories(INITIAL_CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (data: Category[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addCategory = useCallback(async (name: string, color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
      tasks: [],
    };
    const newCategories = [...categories, newCategory];
    setCategories(newCategories);
    await saveData(newCategories);
    return newCategory;
  }, [categories]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    const newCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(newCategories);
    await saveData(newCategories);
  }, [categories]);

  const updateCategory = useCallback(async (categoryId: string, name: string, color: string) => {
    const newCategories = categories.map(cat =>
      cat.id === categoryId ? { ...cat, name, color } : cat
    );
    setCategories(newCategories);
    await saveData(newCategories);
  }, [categories]);

  const addTask = useCallback(async (categoryId: string, title: string, color: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      done: false,
      color,
    };
    const newCategories = categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, tasks: [newTask, ...cat.tasks] }
        : cat
    );
    setCategories(newCategories);
    await saveData(newCategories);
    return newTask;
  }, [categories]);

  const deleteTask = useCallback(async (categoryId: string, taskId: string) => {
    const newCategories = categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, tasks: cat.tasks.filter(task => task.id !== taskId) }
        : cat
    );
    setCategories(newCategories);
    await saveData(newCategories);
  }, [categories]);

  const updateTask = useCallback(async (categoryId: string, taskId: string, title: string, color: string) => {
    const newCategories = categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            tasks: cat.tasks.map(task =>
              task.id === taskId ? { ...task, title, color } : task
            ),
          }
        : cat
    );
    setCategories(newCategories);
    await saveData(newCategories);
  }, [categories]);

  const toggleTask = useCallback(async (categoryId: string, taskId: string) => {
    const newCategories = categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            tasks: cat.tasks.map(task =>
              task.id === taskId ? { ...task, done: !task.done } : task
            ),
          }
        : cat
    );
    setCategories(newCategories);
    await saveData(newCategories);
  }, [categories]);

  const getCategory = useCallback((categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  }, [categories]);

  return {
    categories,
    isLoading,
    addCategory,
    deleteCategory,
    updateCategory,
    addTask,
    deleteTask,
    updateTask,
    toggleTask,
    getCategory,
  };
};
