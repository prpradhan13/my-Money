import { View, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'

const DefaultLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={"#fff"} />
    </View>
  )
}

export default DefaultLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
