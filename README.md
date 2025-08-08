<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

# Pokedex API

> A RESTful API built with [NestJS](https://nestjs.com/) and MongoDB for managing Pokémon data.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [pnpm](https://pnpm.io/) or [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for MongoDB)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd pokedex
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Install NestJS CLI (if not already installed):**

   ```bash
   npm install -g @nestjs/cli
   ```

4. **Start MongoDB with Docker Compose:**

   ```bash
   docker compose up -d
   ```

5. **Run the development server:**
   ```bash
   pnpm dev
   # or
   npm run start:dev
   ```

---

## Project Structure

- `src/` - Main source code
- `public/` - Static files
- `docker-compose.yaml` - MongoDB service
- `test/` - End-to-end tests

---

## Useful Commands

- **Run in development:** `pnpm dev` or `npm run start:dev`
- **Run tests:** `pnpm test` or `npm test`
- **Lint:** `pnpm lint` or `npm run lint`

---

## License

This project is licensed under the MIT License.
