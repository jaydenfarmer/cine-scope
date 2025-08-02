# MovieMatch

MovieMatch is a modern Angular web app for discovering trending, popular, and free-to-watch movies and TV shows using the TMDB API. It features responsive design, animated skeleton loading cards, category filtering, and seamless mobile navigation for an engaging user experience.

## Features

- 🔥 **Trending, Popular, and Free-to-Watch Sections**  
  Browse movies and TV shows by what's trending, popular, or available to watch for free.

- ⚡ **Skeleton Loading Animations**  
  Smooth skeleton cards prevent layout shift and provide instant feedback while data loads.

- 📱 **Responsive & Mobile-Friendly**  
  Adaptive layouts, dropdowns, and a hamburger menu ensure a great experience on any device.

- 🖼️ **Image Fallbacks**  
  If a movie, show, or person has no image, a clear fallback is shown to keep the UI consistent.

- 🚀 **Fast & Performant**  
  Uses Angular’s OnPush change detection and explicit UI updates for optimal performance.

- 🛠️ **Modular & Extensible**  
  All API logic is in a dedicated service, and UI components are reusable and easy to extend.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Angular CLI](https://angular.dev/tools/cli)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/movie-match.git
   cd movie-match
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **TMDB API Key:**
   - Create a `.env` file or set the `NG_APP_TMDB_API_KEY` environment variable with your TMDB API key.
   - Example:
     ```
     NG_APP_TMDB_API_KEY=your_tmdb_api_key_here
     ```

### Development

Start the local development server:

```bash
ng serve
```

Visit [http://localhost:4200/](http://localhost:4200/) in your browser.

### Building for Production

```bash
ng build
```

The optimized build will be in the `dist/` directory.

### Running Tests

- **Unit tests:**
  ```bash
  ng test
  ```
- **End-to-end tests:**
  ```bash
  ng e2e
  ```

## Project Structure

- `src/app/components/` – UI components (media rows, people cards, nav bar, etc.)
- `src/app/services/` – API service for TMDB
- `src/assets/` or `public/` – Static images and fallback assets

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## License

[MIT](LICENSE)

---

**MovieMatch** – Discover your next favorite movie or show!
