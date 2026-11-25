import WebViewSegura from "../components/WebViewSegura"

function PageReactNative() {
    return (
        <WebViewSegura
            uri="https://reactnative.dev"
            dominios={["reactnative.dev"]}
            // JS LIGADO: documentação em react, menu lateral, busca e troca de paginas são feitos por JS no navegador
            jsHabilitado={true}
        />
    )
}

export default PageReactNative