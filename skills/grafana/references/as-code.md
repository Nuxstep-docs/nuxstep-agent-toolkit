# Dashboards como código

Escada de adoção — suba um degrau quando o atual doer; não comece pelo topo.

## 1. Provisioning por arquivo (base, qualquer instância)

JSON dos dashboards + YAML de provisioning no repo, montados na instância (ConfigMap no K8s, volume no Docker). Vale também para data sources e alerting.

```yaml
# provisioning/dashboards/acme.yaml
apiVersion: 1
providers:
  - name: acme
    folder: Acme
    type: file
    allowUiUpdates: false   # UI não é fonte
    options:
      path: /var/lib/grafana/dashboards
```

Fluxo de edição: exporta da UI de dev/staging → commita o JSON → PR → provisiona. A UI de produção é só leitura na prática.

## 2. Git Sync (Grafana 12+, GA em 2026)

Sincronização nativa bidirecional entre instância e repositório Git: dashboards/pastas editados na UI viram branch/PR; merge aplica na instância. Elimina o passo manual de exportar JSON — a UI vira um editor do repo, com review de PR no meio. Preferido quando a versão da instância suporta (confira com a tool MCP `get_approved_stack` e a doc da versão).

## 3. Terraform provider

Para o que é **infraestrutura** do Grafana: organização, data sources, pastas, permissões, alerting — junto do resto do IaC (skill `terraform`). Dashboards individuais via Terraform funcionam, mas o diff de JSON gigante em PR é ruim; prefira 1–2 para dashboards e deixe o conteúdo com eles.

## 4. Foundation SDK (programático)

SDK oficial (Go/TypeScript/Python/Java/PHP) que **gera** o JSON de dashboards por código tipado. Use quando há uma FAMÍLIA de dashboards com a mesma estrutura (um por serviço/cliente): o template vira função, o sprawl vira loop. O JSON gerado entra no repo e é provisionado pelos degraus 1–2 — o SDK só gera, não aplica.

## Anotações de deploy

No pipeline de deploy (skill `github-actions`), poste a annotation na API:

```bash
curl -s -X POST "$GRAFANA_URL/api/annotations" \
  -H "Authorization: Bearer $GRAFANA_SA_TOKEN" -H "Content-Type: application/json" \
  -d "{\"tags\":[\"deploy\",\"$APP\"],\"text\":\"$APP $VERSION\"}"
```

Service account com escopo mínimo (role só de annotations); token no cofre (skill `hashicorp-vault`), nunca no YAML.
