# 🧭 Fluxo Git Simples e Sem Conflitos

Este é o fluxo padrão do time para manter o repositório limpo e evitar conflitos na `main`.

---

## 🚀 Passo a passo diário

```bash
# 1. Salvar o trabalho atual
```bash
git status
git add .
git commit -m "tipo: mensagem significativa"
```

# 2. Atualizar a main
```bash
git switch main
git pull origin
```

# 3. Atualizar sua branch de trabalho
```bash
git switch minha-branch
git rebase main
```

# 4. Enviar sua branch atualizada
```bash
git push
```

