import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

interface DaySchedule {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

const HorarioFuncionamento = () => {
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState<DaySchedule[]>([
    { day: 'Segunda-feira', openTime: '08:00', closeTime: '18:00', isOpen: true },
    { day: 'Terça-feira', openTime: '08:00', closeTime: '18:00', isOpen: true },
    { day: 'Quarta-feira', openTime: '08:00', closeTime: '18:00', isOpen: true },
    { day: 'Quinta-feira', openTime: '08:00', closeTime: '18:00', isOpen: true },
    { day: 'Sexta-feira', openTime: '08:00', closeTime: '18:00', isOpen: true },
    { day: 'Sábado', openTime: '09:00', closeTime: '17:00', isOpen: true },
    { day: 'Domingo', openTime: '10:00', closeTime: '16:00', isOpen: false },
  ]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [tempOpenTime, setTempOpenTime] = useState('');
  const [tempCloseTime, setTempCloseTime] = useState('');

  const openEditModal = (index: number) => {
    setSelectedDayIndex(index);
    setTempOpenTime(schedules[index].openTime);
    setTempCloseTime(schedules[index].closeTime);
    setEditModalVisible(true);
  };

  const formatTimeInput = (text: string): string => {
    
    const digits = text.replace(/\D/g, '');
    
    
    if (digits.length <= 2) {
      return digits;
    } else {
      
      const hours = digits.substring(0, 2);
      const minutes = digits.substring(2, 4);
      
      
      const hoursNum = parseInt(hours, 10);
      const validHours = hoursNum > 23 ? '23' : hours;
      
      
      const minutesNum = parseInt(minutes, 10);
      const validMinutes = minutesNum > 59 ? '59' : minutes;
      
      return `${validHours}:${validMinutes}`;
    }
  };

  const handleOpenTimeChange = (text: string) => {
    setTempOpenTime(formatTimeInput(text));
  };

  const handleCloseTimeChange = (text: string) => {
    setTempCloseTime(formatTimeInput(text));
  };

  const saveTimeChanges = () => {
    if (selectedDayIndex !== null) {
      if (!tempOpenTime || !tempCloseTime) {
        Alert.alert('Erro', 'Por favor, preencha todos os horários');
        return;
      }

      
      const formattedOpenTime = formatTimeDisplay(tempOpenTime);
      const formattedCloseTime = formatTimeDisplay(tempCloseTime);

      const newSchedules = [...schedules];
      newSchedules[selectedDayIndex] = {
        ...newSchedules[selectedDayIndex],
        openTime: formattedOpenTime,
        closeTime: formattedCloseTime,
      };
      setSchedules(newSchedules);
      setEditModalVisible(false);
      setSelectedDayIndex(null);
    }
  };

  const formatTimeDisplay = (time: string): string => {
    
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const formattedHours = hours.padStart(2, '0');
      const formattedMinutes = minutes.padStart(2, '0') || '00';
      return `${formattedHours}:${formattedMinutes}`;
    } else if (time.length <= 2) {
      return `${time.padStart(2, '0')}:00`;
    } else {
      return '00:00'; // Default fallback
    }
  };

  const toggleDayStatus = (index: number) => {
    const newSchedules = [...schedules];
    newSchedules[index].isOpen = !newSchedules[index].isOpen;
    setSchedules(newSchedules);
  };

  const formatTime = (time: string) => {
    return time || '--:--';
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#8A5A00" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Horários de Funcionamento</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {schedules.map((schedule, index) => (
            <View key={schedule.day} style={styles.dayCard}>
              <View style={styles.dayInfo}>
                <Text style={styles.dayName}>{schedule.day}</Text>
                {schedule.isOpen ? (
                  <Text style={styles.timeText}>
                    {formatTime(schedule.openTime)} - {formatTime(schedule.closeTime)}
                  </Text>
                ) : (
                  <Text style={styles.closedText}>Fechado</Text>
                )}
              </View>
              
              <View style={styles.dayActions}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    schedule.isOpen ? styles.openButton : styles.closedButton,
                  ]}
                  onPress={() => toggleDayStatus(index)}
                >
                  <Text style={styles.statusButtonText}>
                    {schedule.isOpen ? 'Aberto' : 'Fechado'}
                  </Text>
                </TouchableOpacity>
                
                {schedule.isOpen && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(index)}
                  >
                    <MaterialIcons name="edit" size={20} color="#8A5A00" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <Modal
          visible={editModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Editar Horário - {selectedDayIndex !== null ? schedules[selectedDayIndex].day : ''}
                </Text>
                
                <View style={styles.timeInputContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Horário de Abertura</Text>
                    <TextInput
                      style={styles.timeInput}
                      placeholder="08:00"
                      value={tempOpenTime}
                      onChangeText={handleOpenTimeChange}
                      keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Horário de Fechamento</Text>
                    <TextInput
                      style={styles.timeInput}
                      placeholder="18:00"
                      value={tempCloseTime}
                      onChangeText={handleCloseTimeChange}
                      keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                    />
                  </View>
                </View>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={saveTimeChanges}
                  >
                    <Text style={styles.modalButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF5E5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9D71C',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8A5A00',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8A5A00',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#B87A00',
  },
  closedText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  dayActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  openButton: {
    backgroundColor: '#4CAF50',
  },
  closedButton: {
    backgroundColor: '#F44336',
  },
  statusButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F9D71C',
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FCF5E5',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8A5A00',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeInputContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A5A00',
    marginBottom: 8,
  },
  timeInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#F9D71C',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#F9A826',
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default HorarioFuncionamento;