## **Backend Setup for PrepMaster**

---

### **Overview**

The backend of the PrepMaster project is built using **NestJS** with **Prisma** to manage interactions with the **PostgreSQL** database. It handles the user authentication, exercise data management, and exposes API endpoints for the frontend to retrieve and interact with the data.

---

### **Installation & Setup**

#### **1. Clone the Repository:**

First, clone the backend repository:

```bash
git clone https://github.com/habib33-3/prep-master-backend
cd prep-master-backend
```

#### **2. Install Dependencies:**

Run the following command to install the required dependencies:

```bash
npm install
```

#### **3. Run Database Migrations:**

Before starting the server, you'll need to run the Prisma migrations to set up your PostgreSQL database schema.

```bash
npx prisma migrate dev
```

This will apply all the database migrations and create the necessary tables for user and exercise data.

#### **4. Start the Development Server:**

Now, start the backend server:

```bash
npm run start:dev
```

The server will run on `http://localhost:5000`.

---

---

### **Tech Stack for Backend**

- **NestJS**: Framework for building efficient, scalable server-side applications.
- **Prisma**: ORM for interacting with the PostgreSQL database.
- **PostgreSQL**: Relational database for storing exercise and user data.
- **Firebase Authentication**: Provides secure user sign-ups and logins.
- **JWT (JSON Web Tokens)**: For secure authentication between the frontend and backend.

---

### **Usage**

#### **User Authentication**

- Users can sign up or log in using Firebase Authentication.
- JWT is used to authorize the user for accessing specific backend resources after they log in.

#### **Exercise Data Management**

- The backend manages exercise data including the topic, question, answer, and tags.
- Users can interact with the exercises through the frontend by adding, updating, or deleting exercises, depending on their role.

#### **Pagination**

- The API supports pagination for fetching exercises to handle large datasets efficiently. The frontend will dynamically update the page number in the URL, and the backend will return the appropriate slice of exercise data based on the pagination parameters.

---
