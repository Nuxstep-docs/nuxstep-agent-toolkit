# Runbook — Provisionar servidor Linux novo (Ubuntu/Debian)

Ordem pensada para **nunca se trancar fora**: cada mudança de acesso é testada numa SEGUNDA sessão antes de fechar a primeira. (RHEL-like: troque `apt`→`dnf`, `ufw`→`firewalld`.)

## 1. Base

```bash
apt update && apt full-upgrade -y
timedatectl set-timezone America/Sao_Paulo   # padrão do playbook (UTC-03); NTP via systemd-timesyncd
localectl set-keymap us-intl                 # teclado inglês internacional (padrão)
hostnamectl set-hostname <nome>
```

## 2. Usuário admin + sudo

```bash
adduser --gecos "" admin
usermod -aG sudo admin
mkdir -p /home/admin/.ssh && chmod 700 /home/admin/.ssh
echo '<sua-chave-publica>' > /home/admin/.ssh/authorized_keys
chmod 600 /home/admin/.ssh/authorized_keys && chown -R admin:admin /home/admin/.ssh
```

Sudo de serviço (quando um automatismo precisar): drop-in específico, nunca ALL:

```bash
visudo -f /etc/sudoers.d/deploy   # ex.: deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart app
```

## 3. SSH hardening (teste antes de fechar a sessão!)

`/etc/ssh/sshd_config.d/10-hardening.conf`:

```
PasswordAuthentication no
PermitRootLogin prohibit-password
KbdInteractiveAuthentication no
X11Forwarding no
MaxAuthTries 3
```

```bash
sshd -t && systemctl reload ssh
# NOUTRO terminal: ssh admin@servidor (chave) deve entrar; ssh -o PubkeyAuthentication=no deve FALHAR.
# Só feche a sessão original depois disso.
```

## 4. Firewall (default-deny)

A política é a mesma — negar entrada por padrão, abrir só o que o servidor serve —; a ferramenta muda por distro. Use UMA (não misture: duas camadas gerindo as mesmas regras = regra fantasma no incidente).

**Ubuntu/Debian — ufw:**

```bash
ufw default deny incoming && ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp && ufw allow 443/tcp    # só se este servidor serve web
ufw enable && ufw status verbose
```

**RHEL/Alma/Rocky/Fedora — firewalld:**

```bash
systemctl enable --now firewalld
firewall-cmd --set-default-zone=public               # public já nega o que não é serviço listado
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http --add-service=https   # só se serve web
firewall-cmd --reload && firewall-cmd --list-all
```

**Sem ufw/firewalld (distros mínimas) — nftables direto** (sucessor do iptables; prefira-o a regras iptables novas):

```bash
cat > /etc/nftables.conf <<'EOF'
table inet filter {
  chain input {
    type filter hook input priority 0; policy drop;
    ct state established,related accept
    iif lo accept
    tcp dport { 22, 80, 443 } accept
    icmp type echo-request accept
  }
}
EOF
nft -f /etc/nftables.conf && systemctl enable --now nftables
```

> iptables legado: em servidores antigos que já o usam, mantenha a ferramenta existente (`iptables -P INPUT DROP` + accepts equivalentes + `iptables-save` persistido) — migrar firewall em produção é tarefa deliberada, não efeito colateral.

## 5. fail2ban + atualizações automáticas

```bash
apt install -y fail2ban unattended-upgrades
printf '[sshd]\nenabled = true\nmaxretry = 5\nbantime = 1h\n' > /etc/fail2ban/jail.d/sshd.local
systemctl enable --now fail2ban && fail2ban-client status sshd
dpkg-reconfigure -plow unattended-upgrades   # patches de segurança automáticos
```

## 6. Higiene do sistema

```bash
# Histórico de performance (sysstat/SAR): quando alguém investigar lentidão,
# o histórico JÁ existe — sem ele, todo incidente começa às cegas.
apt install -y sysstat
sed -i 's/ENABLED="false"/ENABLED="true"/' /etc/default/sysstat 2>/dev/null || true
systemctl enable --now sysstat
# Consulta depois: sar -u (CPU), sar -r (memória), sar -q (load), sar -b (I/O)
# — com -f /var/log/sysstat/sa<dia> para dias anteriores.
```

```bash
# journald com teto (logs não comem o disco)
mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\nSystemMaxUse=500M\n' > /etc/systemd/journald.conf.d/size.conf
systemctl restart systemd-journald
# swap pequena se RAM < 4GB (evita OOM matando o serviço — visto em caso real)
```

Serviços da aplicação: unit systemd com `User=app` dedicado, `Restart=on-failure`, env em `EnvironmentFile=` com permissão 600.

## 7. Verificação final (de FORA do servidor)

```bash
ssh admin@servidor 'sudo -v && echo sudo-ok'   # chave + sudo funcionam
ssh -o PubkeyAuthentication=no admin@servidor  # DEVE recusar (sem prompt de senha)
ssh root@servidor                              # DEVE recusar senha
nmap -Pn servidor                              # só as portas abertas esperadas
ssh admin@servidor 'sudo ss -tlnp'             # nada escutando além do previsto
ssh admin@servidor 'sudo fail2ban-client status sshd'
```

Registre no projeto: IP/host, portas abertas, quem tem chave, e onde está o backup da configuração.
