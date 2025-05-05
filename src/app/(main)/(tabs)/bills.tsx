import UpcomingBillItem from "@/src/components/home/UpcomingBillItem";
import DefaultLoader from "@/src/components/loader/DefaultLoader";
import { useGetUpcomingBills } from "@/src/utils/query/upcomingBillQuery";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BillsScreen = () => {
  const [isRefetching, setIsRefetching] = useState(false);
  const { data, isLoading, refetch } = useGetUpcomingBills();

  const handleRefresh = async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  };

  if (isLoading) {
    return <DefaultLoader />;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ backgroundColor: "#fff", padding: 10, borderRadius: 12 }}
        >
          <Feather name="arrow-left" size={24} color={"#000"} />
        </Pressable>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff" }}>
          Upcoming Bills
        </Text>
        <Link
          href={"/allCreatedBills"}
          asChild
          style={{ backgroundColor: "#fff", padding: 10, borderRadius: 12 }}
        >
          <FontAwesome5 name="money-bill-wave" size={24} color="black" />
        </Link>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UpcomingBillItem bill={item} />}
        contentContainerStyle={{ gap: 16, paddingTop: 16 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", textAlign: "center", marginTop: 16 }}>No bills</Text>
        }
      />
    </SafeAreaView>
  );
};

export default BillsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  noBillsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
