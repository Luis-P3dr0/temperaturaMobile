import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import UpdateTemp from './src/components/UpdateTemperatura';

export default function App() {
  const [tela, setTela] = useState('home');
  const [historico, setHistorico] = useState([]);

  return (
    <View style={styles.container}>
      {tela === 'home' ? (
        <HomeScreen historico={historico} setHistorico={setHistorico} />
      ) : (
        <UpdateTemp setTela={setTela} setHistorico={setHistorico} />
      )}
      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPress]}
        onPress={() => setTela('update')}
      >
        <Text style={styles.botaoTexto}>Atualizar Temperatura</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  botao: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  botaoPress: {
    backgroundColor: '#2980b9',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});