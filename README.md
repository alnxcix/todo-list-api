# 📌 TODO List API with TypeScript

An API for managing tasks, built with Node.js, Express and TypeScript.

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18+ recommended)
- **npm** (or **yarn** as an alternative)
- **Git**

### 📥 Cloning the Repository

Clone the repository to your local machine:

```sh
git clone https://github.com/alnxcix/todo-list-api.git
cd todo-list-api
```

### 📦 Installing Dependencies

After cloning, install the required dependencies:

```sh
npm install
```

### ▶️ Running the Server

Start the development server:

```sh
npm run dev
```

## 🧪 Running Unit Tests

Run tests using Jest:

```sh
npm test
```

For an interactive test watch mode:

```sh
npm run test:watch
```

To generate a test coverage report:

```sh
npm run test:coverage
```

## 🔍 Linting & Formatting

Ensure code quality and consistency:

```sh
npm run lint   # Check for linting errors
npm run format # Format code using Prettier
```

## 📦 Building for Production

Compile the TypeScript code into JavaScript:

```sh
npm run build
```

The output will be placed in the `/dist` folder.

Run the compiled code:

```sh
npm start
```

## 📂 Project Structure

```
TODO-LIST-API
│── __tests__/            # Unit tests
│   ├── task.test.ts      # Tests for task endpoints
│── coverage/             # Test coverage reports
│── dist/                 # Compiled output (ignored in .gitignore)
│── node_modules/         # Dependencies (ignored in .gitignore)
│── src/
│   ├── constants/        # Constant values
│   │   ├── taskConstants.ts
│   ├── controllers/      # Route controllers
│   │   ├── tasks.controller.ts
│   ├── data/             # In-memory task storage
│   │   ├── tasks.ts
│   ├── middleware/       # Middleware functions
│   │   ├── errorHandler.ts
│   ├── models/           # TypeScript interfaces/models
│   │   ├── Task.ts
│   ├── routes/           # Route definitions
│   │   ├── tasks.ts
│   ├── utils/            # Utility functions
│   │   ├── AppError.ts
│   │   ├── mergeSort.ts
│   ├── app.ts            # Main application entry point
│── .gitignore            # Ignored files and folders
│── .prettierrc           # Prettier configuration
│── eslint.config.js      # ESLint configuration
│── jest.config.js        # Jest configuration
│── package.json          # Project dependencies and scripts
│── package-lock.json     # Dependency lock file
│── README.md             # API documentation
│── tsconfig.json         # TypeScript configuration
```

## 📜 API Endpoints

### 🔹 Get all tasks

```http
GET /tasks
```

**Query Parameters:**

- `isCompleted` (boolean, optional) – Filter by completion status
- `sortBy` (string, optional) – Sort by `title`, `isCompleted`, `createdAt`, and `updatedAt`.
- `order` (string, optional) – Sort order (`asc` or `desc`)

### 🔹 Add a new task

```http
POST /tasks
```

**Body:**

```json
{
  "title": "New Task",
  "description": "Task details"
}
```

### 🔹 Update a task

```http
PUT /tasks/:id
```

**Body:**

```json
{
  "title": "Updated Task",
  "isCompleted": true
}
```

### 🔹 Delete a task

```http
DELETE /tasks/:id
```

### 🔹 Reorder tasks

```http
POST /tasks/reorder
```

**Body:**

```json
{
  "taskId": "123",
  "newPosition": 2
}
```

## 🛠️ Technologies Used

- Node.js
- Express
- TypeScript
- Jest (for unit testing)
- ESLint & Prettier
