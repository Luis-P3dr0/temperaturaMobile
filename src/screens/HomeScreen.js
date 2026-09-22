import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import adafruit from '../services/api';

const TEMPERATURA_LIMITE = 20.0;

const HomeScreen = () => {
    const [temperatura, setTemperatura] = useState(null);
    const [status, setStatus] = useState('Carregando...');
    const [error, setError] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [exibirHistorico, setExibirHistorico] = useState(false);

    const corStatus = status === "ALERTA" ? "#e74c3c" : "#2ecc71";

    useEffect(() => {
        const buscarTemperatura = async () => {
            try {
                const response = await adafruit.getUltimaTemperatura();
                const valor = parseFloat(response.data.value);

                setTemperatura(valor);
                setError(null);

                if (valor > TEMPERATURA_LIMITE) {
                    setStatus("ALERTA");
                } else {
                    setStatus("NORMAL");
                }

                // Ajusta o horário subtraindo 3 horas
                const data = new Date(response.data.created_at || Date.now());
                data.setHours(data.getHours() - 3);
                const horario = data.toLocaleTimeString();

                // Atualização funcional do histórico para evitar stale closure
                setHistorico((historicoAtual) => {
                    const novoItem = {
                        id: Date.now().toString(),
                        valor: valor,
                        horario: horario,
                    };

                    // Se a lista estiver vazia, adiciona a primeira leitura
                    if (historicoAtual.length === 0) {
                        return [novoItem];
                    }

                    // Pega a última leitura registrada
                    const ultimoItem = historicoAtual[historicoAtual.length - 1];

                    // Só adiciona se o valor for diferente do último registrado
                    if (ultimoItem.valor !== valor) {
                        return [...historicoAtual, novoItem];
                    }

                    // Se o valor for repetido, mantém o histórico sem alterações
                    return historicoAtual;
                });

            } catch (error) {
                console.log("Erro a buscar temperatura", error);
                setError("Não foi possível buscar a temperatura");
            }
        };

        buscarTemperatura();

        const intervalo = setInterval(buscarTemperatura, 3000);

        return () => clearInterval(intervalo);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Monitor de Temperatura.</Text>

            <Text style={styles.temperatura}>
                {temperatura != null ? `${temperatura.toFixed(2)}°C` : `Carregando`}
            </Text>

            <View style={[styles.statusBox, { backgroundColor: corStatus }]}>
                <Text style={styles.statusTexto}>{status}</Text>
            </View>

            {error && <Text style={styles.erro}>{error}</Text>}

            {/* Botão para alternar a exibição do histórico */}
            <TouchableOpacity
                style={styles.botaoHistorico}
                onPress={() => setExibirHistorico(!exibirHistorico)}
            >
                <Text style={styles.botaoHistoricoTexto}>
                    {exibirHistorico ? "Ocultar Histórico" : "Exibir Histórico"}
                </Text>
            </TouchableOpacity>

            {/* Exibição condicional da FlatList usando operador ternário */}
            {exibirHistorico ? (
                <View style={styles.historicoContainer}>
                    <Text style={styles.historicoTitulo}>Histórico de Mudanças:</Text>
                    <FlatList
                        data={historico}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.itemHistorico}>
                                <Text style={styles.itemTemperatura}>
                                    {item.valor.toFixed(2)}°C
                                </Text>
                                <Text style={styles.itemHorario}>
                                    {item.horario}
                                </Text>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text style={styles.vazioTexto}>
                                Nenhuma alteração registrada ainda.
                            </Text>
                        }
                        style={styles.lista}
                    />
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    width: 320,
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
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  statusTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  erro: {
    color: "red",
    marginTop: 10,
  },
  botaoHistorico: {
    marginTop: 16,
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  botaoHistoricoTexto: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  historicoContainer: {
    marginTop: 15,
    width: "100%",
    maxHeight: 180,
  },
  historicoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  lista: {
    width: "100%",
  },
  itemHistorico: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  itemTemperatura: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  itemHorario: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  vazioTexto: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    marginVertical: 10,
  },
});

export default HomeScreen;
