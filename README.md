# Tetris | JavaScript

Un juego de Tetris desarrollado con HTML, CSS y JavaScript puro. Incluye una interfaz retro-futurista responsive, controles para teclado y dispositivos tactiles, vista previa de la siguiente pieza y cambio de idioma entre espanol e ingles.

## Caracteristicas

- Tablero clasico de 10 x 20.
- Las siete piezas tradicionales de Tetris.
- Movimiento lateral, caida rapida y rotacion.
- Sistema de puntuacion, lineas y niveles.
- Aumento progresivo de la velocidad.
- Pausa y pantalla de fin de partida.
- Vista previa de la siguiente pieza.
- Controles tactiles para pantallas pequenas.
- Interfaz en espanol e ingles.
- Diseno responsive sin dependencias externas de JavaScript.

## Controles

| Accion | Teclado | Movil |
| --- | --- | --- |
| Mover a la izquierda | `←` | Boton izquierdo |
| Mover a la derecha | `→` | Boton derecho |
| Bajar pieza | `↓` | Boton inferior |
| Rotar pieza | `↑` | Boton de rotacion |
| Pausar o reanudar | `P` o `Espacio` | - |

La partida comienza al pulsar **Nueva partida**.

## Como ejecutar el proyecto

No requiere instalacion de dependencias ni servidor de desarrollo.

1. Clona el repositorio:

   ```bash
   https://github.com/jciasenza/Tetris_JS.git
   ```

2. Abre la carpeta del proyecto.
3. Abre `index.html` en el navegador.

Tambien puedes utilizar la extension **Live Server** de Visual Studio Code para ejecutarlo con recarga automatica.

## Estructura

```text
TETRIS/
├── app.js          # Logica del juego y controles
├── index.html      # Estructura de la interfaz
├── style.css       # Estilos y responsive design
└── tetris-icon.svg # Icono del proyecto
```

## Publicar en GitHub Pages

1. Sube el proyecto a un repositorio de GitHub.
2. Entra en **Settings > Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Selecciona la rama principal y la carpeta `/root`.
5. Guarda los cambios y espera a que GitHub genere la URL publica.

## Tecnologias

- HTML5
- CSS3
- JavaScript ES6+
- Canvas API

## Autor

**Juan Carlos Iasenza**

- GitHub: [@jciasenza](https://github.com/jciasenza)
- LinkedIn: [Juan Carlos Iasenza](https://www.linkedin.com/in/juan-carlos-iasenza-8119501a9/)
- Email: [iasenzajuancarlos@gmail.com](mailto:iasenzajuancarlos@gmail.com)

## Licencia

Este proyecto se publica con fines educativos y de portfolio.
