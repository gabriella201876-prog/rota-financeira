# Rota Financeira — Android

Aplicativo Android do **Rota Financeira** para motoristas de Uber e 99.

## Como gerar o APK

1. Envie todos os arquivos deste projeto para um repositório do GitHub.
2. Abra a aba **Actions**.
3. Selecione **Gerar APK Android**.
4. Clique em **Run workflow**.
5. Quando a execução terminar, abra-a e baixe o artefato **rota-financeira-apk**.

Esta versão usa cadastro e login próprios pelo Supabase, oferece 7 dias de teste e
sincroniza os dados de cada motorista. Não utiliza login do ChatGPT. Para a Play Store,
gere também o bundle com `:app:bundleRelease`.
