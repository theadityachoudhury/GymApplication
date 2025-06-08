# Gym Frontend App

## 📂 Folder Structure

```
/src
│── assets/        # Stores static assets like images, fonts, and icons
│── components/    # Contains reusable UI components (buttons, modals, etc.)
│── config/        # Stores configuration files (constants, environment-related settings)
│── helpers/       # Utility functions and helper methods (formatting, validation)
│── hooks/         # Custom React hooks (useAuth, useFetch, etc.)
│── pages/         # Page-level components that represent different routes (Dashboard, Home, etc.)
│── schema/        # Type validation schemas (Yup, Zod) for form validation and API data structure
│── services/      # Handles API calls using Axios (axiosInstance.ts, authService.ts)
│── store/         # Global state management (Redux)
│── types/         # TypeScript types/interfaces (User.ts, ApiResponse.ts)
│── App.tsx        # Main application component
│── main.tsx       # Entry point for React application
│── index.css      # Global styles
```

---

## 🚀 Project Configuration

### ✅ **Router Setup**

- Configured using `react-router-dom` v6.
- Supports lazy loading with `React.Suspense`.

### ✅ **Environment Variables**

- Managed using `.env` and imported via `import.meta.env` through the config.

**Example `.env` file:**

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=GymFrontend
VITE_FRONTEND_URL=https://frontend-url.com
```

### ✅ **Axios Configuration**

- Centralized `axiosInstance.ts` inside `/services` for API requests.
- Uses request and response interceptors.
- Automatically attaches auth tokens from `localStorage`.

**Example usage:**

```tsx
import axiosInstance from "../services/axiosInstance";

const fetchData = async () => {
  const response = await axiosInstance.get("/data");
  console.log(response.data);
};
```

---

## 📦 Dependencies

### **Core Packages**

```bash
npm install react react-dom react-router-dom axios
```

### **State Management**

```bash
npm install redux react-redux @reduxjs/toolkit
```

### **Styling & UI**

```bash
npm install tailwindcss
```

---

## 🛠️ Setup & Installation

1. **Clone the repository:**

   ```bash
   git clone git@git.epam.com:epm-edai/project-runs/run-8.1/team-2/serverless/gym-app.git
   cd gym-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```
