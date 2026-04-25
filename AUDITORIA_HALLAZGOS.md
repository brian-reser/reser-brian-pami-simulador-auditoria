# Auditoría de Sistemas PAMI - Hallazgos Clave

## Contexto
- **Incidente**: Agosto 2023 - Grupo ransomware Rhysida infiltró sistemas PAMI
- **Impacto**: 1.6 TB datos exfiltrados, 25 BTC rescate exigido, 5.2M afiliados sin servicio
- **Evaluación**: Fase 2 - Evaluación Post-Remediación (6 meses después)

## 5 Hallazgos Críticos (Fase 1 - ANTES)

### 1. Sin Segmentación de Red (ALTO)
- **ANTES**: Red plana sin VLANs, movimiento lateral libre entre redes administrativas, atención al público y servidores críticos
- **DESPUÉS**: VLANs estrictas implementadas con DMZ, servidores de BD aislados en segmento protegido, reglas firewall específicas por servicio

### 2. Sistemas sin Parches de Seguridad (ALTO)
- **ANTES**: Servidores críticos sin parches aplicados en +12 meses, sistemas operativos obsoletos sin soporte oficial
- **DESPUÉS**: Proceso automatizado mediante WSUS/SCCM, SLA definido (parches críticos en máximo 48 horas), plan activo de migración de sistemas legacy

### 3. Datos Sensibles sin Cifrado (ALTO)
- **ANTES**: Datos en reposo y tránsito sin cifrar, información de salud expuesta en texto plano
- **DESPUÉS**: TDE (Transparent Data Encryption) implementado, cifrado de datos en tránsito (TLS 1.2+)

### 4. Backups Accesibles desde la Red sin Protección (ALTO)
- **ANTES**: Backups accesibles desde la red, sin regla 3-2-1, sin WORM (Write Once Read Many)
- **DESPUÉS**: Backups con WORM implementado, regla 3-2-1 (3 copias, 2 medios diferentes, 1 offsite)

### 5. Monitoreo Inexistente (MEDIO)
- **ANTES**: Sin SIEM/SOC implementado, sin sincronización NTP, horarios incorrectos en logs
- **DESPUÉS**: SOC 24/7 implementado, NTP sincronizado, monitoreo centralizado

## Controles a Implementar (Fase 2 - DESPUÉS)

| Control | Estado ANTES | Estado DESPUÉS | Impacto |
|---------|-------------|----------------|---------|
| MFA (Autenticación Multifactor) | ❌ Desactivado | ✅ Activado | Bloquea acceso con credenciales robadas |
| WAF (Web Application Firewall) | ❌ Desactivado | ✅ Activado | Bloquea inyecciones SQL |
| Cifrado TDE | ❌ Desactivado | ✅ Activado | Datos sensibles protegidos |
| WORM Backup | ❌ Desactivado | ✅ Activado | Backups inmutables |
| Segmentación VLAN | ❌ Desactivado | ✅ Activado | Movimiento lateral bloqueado |
| NTP Sincronizado | ❌ Desactivado | ✅ Activado | Logs con timestamps correctos |
| SOC 24/7 | ❌ Desactivado | ✅ Activado | Monitoreo continuo |

## Bases de Datos Expuestas (Escenario ANTES)

1. **afiliados** - Información personal de 5.2M afiliados
2. **recetas_medicas** - Historial de medicamentos
3. **turnos_medicos** - Citas y atenciones médicas
4. **historias_clinicas** - Información de salud (SENSIBLE - Ley 25.326)
5. **empleados_sueldos** - Información salarial del personal

## Violaciones Normativas (ANTES)

- **Ley 25.326** (Protección de Datos Personales): Datos sensibles de salud expuestos sin cifrar
- **ISO 27001**: Falta de controles de acceso, cifrado, monitoreo
- **COBIT 2019**: Deficiencias en gestión de riesgos y continuidad

## Relación Costo-Beneficio

- **Riesgo Total Identificado**: $132M
- **Costo de Auditoría**: $43.9K
- **Inversión en Remediación (Primer Año)**: ~$1.5M
- **ROI**: 1.1% del riesgo total mitigado

## Logs sin NTP (ANTES)

Timestamps inconsistentes, no sincronizados:
- 14:23:45 (Hora incorrecta)
- 14:23:47 (Salto de 2 segundos)
- 14:23:42 (Retroceso de 5 segundos)

## Logs con NTP (DESPUÉS)

Timestamps perfectamente sincronizados:
- 2026-04-24T23:45:12.123Z
- 2026-04-24T23:45:13.456Z
- 2026-04-24T23:45:14.789Z
