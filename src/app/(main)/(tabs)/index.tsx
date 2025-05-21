import BillFlatList from "@/src/components/home/BillFlatList";
import TransactionList from "@/src/components/home/TransactionList";
import DefaultLoader from "@/src/components/loader/DefaultLoader";
import AddMoneyModal from "@/src/components/modal/AddMoneyModal";
import { useTransactionStore } from "@/src/store/transactionStore";
import { formatCurrency } from "@/src/utils/helperFunction";
import { useGetAllUnreadNotifications } from "@/src/utils/query/notificationQuery";
import { useGetUserAllPurchases } from "@/src/utils/query/purchaseQuery";
import { useGetUpcomingBills } from "@/src/utils/query/upcomingBillQuery";
import { useGetUserBalanceFromView, useGetUserDetails } from "@/src/utils/query/userQuery";
import Feather from "@expo/vector-icons/Feather";
import { Link, router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [addMoneyModalVisible, setAddMoneyModalVisible] = useState(false);

  const { data: userData, isLoading: userDataLoading } = useGetUserDetails();
  const {
    data: billData,
    isLoading: billDataLoading,
    refetch: refetchBillData,
  } = useGetUpcomingBills();
  const {
    data: purchasesData,
    isLoading: purchasesLoading,
    refetch: refetchPurchasesData,
  } = useGetUserAllPurchases();
  const { data: notificationsData } = useGetAllUnreadNotifications();

  const { data: userBalanceViewData, isLoading: userBalanceViewDataLoading, refetch: refetchUserBalanceViewData } = useGetUserBalanceFromView();

  const { allExpenses, setAllExpenses } = useTransactionStore();

  useEffect(() => {
    refetchBillData();
    refetchPurchasesData();
  }, [refetchBillData, refetchPurchasesData]);

  useEffect(() => {
    if (purchasesData && purchasesData !== allExpenses) {
      setAllExpenses(purchasesData);
    }
  }, [allExpenses, purchasesData, setAllExpenses]);

  const topExpenses = useMemo(
    () => allExpenses?.slice(0, 10) ?? [],
    [allExpenses]
  );

  if (
    userDataLoading ||
    userBalanceViewDataLoading ||
    purchasesLoading ||
    billDataLoading
  )
    return <DefaultLoader />;

  if (!userData) {
    return (
      <View style={styles.noUserContainer}>
        <Text style={styles.noUserText}>No user</Text>
      </View>
    );
  }


  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchBillData(),
      refetchPurchasesData(),
      refetchUserBalanceViewData(),
    ]);
    setRefreshing(false);
  };

  const Header = React.memo(({ userData }: { userData: any }) => (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.greetingText}>Hii,</Text>
        <Text style={styles.userNameText}>{userData.full_name}</Text>
      </View>
        <Pressable onPress={() => router.push("/notifications")} hitSlop={20} style={styles.notificationWrapper}>
          <Feather onPress={() => router.push("/notifications")} name="bell" size={24} color={"#fff"} />
          {notificationsData && notificationsData.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationsData.length}</Text>
            </View>
          )}
        </Pressable>
    </View>
  ));
  Header.displayName = "Header";

  const BalanceSection = React.memo(
    ({
      userRestBalance,
      onAddMoneyPress,
    }: {
      userRestBalance: number;
      onAddMoneyPress: () => void;
    }) => (
      <View style={styles.balanceContainer}>
        <View>
          <Link href={"/allBalanceAdded"} asChild>
            <Text style={styles.balanceLabel}>Balance Details</Text>
          </Link>
          <Text style={styles.balanceAmount}>
            {formatCurrency(userRestBalance ?? 0)}
          </Text>
        </View>
        <Pressable onPress={onAddMoneyPress} style={styles.addButton}>
          <Feather name="plus" color={"#fff"} size={26} />
        </Pressable>
      </View>
    )
  );
  BalanceSection.displayName = "BalanceSection";

  const TransactionsHeader = React.memo(() => (
    <View style={styles.transactionsHeader}>
      <Text style={styles.transactionsTitle}>Transactions</Text>
      <Link href={"/allTransactions"} asChild>
        <Text style={styles.seeAllText}>See all</Text>
      </Link>
    </View>
  ));
  TransactionsHeader.displayName = "TransactionsHeader";

  const MemoizedTransaction = React.memo(({ item }: { item: any }) => (
    <TransactionList transaction={item} />
  ));
  MemoizedTransaction.displayName = "MemoizedTransaction";

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <FlatList
        data={topExpenses}
        keyExtractor={(item) => item.id || item.item_name + item.created_at}
        renderItem={({ item }) => <MemoizedTransaction item={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <>
            <Header userData={userData} />
            <BalanceSection
              userRestBalance={userBalanceViewData?.rest_balance ?? 0}
              onAddMoneyPress={() => setAddMoneyModalVisible(true)}
            />
            {billData && billData.length > 0 && (
              <BillFlatList bills={billData} />
            )}
            <TransactionsHeader />
          </>
        }
        ListEmptyComponent={
          <Text style={styles.noTransactionsText}>No Transactions</Text>
        }
        contentContainerStyle={{ paddingBottom: 50 }}
        
        showsVerticalScrollIndicator={false}
      />

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
    justifyContent: "center",
    alignItems: "center",
  },
  noUserText: {
    color: "#fff",
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 24,
  },
  greetingText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "300",
  },
  userNameText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  balanceContainer: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  balanceLabel: {
    color: "#A0A0A0",
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  addButton: {
    borderRadius: 16,
    backgroundColor: "#2A2A2A",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionsContainer: {
    flex: 1,
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  transactionsTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  seeAllText: {
    color: "#A0A0A0",
    fontSize: 16,
    fontWeight: "500",
  },
  transactionsList: {
    marginTop: 16,
  },
  noTransactionsText: {
    color: "#A0A0A0",
    textAlign: "center",
    fontSize: 16,
    marginTop: 24,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  notificationWrapper: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
