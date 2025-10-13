# Vinilos Plus - Máquina Expendedora de Vinilos

## Nueva Funcionalidad: Modo Claro/Oscuro 🌙☀️

### Descripción
Se ha implementado un sistema completo de alternancia entre modo claro y modo oscuro para mejorar la experiencia del usuario y proporcionar opciones de personalización visual.

### Características Implementadas

#### 🎨 **Sistema de Temas Dinámico**
- **Modo Claro**: Colores brillantes y suaves para uso diurno
- **Modo Oscuro**: Colores oscuros y contrastantes para uso nocturno o en ambientes con poca luz

#### 🔘 **Botón de Alternancia**
- Ubicado en la esquina superior derecha del header
- Diseño circular con efecto glassmorphism
- Icono dinámico que cambia según el tema:
  - 🌙 para activar modo oscuro
  - ☀️ para activar modo claro
- Animaciones suaves en hover y interacción

#### 💾 **Persistencia de Preferencias**
- La preferencia del usuario se guarda automáticamente en localStorage
- Al recargar la página, mantiene el tema seleccionado
- Soporte para detección automática del tema del sistema

#### 🎯 **Elementos Actualizados**
Todos los componentes de la interfaz se adaptan al tema seleccionado:

- **Header**: Gradientes y colores de texto
- **Contenedor principal**: Fondo y sombras
- **Tarjetas de productos**: Fondos y bordes
- **Panel de pagos**: Pantalla LCD y controles
- **Botones**: Gradientes y efectos hover
- **Modal de entrega**: Fondo y sombras
- **Footer**: Colores de fondo

#### 📱 **Diseño Responsivo**
- El botón de tema se adapta a diferentes tamaños de pantalla
- Posicionamiento optimizado para móviles y tablets
- Tamaños de icono ajustables

### Implementación Técnica

#### Variables CSS
Se implementó un sistema de variables CSS (`--custom-properties`) que permite cambios de tema instantáneos:

```css
:root {
  /* Tema claro */
  --bg-gradient-start: #667eea;
  --container-bg: white;
  --text-color: #333;
  /* ... más variables */
}

[data-theme="dark"] {
  /* Tema oscuro */
  --bg-gradient-start: #1a1a2e;
  --container-bg: #212529;
  --text-color: #e9ecef;
  /* ... más variables */
}
```

#### JavaScript Theme Manager
Sistema robusto de gestión de temas con las siguientes funcionalidades:

- **Inicialización automática**
- **Alternancia de temas**
- **Persistencia en localStorage**
- **Eventos personalizados**
- **Soporte para preferencias del sistema**
- **Manejo de errores**

### Cómo Usar

1. **Activar/Desactivar**: Haz clic en el botón circular en la esquina superior derecha
2. **Navegación por teclado**: Presiona `Enter` o `Espacio` cuando el botón esté enfocado
3. **Automático**: El tema se mantiene entre sesiones automáticamente

### Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos móviles y tablets
- ✅ Lectores de pantalla (atributos ARIA incluidos)
- ✅ Navegación por teclado

### Beneficios para el Usuario

- **Comfort visual**: Reduce la fatiga ocular en condiciones de poca luz
- **Personalización**: Permite al usuario elegir su preferencia visual
- **Accesibilidad**: Mejor contraste para usuarios con necesidades especiales
- **Modernidad**: Interfaz actualizada siguiendo tendencias actuales de UX/UI

### Archivos Modificados

- `index.html`: Agregado botón de tema y script
- `css/styles.css`: Variables CSS y estilos para ambos temas
- `js/theme.js`: Nuevo archivo para gestión de temas
- `js/main.js`: Inicialización del theme manager

¡La funcionalidad está lista para usar! 🎉