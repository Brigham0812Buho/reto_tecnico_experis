import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskFilterI } from '../features/TaskList/domain/entities/TaskFilter';
import TaskListView from '../features/TaskList/presentation/views/TaskListView';
import TaskFilterView from '../features/TaskFilter/presentation/views/TaskFilterView';
import TaskDetailView from '../features/TaskDetail/presentation/views/TaskDetailView';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type RootStackParamList = {
  Task:   undefined;
  TaskDetail: { taskId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [filter, setFilter]               = useState<TaskFilterI>({});

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Task" >
            {props => (
              <>
              <TaskListView
                {...props}
                filter={filter}
                onTaskPress={task =>
                  props.navigation.navigate('TaskDetail', { taskId: task.id })
                }
                onFilterPress={() => setFilterVisible(true)}
              />
              <TaskFilterView
                visible={filterVisible}
                currentFilter={filter}
                onApply={setFilter}
                onClose={() => setFilterVisible(false)}
              />
            </>
          )}
        </Stack.Screen>

        <Stack.Screen name="TaskDetail">
          {props => (
            <TaskDetailView
              taskId={props.route.params.taskId}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;