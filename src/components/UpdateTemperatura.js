import react, { useState } from "react";

import adafruit from "../services/api";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const UpdateTemperatura = ({ onVoltar }) => {
  const [valor, setValor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const enviar = async () => {
    const numerico = parseFloat(valor.replace(",", "."));

    if (isNaN(numerico)) {
      setMensagem("Digite um valor de temperatura válido.");
      return;
    }

    try {
      setEnviando(true);
      await adafruit.enviarTemperatura(numerico);
      setMensagem("Temperatura publicada com sucesso!");
      setValor("");
    } catch (error) {
      console.log("erro ao publicar temperatura", error);
      setMensagem("Falha na conexão. Não foi possível publicar a temperatura.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Atualizar Temperatura</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a nova temperatura"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      {mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}

      <View style={styles.botaoArea}>
        <Button
          title={enviando ? "Enviando..." : "Enviar"}
          onPress={enviar}
          disabled={enviando}
          color="#2ecc71"
        />
        <Button title="Voltar" onPress={onVoltar} color="#e74c3c" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fbfbfb",
    paddingHorizontal: 30,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  mensagem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  botaoArea: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default UpdateTemperatura;