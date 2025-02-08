import { Exercise, PrismaClient } from "@prisma/client";

const exercises = [
    {
        questionText:
            "What is the difference between '==' and '===' in JavaScript?",
        answerText:
            "'==' compares values with type coercion, while '===' compares both value and type without coercion.",
        difficulty: "EASY",
        topicName: "JavaScript",
        tagList: ["comparison", "equality", "type coercion"],
        createdBy: "user@example.com",
    },
    {
        questionText: "Explain the event loop in JavaScript.",
        answerText:
            "The event loop is a mechanism that handles asynchronous operations in JavaScript, allowing non-blocking execution.",
        difficulty: "MEDIUM",
        topicName: "JavaScript",
        tagList: ["asynchronous", "event loop", "callbacks"],
        createdBy: "user@example.com",
    },
    {
        questionText: "What are Promises in JavaScript?",
        answerText:
            "Promises represent the eventual completion (or failure) of an asynchronous operation and its resulting value.",
        difficulty: "EASY",
        topicName: "JavaScript",
        tagList: ["promises", "async", "callbacks"],
        createdBy: "user@example.com",
    },
    {
        questionText: "How does the 'this' keyword work in JavaScript?",
        answerText:
            "'this' refers to the object that is executing the function, and its value depends on how the function is called.",
        difficulty: "MEDIUM",
        topicName: "JavaScript",
        tagList: ["this", "scope", "functions"],
        createdBy: "user@example.com",
    },
    {
        questionText: "What is the difference between var, let, and const?",
        answerText:
            "var has function scope, let and const have block scope. const cannot be reassigned.",
        difficulty: "EASY",
        topicName: "JavaScript",
        tagList: ["variables", "scope", "hoisting"],
        createdBy: "user@example.com",
    },
    {
        questionText: "Explain closures in JavaScript.",
        answerText:
            "Closures allow a function to remember and access its lexical scope even when called outside its scope.",
        difficulty: "HARD",
        topicName: "JavaScript",
        tagList: ["closures", "scope", "functions"],
        createdBy: "user@example.com",
    },
    {
        questionText: "What is the difference between REST and GraphQL?",
        answerText:
            "REST follows predefined endpoints, while GraphQL allows clients to specify the structure of responses.",
        difficulty: "MEDIUM",
        topicName: "APIs",
        tagList: ["REST", "GraphQL", "APIs"],
        createdBy: "user@example.com",
    },
    {
        questionText: "What are the HTTP methods used in RESTful APIs?",
        answerText: "Common methods include GET, POST, PUT, DELETE, PATCH.",
        difficulty: "EASY",
        topicName: "APIs",
        tagList: ["HTTP", "methods", "REST"],
        createdBy: "user@example.com",
    },
    {
        questionText: "Explain middleware in Express.js.",
        answerText:
            "Middleware functions are executed sequentially in the request-response cycle and can modify the request or response objects.",
        difficulty: "MEDIUM",
        topicName: "Node.js",
        tagList: ["Express", "middleware", "request-response"],
        createdBy: "user@example.com",
    },
    {
        questionText: "What is the difference between SQL and NoSQL databases?",
        answerText:
            "SQL databases are relational and use structured schemas, while NoSQL databases are non-relational and flexible.",
        difficulty: "MEDIUM",
        topicName: "Databases",
        tagList: ["SQL", "NoSQL", "databases"],
        createdBy: "user@example.com",
    },
    {
        questionText: "What is indexing in databases?",
        answerText:
            "Indexing improves query performance by reducing the number of disk accesses required to fetch data.",
        difficulty: "HARD",
        topicName: "Databases",
        tagList: ["indexing", "performance", "databases"],
        createdBy: "user@example.com",
    },
    {
        questionText: "Explain ACID properties in databases.",
        answerText:
            "ACID stands for Atomicity, Consistency, Isolation, and Durability, ensuring reliable transactions.",
        difficulty: "HARD",
        topicName: "Databases",
        tagList: ["ACID", "transactions", "databases"],
        createdBy: "user@example.com",
    },
    {
        questionText: "What is the virtual DOM in React?",
        answerText:
            "The virtual DOM is a lightweight copy of the actual DOM that React updates efficiently for performance.",
        difficulty: "EASY",
        topicName: "React",
        tagList: ["React", "virtual DOM", "performance"],
        createdBy: "user@example.com",
    },
    {
        questionText: "What are React hooks?",
        answerText:
            "Hooks are functions that let you use state and lifecycle features in function components.",
        difficulty: "MEDIUM",
        topicName: "React",
        tagList: ["hooks", "state", "React"],
        createdBy: "user@example.com",
    },
    {
        questionText:
            "Explain the difference between functional and class components in React.",
        answerText:
            "Functional components are stateless before hooks, while class components use lifecycle methods.",
        difficulty: "EASY",
        topicName: "React",
        tagList: ["components", "React", "state"],
        createdBy: "user@example.com",
    },
];

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding data...");

    for (const exercise of exercises) {
        await prisma.exercise.create({
            data: exercise as Exercise,
        });
    }

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
