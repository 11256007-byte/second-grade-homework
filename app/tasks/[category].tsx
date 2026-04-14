import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTodo } from '../../hooks/TodoContext';
import { Task } from '../../hooks/useTodoData';

const PRESET_COLORS = [
  '#FF3B30', // Red
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#34C759', // Green
  '#00B0FF', // Light Blue
  '#007AFF', // Blue
  '#5856D6', // Purple
  '#FF2D55', // Pink
  '#A2845E', // Brown
  '#8E8E93', // Gray
];

export default function TasksScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const { getCategory, addTask, deleteTask, toggleTask, updateTask } = useTodo();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#007AFF');

  useEffect(() => {
    const cat = getCategory(category as string);
    if (cat) {
      setCategoryData(cat);
      setTasks(cat.tasks);
    }
  }, [category, getCategory]);

  // Refresh data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const cat = getCategory(category as string);
      if (cat) {
        setCategoryData(cat);
        setTasks(cat.tasks);
      }
    }, [category, getCategory])
  );

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTaskId(task.id);
      setInputText(task.title);
      setSelectedColor(task.color);
    } else {
      setEditingTaskId(null);
      setInputText('');
      setSelectedColor(categoryData?.color || '#007AFF');
    }
    setModalVisible(true);
  };

  const handleSaveTask = async () => {
    if (!inputText.trim()) {
      Alert.alert('提示', '請輸入任務名稱!');
      return;
    }

    if (editingTaskId) {
      // 編輯現有任務
      await updateTask(category as string, editingTaskId, inputText.trim(), selectedColor);
    } else {
      // 新增任務
      await addTask(category as string, inputText.trim(), selectedColor);
    }

    setInputText('');
    setSelectedColor(categoryData?.color || '#007AFF');
    setEditingTaskId(null);
    setModalVisible(false);

    // 刷新數據
    const updatedCat = getCategory(category as string);
    if (updatedCat) {
      setTasks(updatedCat.tasks);
    }
  };

  const handleDeleteTask = (taskId: string, title: string) => {
    Alert.alert('刪除任務', `確定要刪除「${title}」嗎?`, [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(category as string, taskId);
          const updatedCat = getCategory(category as string);
          if (updatedCat) {
            setTasks(updatedCat.tasks);
          }
        },
      },
    ]);
  };

  const handleToggleTask = async (taskId: string) => {
    await toggleTask(category as string, taskId);
    const updatedCat = getCategory(category as string);
    if (updatedCat) {
      setTasks(updatedCat.tasks);
    }
  };

  const renderItem: ListRenderItem<Task> = ({ item }) => (
    <View style={styles.taskRow}>
      <View style={[styles.taskContent, { borderLeftColor: item.color }]}>
        <TouchableOpacity
          style={styles.taskTitleContainer}
          onPress={() => handleOpenModal(item)}
        >
          <Text style={[styles.taskTitle, item.done && styles.taskDone]}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
      <Switch
        value={item.done}
        onValueChange={() => handleToggleTask(item.id)}
        trackColor={{ false: '#ddd', true: item.color }}
        thumbColor="#fff"
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(item.id, item.title)}
      >
        <Ionicons name="trash" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="checkmark-done" size={64} color="#C7C7CC" />
      <Text style={styles.emptyText}>沒有任務</Text>
      <Text style={styles.emptySubText}>點擊 + 來新增第一個任務</Text>
    </View>
  );

  if (!categoryData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>類別未找到</Text>
      </SafeAreaView>
    );
  }

  const completedCount = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={[styles.title, { color: categoryData.color }]}>
          {categoryData.name}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Ionicons name="add-circle-sharp" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {totalCount > 0 && (
        <View style={styles.progressBar}>
          <Text style={styles.progressText}>
            完成 {completedCount} / {totalCount}
          </Text>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                  backgroundColor: categoryData.color,
                },
              ]}
            />
          </View>
        </View>
      )}

      {tasks.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* 新增/編輯任務 Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancel}>取消</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingTaskId ? '編輯任務' : '新增任務'}
              </Text>
              <TouchableOpacity onPress={handleSaveTask}>
                <Text style={styles.modalSave}>完成</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalForm}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.modalFormContent}
            >
              <Text style={styles.formLabel}>任務名稱</Text>
              <TextInput
                style={styles.input}
                placeholder="輸入任務名稱"
                value={inputText}
                onChangeText={setInputText}
                placeholderTextColor="#C7C7CC"
              />

              <Text style={styles.formLabel}>選擇顏色</Text>
              <View style={styles.colorPicker}>
                {PRESET_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
    marginRight: -8,
  },
  progressBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  list: {
    padding: 16,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
    borderLeftWidth: 4,
    paddingLeft: 12,
  },
  taskTitleContainer: {
    paddingVertical: 4,
  },
  taskTitle: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '500',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
    fontWeight: '400',
  },
  deleteButton: {
    marginLeft: 12,
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
    maxHeight: '90%',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalCancel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  modalSave: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalForm: {
    flex: 1,
  },
  modalFormContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 20,
  },
  colorOption: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: '#000000',
  },
});