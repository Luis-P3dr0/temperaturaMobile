import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import adafruit from "../services/api";

const UpdateTemperatura = ({ setTela }) => {
    const [valor, setValor] = useState("");
    const [mensagem, setMensagem] = useState(null);

    const enviarTemperatura = async () => {
        const temperatura = parseFloat(valor.replace(",", "."));
        if (isNaN(temperatura)) {
            setMensagem("Digite um valor numérico válido");
            return;
        }

        try {
            await adafruit.enviarTemperatura(temperatura);
            setMensagem("Temperatura enviada com sucesso!");
            setValor("");
        } catch (error) {
            console.log("Erro ao enviar temperatura", error);
            setMensagem("Não foi possível enviar a temperatura");
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

            <View style={styles.botoes}>
                <Button title="Enviar" onPress={enviarTemperatura} />
                <Button title="Voltar" onPress={() => setTela("home")} />
            </View>

            {mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        fontSize: 18,
        width: 220,
        textAlign: "center",
        backgroundColor: "#fff",
        color: "#333",
        marginBottom: 20,
    },
    botoes: {
        flexDirection: "row",
        gap: 12,
    },
    mensagem: {
        marginTop: 20,
        fontSize: 16,
        color: "#2ecc71",
    },
});

export default UpdateTemperatura;