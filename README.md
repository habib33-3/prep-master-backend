---

# PrepMaster

## **Overview**

This project is a full-stack web application built with **Next.js**, **ShadCN**, **Firebase** for the frontend, and **NestJS** with **Prisma** for the backend. The app is designed to provide users with interactive and dynamic content, including exercises, solutions, and user management functionalities.

### **Frontend:**

- **Next.js**: A React-based framework for building modern, server-side-rendered web applications.
- **ShadCN**: A component library providing UI components that follow best practices for building scalable and maintainable frontend.
- **Firebase**: Provides authentication, real-time database services, and cloud storage for managing user data and other app-related assets.

### **Backend:**

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Prisma**: An ORM used with NestJS to interact with the database, allowing easy querying, migrations, and data management.

---

## **Features**

### **Frontend Features:**

- **Exercise Cards**:

  - Displays exercises in a card format with the topic and question text.
  - Interactive cards allow users to view answers by clicking a button.

- **Modals for Answer Viewing**:

  - Each exercise card has an associated modal that pops up when the user clicks "View Answer."
  - Displays both the question and its answer with a section for tags (topics related to the exercise).
  - Modals are visually appealing with smooth animations and centered content.

- **Pagination**:

  - A pagination system allows users to navigate through multiple pages of exercises, improving the user experience for large datasets.
  - The page number is updated dynamically via URL search parameters.

- **User Authentication**:

  - Firebase Authentication is used for managing user sign-ups and log-ins.
  - Secure login process with email/password and third-party authentication providers like Google.

- **Responsive UI**:
  - The application is fully responsive, adapting to different screen sizes with flexible layouts and components that adjust their size and position.

### **Backend Features:**

- **User Management**:

  - NestJS handles user management, ensuring proper authentication and authorization.
  - Data is securely stored in Firebase for authentication and user data.

- **Exercise Management**:

  - The backend provides CRUD operations for managing exercises (questions, answers, and associated tags).
  - Prisma interacts with the database to ensure seamless data management and querying.

- **API Endpoints**:

  - Exposed API endpoints for retrieving exercises, including pagination, filtering, and searching.
  - The backend handles requests to fetch exercises, update existing exercises, and retrieve answers for specific exercises.

- **Database**:
  - Prisma is used to manage the database schema and interact with the database.
  - The backend is connected to a PostgreSQL database via Prisma for storing exercise data and user details.

---

## **Tech Stack**

### **Frontend:**

- **Next.js** (React framework for server-side rendering)
- **ShadCN** (UI component library)
- **Firebase** (Authentication and real-time database)

### **Backend:**

- **NestJS** (Progressive Node.js framework)
- **Prisma** (ORM for database interactions)
- **PostgreSQL** (Relational database)

---

## **Installation & Setup**

### **Frontend Setup**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/habib33-3/prep-master-frontend
   cd prep-master-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Your app should now be running on `http://localhost:3000`.

---

## **Backend Setup**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/habib33-3/prep-master-backend
   cd prep-master-backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**: Ensure you have the correct environment variables set in your `.env` file, including your Firebase and PostgreSQL configuration.

4. **Run the backend server**:
   ```bash
   npm run start:dev
   ```
   Your backend should now be running on `http://localhost:4000`.

---

## **Usage**

1. **User Authentication**:

   - Users can sign up or log in via Firebase Authentication.
   - Once logged in, users can interact with exercise cards, view answers, and navigate through paginated exercise lists.

2. **Exercise Cards**:

   - Exercises are displayed in cards with topics, question text, and a "View Answer" button.
   - Clicking the "View Answer" button opens a modal that displays both the question and answer, along with associated tags.

3. **Pagination**:
   - Exercises are paginated to improve navigation through large datasets.
   - Pagination is handled by search parameters in the URL, and the page number is updated automatically.

---

Feel free to check out both the frontend and backend repositories to start working on the application!
