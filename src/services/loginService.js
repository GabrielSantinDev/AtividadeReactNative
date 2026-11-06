import {
    createUserWithEmailAndPassword, // Função importada para criar o usuário
    signInWithEmailAndPassword, // Função importada para o login
    sendPasswordResetEmail, // Função importada para redefinição de senha
    sendEmailVerification, // Função importada para verificar o e-mail
    signOut
} from 'firebase/auth';
import { auth } from '../../firebase-init';
import UsuarioRepository from '../repositories/UsuarioRepository';

const usuarioRepository = new UsuarioRepository()

function useAuthService() {

    const cadastrarEmailSenha = async (usuario) => {
    try {
        console.log("ETAPA 1: Criando conta");

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            usuario.email,
            usuario.senha
        );

        console.log("ETAPA 2: Conta criada", userCredential.user.uid);

        usuario.setId(userCredential.user.uid);

        console.log("ETAPA 3: Salvando no Firestore");

        await usuarioRepository.salvar(usuario);

        console.log("ETAPA 4: Dados salvos");

        await sendEmailVerification(userCredential.user);

        console.log("ETAPA 5: E-mail de verificação enviado");

        await signOut(auth);

        console.log("ETAPA 6: Cadastro finalizado");

    } catch (error) {
        console.error("ERRO NO CADASTRO:", error);
        throw error;
    }
};

    const loginEmailSenha = async (usuario) => {
        try {
            await signInWithEmailAndPassword(auth, usuario.email, usuario.senha);
        } catch (error) {
            throw error;
        }
    }

    const buscarUsuario = async (id) => {
        try {
            const usuarioBusca = await usuarioRepository.buscarId(id)
            return usuarioBusca
        } catch (error) {
            throw error
        }
    }


    const recuperarSenha = async (usuario) => {
        try {
            await sendPasswordResetEmail(auth, usuario.email);
        } catch (error) {
            throw error;
        }
    }

    return { cadastrarEmailSenha, loginEmailSenha, recuperarSenha, buscarUsuario };
}

export default useAuthService;