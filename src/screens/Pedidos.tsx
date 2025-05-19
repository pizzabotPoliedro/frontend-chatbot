import React, { useState } from 'react';
import { 
  ScrollView, 
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, Check, X, Plus, ShoppingBag } from 'lucide-react-native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Tipagem para a stack de rotas (Pedidos sem parâmetros)
type RootStackParamList = {
  Pedidos: undefined;
  // outras rotas se tiver...
};

type PedidosNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Pedidos'>;

type PedidosProps = {
  navigation: PedidosNavigationProp;
};

type OrderStatusType = 'Entregue' | 'Em Progresso' | 'Cancelado';

type OrderStatusProps = {
  status: OrderStatusType;
};

const OrderStatus = ({ status }: OrderStatusProps) => {
  let backgroundColor, textColor, Icon;

  switch (status) {
    case 'Entregue':
      backgroundColor = '#E6F4EA';
      textColor = '#137333';
      Icon = Check;
      break;
    case 'Em Progresso':
      backgroundColor = '#FEF7CD';
      textColor = '#8A5A00';
      Icon = Clock;
      break;
    case 'Cancelado':
      backgroundColor = '#FEEAE6';
      textColor = '#C5221F';
      Icon = X;
      break;
    default:
      backgroundColor = '#F1F3F4';
      textColor = '#5F6368';
      Icon = Clock;
  }

  return (
    <View style={[styles.statusContainer, { backgroundColor }]}>
      <Icon size={16} color={textColor} style={styles.icon} />
      <Text style={[styles.statusText, { color: textColor }]}>{status}</Text>
    </View>
  );
};

type Item = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  date: string;
  status: OrderStatusType;
  items: Item[];
  total?: number;
};

type OrderCardProps = {
  order: Order;
  onPress: (order: Order) => void;
};

const OrderCard = ({ order, onPress }: OrderCardProps) => (
  <TouchableOpacity 
    style={styles.orderCard}
    onPress={() => onPress(order)}
    activeOpacity={0.9}
  >
    <View style={styles.orderHeader}>
      <View>
        <Text style={styles.orderId}>Pedido #{order.id}</Text>
        <Text style={styles.orderDate}>{order.date}</Text>
      </View>
      <OrderStatus status={order.status} />
    </View>
    
    <View style={styles.itemsContainer}>
      {order.items.map((item: Item, index: number) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemQuantity}>{item.quantity}x</Text>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
          <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  </TouchableOpacity>
);

const EmptyState = ({ filterStatus }: { filterStatus: 'all' | OrderStatusType }) => {
  const getMessage = (status: typeof filterStatus) => {
    switch (status) {
      case 'Entregue':
        return 'Nenhum pedido entregue ainda.';
      case 'Em Progresso':
        return 'Você não tem pedidos em preparo.';
      case 'Cancelado':
        return 'Nenhum pedido foi cancelado.';
      default:
        return 'Você ainda não fez nenhum pedido.';
    }
  };

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <ShoppingBag size={48} color="#8A5A00" />
      </View>
      <Text style={styles.emptyTitle}>Nada por aqui</Text>
      <Text style={styles.emptySubtitle}>{getMessage(filterStatus)}</Text>
    </View>
  );
};

const Pedidos = ({ navigation }: PedidosProps) => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1234',
      date: '16 Maio, 14:30',
      status: 'Entregue',
      items: [
        { name: 'X-Burger', quantity: 1, price: 18.90 },
        { name: 'Batata Frita', quantity: 1, price: 12.50 },
        { name: 'Coca-Cola', quantity: 2, price: 8.00 }
      ],
      total: 47.40
    },
    {
      id: '1235',
      date: '16 Maio, 16:45',
      status: 'Em Progresso',
      items: [
        { name: 'Pizza Margherita', quantity: 1, price: 45.00 },
        { name: 'Água Mineral', quantity: 1, price: 5.00 }
      ],
      total: 50.00
    },
    {
      id: '1236',
      date: '15 Maio, 20:15',
      status: 'Cancelado',
      items: [
        { name: 'Salada Caesar', quantity: 1, price: 28.50 },
        { name: 'Suco de Laranja', quantity: 1, price: 9.00 }
      ],
      total: 37.50
    },
    {
      id: '1237',
      date: '14 Maio, 13:20',
      status: 'Entregue',
      items: [
        { name: 'Parmegiana', quantity: 1, price: 36.90 },
        { name: 'Arroz', quantity: 1, price: 8.00 },
        { name: 'Guaraná', quantity: 1, price: 7.50 }
      ],
      total: 52.40
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatusType>('all');

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const handleOrderPress = (order: Order) => {
    console.log('Order pressed:', order);
    // aqui você pode navegar para detalhes do pedido se quiser
  };

  const FilterTab = ({ label, value }: { label: string; value: 'all' | OrderStatusType }) => (
    <TouchableOpacity 
      style={[
        styles.filterTab, 
        filterStatus === value && styles.activeFilterTab
      ]}
      onPress={() => setFilterStatus(value)}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.filterTabText,
        filterStatus === value && styles.activeFilterTabText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Meus Pedidos</Text>
          <Text style={styles.headerSubtitle}>Acompanhe seus pedidos recentes</Text>
        </View>
        
        {/* Filter tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          <FilterTab label="Todos" value="all" />
          <FilterTab label="Em preparo" value="Em Progresso" />
          <FilterTab label="Entregues" value="Entregue" />
          <FilterTab label="Cancelados" value="Cancelado" />
        </ScrollView>
      </View>

      {/* Orders list */}
      <ScrollView 
        style={styles.ordersList}
        contentContainerStyle={
          filteredOrders.length === 0 
            ? { flexGrow: 1 } 
            : { paddingBottom: 100 }
        }
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onPress={handleOrderPress} 
            />
          ))
        ) : (
          <EmptyState filterStatus={filterStatus} />
        )}
      </ScrollView>
      
      {/* Add order button */}
      <TouchableOpacity style={styles.addButton}>
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (estilos iguais ao seu código original)
  container: {
    flex: 1,
    backgroundColor: '#FCF5E5',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#F9A826',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  headerContent: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filtersContainer: {
    paddingBottom: 8,
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 247, 205, 0.3)',
  },
  activeFilterTab: {
    backgroundColor: 'white',
  },
  filterTabText: {
    fontWeight: '600',
    color: '#8A5A00',
    fontSize: 14,
  },
  activeFilterTabText: {
    color: '#F9A826',
  },
  ordersList: {
    paddingHorizontal: 24,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderId: {
    fontWeight: '600',
    fontSize: 16,
    color: '#121212',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  icon: {
    marginRight: 6,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemInfo: {
    flexDirection: 'row',
  },
  itemQuantity: {
    fontWeight: '600',
    color: '#121212',
    marginRight: 6,
  },
  itemName: {
    color: '#121212',
  },
  itemPrice: {
    fontWeight: '600',
    color: '#121212',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIconContainer: {
    backgroundColor: '#FDF5D7',
    borderRadius: 50,
    padding: 24,
    marginBottom: 24,
  },
  emptyTitle: {
    fontWeight: '600',
    fontSize: 24,
    color: '#8A5A00',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8A5A00',
    textAlign: 'center',
    maxWidth: 280,
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    backgroundColor: '#F9A826',
    padding: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Pedidos;

