import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>native-mate</Text>
        <Text style={styles.subtitle}>It works!</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  header: { paddingTop: 80, paddingHorizontal: 20, alignItems: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#a1a1aa', fontSize: 16, marginTop: 8 },
})
