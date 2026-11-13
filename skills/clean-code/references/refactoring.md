# Smells → Refactors

Catálogo de uso rápido: identifique o *smell*, aplique o refactor. Refatore em passos pequenos, com os testes verdes entre cada passo.

| Smell | Sinal | Refactor |
|---|---|---|
| Função rasa e longa | Mistura níveis de abstração; não dá para resumir em uma frase | Extrair métodos nomeados pelos passos de negócio (não por mecânica) |
| Aninhamento profundo | `if` dentro de `if` dentro de `else` | Guard clauses + retorno antecipado; inverter condições |
| Parâmetro booleano (flag) | `render(data, true, false)` — o chamador precisa decorar | Duas funções com nomes explícitos, ou objeto de opções nomeadas |
| Obsessão por primitivos | `string` para CPF, dinheiro em `number` solto | Value object com validação no construtor |
| Data clumps | Os mesmos 3 parâmetros viajando juntos por várias funções | Agrupar em um objeto/record com nome de domínio |
| Switch repetido sobre o mesmo tipo | O mesmo `switch(tipo)` em N lugares | Polimorfismo, mapa de handlers ou strategy |
| Comentário narrando o código | `// incrementa o contador` | Apagar; se o trecho precisa de narração, extraia-o com um bom nome |
| Catch vazio / genérico | `catch (e) {}` ou `catch { return null }` | Propagar com contexto ou tratar de verdade; nunca engolir |
| Variável reaproveitada | A mesma `result` significa 3 coisas ao longo da função | Uma variável por significado, declarada perto do uso |

## Antes / depois (guard clauses + nomes)

```ts
// ANTES
function proc(u: any, p: any) {
  if (u != null) {
    if (u.active) {
      if (p.total > 0) {
        // ... 30 linhas de regra de desconto misturada com log e persistência
      } else { return null; }
    } else { return null; }
  } else { return null; }
}

// DEPOIS
function applyLoyaltyDiscount(customer: Customer, order: Order): Discount | null {
  if (!customer?.isActive) return null;
  if (order.total <= 0) return null;

  const discount = calculateLoyaltyDiscount(customer, order); // regra pura, testável
  discountRepository.save(discount);                          // I/O isolado
  return discount;
}
```

O ganho não é o tamanho: é a interface clara (nome + tipos), os casos de borda visíveis no topo e a regra de negócio pura separada do I/O.
