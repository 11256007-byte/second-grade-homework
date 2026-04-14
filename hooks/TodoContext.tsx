import React, { createContext, ReactNode, useContext } from 'react';
import { Category, Task, useTodoData as useTodoDataHook } from './useTodoData';

export interface TodoContextType {
  categories: Category[];
  isLoading: boolean;
  addCategory: (name: string, color: string) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<void>;
  updateCategory: (categoryId: string, name: string, color: string) => Promise<void>;
  addTask: (categoryId: string, title: string, color: string) => Promise<Task>;
  deleteTask: (categoryId: string, taskId: string) => Promise<void>;
  updateTask: (categoryId: string, taskId: string, title: string, color: string) => Promise<void>;
  toggleTask: (categoryId: string, taskId: string) => Promise<void>;
  getCategory: (categoryId: string) => Category | undefined;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const todoData = useTodoDataHook();

  return (
    <TodoContext.Provider value={todoData}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
