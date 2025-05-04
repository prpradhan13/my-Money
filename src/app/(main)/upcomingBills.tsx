import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import DefaultLoader from '@/src/components/loader/DefaultLoader';
import { useGetUpcomingBills } from '@/src/utils/query/upcomingBillQuery';
import UpcomingBillItem from '@/src/components/home/UpcomingBillItem';

const UpcomingBillsScreen = () => {
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
    

    if (data?.length === 0) {
        return (
            <View style={styles.noBillsContainer}>
                <Text style={{color: "#fff"}}>No bills</Text>
            </View>        
        )
    }
    
  return (
    <View style={styles.container}>
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <UpcomingBillItem bill={item} />}
            contentContainerStyle={{gap: 16}}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />}
        />
    </View>
  )
}

export default UpcomingBillsScreen;

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

