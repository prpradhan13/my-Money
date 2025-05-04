import TransactionList from '@/src/components/home/TransactionList';
import DefaultLoader from '@/src/components/loader/DefaultLoader';
import AddMoneyModal from '@/src/components/modal/AddMoneyModal';
import { useAddedMoneyStore } from '@/src/store/addedMoneyStore';
import { useTransactionStore } from '@/src/store/transactionStore';
import { formatCurrency } from '@/src/utils/helperFunction';
import { useGetUserAllAddedMoney } from '@/src/utils/query/addedMoneyQuery';
import { useGetUserAllPurchases } from '@/src/utils/query/purchaseQuery';
import { useGetUserDetails } from '@/src/utils/query/userQuery';
import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [addMoneyModalVisible, setAddMoneyModalVisible] = useState(false);

  const { data: userData, isLoading: userDataLoading } = useGetUserDetails();
  const { data: addedMoneyData, isLoading: addedMoneyDataLoading } =
    useGetUserAllAddedMoney();
  const { allExpenses, userAllTransactionAmount, setAllExpenses } =
    useTransactionStore();
  const { data: purchasesData, isLoading: purchasesLoading } =
    useGetUserAllPurchases();
  const { userTotalBalance, setUserBalance } = useAddedMoneyStore();

  useEffect(() => {
    if (purchasesData) {
      setAllExpenses(purchasesData);
    }
  }, [purchasesData, setAllExpenses]);

  useEffect(() => {
    if (addedMoneyData) {
      setUserBalance(addedMoneyData);
    }
  }, [addedMoneyData, setUserBalance]);

  if (userDataLoading || addedMoneyDataLoading || purchasesLoading)
    return <DefaultLoader />;

  if (!userData) {
    return (
      <View style={styles.noUserContainer}>
        <Text style={styles.noUserText}>No user</Text>
      </View>
    );
  }

  const userRestBalance = (userTotalBalance || 0) - (userAllTransactionAmount || 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.greetingText}>Hii,</Text>
            <Text style={styles.userNameText}>{userData.full_name}</Text>
          </View>

          <Feather name="bell" size={24} color={"#fff"} />
        </View>

        <View style={styles.balanceContainer}>
          <View>
            <Text style={styles.balanceLabel}>Total Savings</Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(userRestBalance ?? 0)}
            </Text>
          </View>

          <Pressable
            onPress={() => setAddMoneyModalVisible(true)}
            style={styles.addButton}
          >
            <Feather name="plus" color={"#fff"} size={26} />
          </Pressable>
        </View>

        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Transactions</Text>
            <Link href={"/allTransactions"} asChild>
              <Text style={styles.seeAllText}>See all</Text>
            </Link>
          </View>

          <View style={styles.transactionsList}>
            {!allExpenses || allExpenses.length === 0 ? (
              <View>
                <Text style={styles.noTransactionsText}>No Transactions</Text>
              </View>
            ) : (
              allExpenses
                .slice(0, 10)
                .map((transaction) => (
                  <TransactionList
                    key={transaction.id || transaction.item_name + transaction.created_at}
                    transaction={transaction}
                  />
                ))
            )}
          </View>
        </View>
      </ScrollView>

      {addMoneyModalVisible && (
        <View style={styles.modalContainer}>
          <AddMoneyModal
            modalVisible={addMoneyModalVisible}
            setModalVisible={setAddMoneyModalVisible}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  noUserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUserText: {
    color: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    color: '#fff',
    fontSize: 24,
  },
  userNameText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
  },
  balanceContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    height: 128,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  balanceLabel: {
    fontWeight: '500',
    fontSize: 18,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '600',
  },
  addButton: {
    borderRadius: 999,
    backgroundColor: '#000',
    padding: 12,
  },
  transactionsContainer: {
    flex: 1,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionsTitle: {
    color: '#e8e8e8',
    fontSize: 18,
    fontWeight: '500',
  },
  seeAllText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  transactionsList: {
    marginTop: 16,
  },
  noTransactionsText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
