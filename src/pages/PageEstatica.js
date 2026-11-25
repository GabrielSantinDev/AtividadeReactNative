import WebViewSegura from "../components/WebViewSegura"

function PageEstatica() {
    return (
        <WebViewSegura
            uri="https://example.com"
            dominios={["example.com"]}
            // JS DESLIGADO: pagina estática (só HTML)
            jsHabilitado={false}
        />
    )
}

export default PageEstatica