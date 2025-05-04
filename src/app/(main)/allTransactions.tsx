import TransactionList from '@/src/components/home/TransactionList';
import { useTransactionStore } from '@/src/store/transactionStore';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const AllTransactionsScreen = () => {

  const { allExpenses } = useTransactionStore();

  return (
    <View style={styles.container}>
      <FlatList
        data={allExpenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TransactionList transaction={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Transactions</Text>
          </View>
        )}
      />
    </View>
  )
}

export default AllTransactionsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
});