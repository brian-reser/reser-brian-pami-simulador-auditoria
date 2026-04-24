# Concepto de Diseño: Simulador de Seguridad PAMI

## Análisis de Requisitos
El simulador debe presentar dos modos interactivos:
- **Modo Simulacro**: Visualiza ataques cibernéticos exitosos (vulnerabilidades)
- **Modo Protegido**: Muestra defensas bloqueando ataques

Estructura de 3 paneles: Muestras de ataque (izq), Escenario central, Log del sistema (der).

---

## Respuesta 1: Diseño Cyberpunk Técnico
**Probabilidad: 0.08**

### Filosofía de Diseño
Estética futurista y técnica que evoca salas de control de seguridad. Énfasis en datos en tiempo real, transiciones fluidas y una atmósfera de "centro de operaciones".

### Principios Clave
1. **Contraste Alto**: Fondos oscuros con acentos neón para máxima legibilidad y dramatismo
2. **Tipografía Monoespaciada**: Fuentes técnicas que refuerzan la naturaleza de auditoría
3. **Animaciones Continuas**: Pulsos, escaneos y transiciones que sugieren actividad en tiempo real
4. **Jerarquía Clara**: Datos críticos destacados con colores de alerta (rojo, naranja, verde)

### Filosofía de Color
- **Fondo Base**: Negro profundo (`#0a0e27`) para reducir fatiga visual
- **Acentos Primarios**: Cian (`#00d9ff`) y magenta (`#ff006e`) para contraste cyberpunk
- **Estados**: Verde (`#00ff41`) para "EN LÍNEA", Rojo (`#ff0055`) para "CRÍTICO"
- **Intención**: Crear sensación de urgencia y profesionalismo técnico

### Paradigma de Layout
- **Panel Izquierdo**: Tarjetas de ataque con bordes luminosos, apiladas verticalmente
- **Centro**: Área de simulación con borde animado que responde a eventos
- **Derecha**: Log técnico con scroll infinito y tipografía monoespaciada
- **Estructura**: 3 columnas con proporciones 1:2:1 en desktop

### Elementos Distintivos
1. **Bordes Luminosos Animados**: Líneas que se iluminan al interactuar
2. **Indicadores de Estado Pulsantes**: Círculos que parpadean según estado
3. **Efecto Scan**: Líneas horizontales que recorren áreas activas

### Filosofía de Interacción
- Clics disparan animaciones de "carga" visual
- Transiciones suaves entre pantallas con efecto de "fade" y "slide"
- Botones con efecto de "glow" al pasar el ratón

### Animaciones
- **Entrada**: Fade in + slide desde los bordes (300ms)
- **Botones**: Glow effect al hover, pulse al hacer clic
- **Log**: Scroll automático con líneas que aparecen de arriba hacia abajo
- **Transiciones de Pantalla**: Cortina vertical que se abre (400ms)

### Sistema Tipográfico
- **Títulos**: `JetBrains Mono Bold` 28px, tracking aumentado
- **Cuerpo**: `JetBrains Mono Regular` 14px
- **Etiquetas**: `JetBrains Mono` 12px, uppercase, letter-spacing

---

## Respuesta 2: Diseño Minimalista Corporativo
**Probabilidad: 0.07**

### Filosofía de Diseño
Interfaz limpia y profesional que prioriza la claridad de información. Inspirado en dashboards bancarios y de auditoría corporativa.

### Principios Clave
1. **Simplicidad Radical**: Solo lo necesario, sin decoración innecesaria
2. **Espaciado Generoso**: Aire entre elementos para reducir cognitive load
3. **Tipografía Neutral**: Sans-serif limpio y accesible
4. **Jerarquía Silenciosa**: Diferencias sutiles de peso y tamaño

