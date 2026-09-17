import react, { useState, useEffect } from "react";

import adafruit from "../services/api";
import { View, Text, StyleSheet } from "react-native";

//Temperatura limite (alerta)
const TEMPERATURA_LIMITE = 20.0;

const HomeScreen = () => {
  const [temperatura, setTemperatura] = useState(null);
  const [status, setStatus] = useState("Aguardando...");
  const [erro, setErro] = useState(null);

  const corStatus = status === "ALERTA" ? "#e74c3c" : "#2ecc71";

  useEffect(()=>{
    const buscarTemperatura = async () => {
        try {
            const response = await adafruit.getUltimaTemperatura();
            const valor = parseFloat(response.data.value);
            
            setTemperatura(valor);
            setErro(null);

            if (valor > TEMPERATURA_LIMITE) {
                setStatus("ALERTA");
            } else {
                setStatus("NORMAL");
            }
            } catch (error) {
                console.log("erro ao buscar temperatura", erro);
                setErro("Não foi possivel buscar a temperatura");
            }
        }
        buscarTemperatura();

        const intervalo = setInterval(buscarTemperatura, 3000);

        return () => clearInterval(intervalo);
    },[])
  

  return (
    <View style={styles.container}>
      <Text Style={styles.titulo}> Monitor de Temperatura</Text>

      <Text styles={styles.temperatura}>
        {temperatura != null ? `${temperatura.toFixed(2)}°C}` : `Carregando`}
      </Text>
      <View style={[styles.statusBox, { BackgroundColor: corStatus }]}>
        <Text style={styles.statusTexto}>{status}</Text>
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
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  temperatura: {
    fontSize: 40,
    marginBottom: 20,
  },
  statusBox: {
    paddingVertical: 12,
    paddingHorizontal: 90,
    borderRadius: 8,
  },
  statusTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  erro: {
    color: "red",
    marginBottom: 10,
  },
});

export default HomeScreen;
