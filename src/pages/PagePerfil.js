import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import {
    ActivityIndicator,
    Avatar,
    Card,
    List,
    Text
} from "react-native-paper";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../firebase-init";
import UsuarioRepository from "../repositories/UsuarioRepository";

const usuarioRepository = new UsuarioRepository();

function PagePerfil() {

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {

            if (!user) {
                setUsuario(null);
                setErro("Nenhum usuário autenticado.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setErro("");

                // Usa o UID do Firebase Authentication
                const usuarioBusca = await usuarioRepository.buscarId(user.uid);

                if (usuarioBusca) {
                    setUsuario(usuarioBusca);
                } else {
                    setErro("Dados do usuário não encontrados.");
                }

            } catch (error) {
                console.error("Erro ao buscar perfil:", error);
                setErro("Não foi possível carregar seu perfil.");

            } finally {
                setLoading(false);
            }
        });

        return unsubscribe;

    }, []);

    if (loading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
                <ActivityIndicator size="large" />
                <Text>Carregando perfil...</Text>
            </View>
        );
    }

    if (erro || !usuario) {
        return (
            <View style={{ padding: 20 }}>
                <Text>{erro || "Perfil não encontrado."}</Text>
            </View>
        );
    }

    const endereco = usuario.getEndereco();

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>

            <Card>
                <Card.Title
                    title="Meu Perfil"
                    subtitle="Informações da sua conta"
                    left={(props) => (
                        <Avatar.Icon
                            {...props}
                            icon="account"
                        />
                    )}
                />

                <Card.Content>

                    <List.Item
                        title="Nome completo"
                        description={usuario.getNome() || "Não informado"}
                        left={(props) => (
                            <List.Icon {...props} icon="account-outline" />
                        )}
                    />

                    <List.Item
                        title="E-mail"
                        description={usuario.getEmail() || "Não informado"}
                        left={(props) => (
                            <List.Icon {...props} icon="email-outline" />
                        )}
                    />

                    <List.Item
                        title="Telefone"
                        description={usuario.getTelefone() || "Não informado"}
                        left={(props) => (
                            <List.Icon {...props} icon="phone-outline" />
                        )}
                    />

                    <List.Item
                        title="Logradouro"
                        description={
                            endereco?.getLogradouro() || "Não informado"
                        }
                        left={(props) => (
                            <List.Icon {...props} icon="map-marker-outline" />
                        )}
                    />

                </Card.Content>
            </Card>

        </ScrollView>
    );
}

export default PagePerfil;