### Filosofía de Color
- **Fondo**: Blanco puro (`#ffffff`) con grises muy claros para secciones
- **Primario**: Azul corporativo (`#0052cc`)
- **Estados**: Verde (`#28a745`), Rojo (`#dc3545`), Gris (`#6c757d`)
- **Intención**: Confianza, profesionalismo, accesibilidad

### Paradigma de Layout
- **Rejilla de 12 columnas**: Alineación perfecta
- **Tarjetas Planas**: Sin sombras, solo bordes sutiles
- **Espaciado Consistente**: Múltiplos de 8px
- **Estructura**: Paneles con separadores verticales claros

### Elementos Distintivos
1. **Indicadores Geométricos**: Cuadrados y círculos para estados
2. **Líneas Divisoras Sutiles**: Separadores en gris muy claro
3. **Tipografía Jerárquica**: Pesos que definen importancia

### Filosofía de Interacción
- Transiciones suaves pero rápidas (150ms)
- Feedback visual inmediato pero discreto
- Hover states con cambio de fondo sutil

### Animaciones
- **Entrada**: Fade in suave (200ms)
- **Botones**: Cambio de fondo al hover, sin efectos adicionales
- **Log**: Scroll suave sin animaciones de línea
- **Transiciones**: Fade simple entre pantallas

### Sistema Tipográfico
- **Títulos**: `Segoe UI Bold` 24px
- **Cuerpo**: `Segoe UI Regular` 14px
- **Etiquetas**: `Segoe UI` 12px

---

## Respuesta 3: Diseño Neumórfico Moderno
**Probabilidad: 0.09**

### Filosofía de Diseño
Interfaz con profundidad sutil usando sombras suaves y formas redondeadas. Inspirado en diseño neumórfico que simula superficies físicas.

### Principios Clave
1. **Profundidad Táctil**: Sombras suaves que crean sensación de relieve
2. **Formas Redondeadas**: Bordes suavizados en todos los elementos
3. **Colores Cálidos**: Paleta que evita frialdad técnica
4. **Interactividad Orgánica**: Transiciones que imitan movimiento natural

### Filosofía de Color
- **Fondo Base**: Beige cálido (`#f5f5f0`)
- **Primario**: Azul profundo pero cálido (`#2d5a7b`)
- **Acentos**: Naranja suave (`#e8956f`), Verde menta (`#6fb3a3`)
- **Estados**: Verde (`#5ec9a8`), Rojo (`#d97760`)
- **Intención**: Profesionalismo accesible y moderno

### Paradigma de Layout
- **Paneles Flotantes**: Tarjetas con sombra neumórfica
- **Espaciado Orgánico**: No rígido, sino fluido
- **Centro Focal**: Área de simulación como elemento principal
- **Estructura**: 3 columnas con márgenes generosos

### Elementos Distintivos
1. **Botones Neumórficos**: Presionables con sombra inset al hacer clic
2. **Tarjetas Elevadas**: Sombra suave que sugiere profundidad
3. **Iconografía Redondeada**: SVGs con bordes suavizados

### Filosofía de Interacción
- Clics producen efecto "hundimiento" visual
- Hover states con cambio de sombra
- Transiciones fluidas y naturales

### Animaciones
- **Entrada**: Bounce suave (400ms)
- **Botones**: Efecto inset al clic, bounce al soltar
- **Log**: Scroll con momentum suave
- **Transiciones**: Morph entre pantallas (350ms)

### Sistema Tipográfico
- **Títulos**: `Poppins Bold` 26px
- **Cuerpo**: `Inter Regular` 14px
- **Etiquetas**: `Inter Medium` 12px

---

## Decisión Final
Se selecciona **Respuesta 1: Diseño Cyberpunk Técnico** por:
- Alineación perfecta con la naturaleza de auditoría de ciberseguridad
- Capacidad de comunicar urgencia y profesionalismo simultáneamente
- Diferenciación visual clara entre Modo Simulacro y Modo Protegido
- Animaciones que refuerzan la sensación de "centro de operaciones"
