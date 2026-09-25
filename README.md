# 🐉 Pokémon Markov Lab 
**Análisis Estocástico Exacto**

Laboratorio web interactivo y riguroso para la asignatura de **Cadenas de Markov y Aplicaciones**, diseñado para analizar la probabilidad y el comportamiento a largo plazo de ataques Pokémon utilizando ecuaciones estocásticas formales, sin recurrir a simulaciones de Monte Carlo.

---

## 📖 Contexto Académico
Este proyecto fue desarrollado por **Deyvi Ardila Forero** bajo la tutoría de la profesora **Johanna Garzón** en la **Universidad Nacional de Colombia**.

El modelo matemático y los conceptos de tiempo discreto implementados se fundamentan teóricamente en el libro base:
> 📘 **O. Häggström**, *Finite Markov Chains and Algorithmic Applications*. Cambridge University Press, (2002).

---

## 🚀 Funcionalidades Principales
- **Conexión con PokéAPI**: Búsqueda en tiempo real de movimientos (precisión, ratios de golpe crítico).
- **Cadenas Absorbentes (2 Estados)**: Cálculo de potencias de Chapman-Kolmogorov, probabilidades exactas de impacto y cálculo de tiempos de parada esperados ($\mathbb{E}[T_{01}]$).
- **Cadenas Recurrentes (3 Estados)**: Matrices de transición 3x3 dinámicas, cálculo de distribuciones estacionarias ($\pi$) resolviendo sistemas algebraicos lineales estáticos transpuestos y obtención de tiempos medios de recurrencia ($\mu$).
- **Cero Simulaciones (100% Analítico)**: Precisión matemática al calcular límites estacionarios teóricos (implementado con `mathjs`). No hay azar ni iteraciones de prueba.
- **Renderizado Matemático Premium**: Todas las fórmulas de Chapman-Kolmogorov, vectores límite y demostraciones son procesadas con tipografía $\LaTeX$ purista usando `KaTeX`.
- **Diseño Retro Accesible**: Estética inmersiva *Pokédex FireRed* con navegación web moderna (React Router + Tailwind CSS), pixel-perfect y con estándares WCAG de alto contraste.

---

## 🛠️ Tecnologías Empleadas
- **React 19 + Vite** (Framework Frontend)
- **TailwindCSS v4** (Arquitectura de Estilos y Paleta Temática)
- **Math.js** (Motor matemático para resolver sistemas $\pi (P - I) = 0$)
- **KaTeX** (Renderizado matemático tipográfico estricto)
- **React Router DOM** (Manejo de rutas internas y 404 dinámico)

---

## 💻 Instalación Local

Asegúrate de tener instalado [Node.js](https://nodejs.org/).

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/Poke-markov-lab.git
   cd Poke-markov-lab
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el servidor en entorno de desarrollo:
   ```bash
   npm run dev
   ```

---

## 🌎 Despliegue en GitHub Pages

Este repositorio está configurado y optimizado para ser servido por GitHub Pages estáticamente.
El archivo `vite.config.js` ya incluye `base: '/Poke-markov-lab/'`. 

Para desplegarlo de forma eficiente usando GitHub Actions, solo ve a la configuración de tu repositorio:
1. Ve a `Settings` > `Pages`.
2. En la sección **Source**, selecciona `GitHub Actions`.
3. GitHub te recomendará el workflow de despliegue de páginas estáticas. (Opcionalmente, puedes construirlo localmente subiendo la carpeta `dist/` a la rama `gh-pages`).

---

<p align="center">
  <small>Desarrollado para el análisis estocástico exacto. 2026.</small>
</p>
