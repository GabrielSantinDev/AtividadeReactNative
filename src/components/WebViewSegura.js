import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { ActivityIndicator } from 'react-native-paper';

// Extrai o host de uma URL https (sem usar new URL, que é limitado no Hermes)
function pegarHost(url) {
  const resultado = /^https:\/\/([^/?#:]+)/i.exec(url);
  return resultado ? resultado[1].toLowerCase() : null;
}

// Aceita o domínio exato ou subdomínios dele (ex.: www.ifpr.edu.br)
function dominioPermitido(url, dominios) {
  const host = pegarHost(url);
  if (!host) return false;
  return dominios.some((d) => host === d || host.endsWith('.' + d));
}

export default function WebViewSegura({ uri, dominios, jsHabilitado }) {
  // 1) LISTA DE PERMISSÕES: só https dos domínios informados
  const originWhitelist = dominios.flatMap((d) => [
    `https://${d}`,
    `https://*.${d}`,
  ]);

  // 2) BLOQUEIO DE REDIRECIONAMENTO EXTERNO
  // Chamado antes de cada navegação. Retorna false e cancela o carregamento
  function aoIniciarRequisicao(request) {
    const url = request.url;

    if (url === 'about:blank' || dominioPermitido(url, dominios)) {
      return true; // dentro do domínio permitido: carrega na WebView
    }

    // Fora do domínio: bloqueia aqui e abre no navegador padrão
    // Só abre https pra não executar esquemas estranho
    if (/^https?:\/\//i.test(url)) {
      Linking.openURL(url);
    }
    return false;
  }

  return (
    <WebView
      style={styles.webview}
      source={{ uri }}
      originWhitelist={originWhitelist}
      onShouldStartLoadWithRequest={aoIniciarRequisicao}
      // Links com target="_blank" carregam na mesma WebView e passam pelo filtro acima
      setSupportMultipleWindows={false}
      // 3) JAVASCRIPT: true somente quando a página precisa (decidido por tela)
      javaScriptEnabled={jsHabilitado}
      // Proteções extras
      allowFileAccess={false}
      mixedContentMode="never"
      thirdPartyCookiesEnabled={false}
      startInLoadingState
      renderLoading={() => (
        <ActivityIndicator style={styles.loading} size="large" />
      )}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});