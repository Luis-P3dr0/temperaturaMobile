import { useState } from "react";
import { StyleSheet, Text, View, Pressable } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import UpdateTemperatura from './src/components/UpdateTemperatura';

export default function App() {
  const [tela, setTela] = useState("home");

  return (
    <View style={styles.container}>
      {tela === "home" ? (
        <>
          <HomeScreen />
          <Pressable
            style={styles.botaoNavegar}
            onPress={() => setTela("update")}
          >
            <Text style={styles.botaoTexto}>Atualizar Temperatura</Text>
          </Pressable>
        </>
      ) : (
        <UpdateTemperatura onVoltar={() => setTela("home")} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  botaoNavegar: {
    backgroundColor: "#2ecc71",
    paddingVertical: 15,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 8,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});