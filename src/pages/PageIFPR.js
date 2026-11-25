import WebViewSegura from "../components/WebViewSegura"

function PageIFPR() {
    return (
        <WebViewSegura
            uri="https://www.ifpr.edu.br"
            dominios={["ifpr.edu.br"]}
            // JS LIGADO: site dinâmico
            jsHabilitado={true}
        />
    )
}

export default PageIFPR