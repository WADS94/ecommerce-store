import bcrypt from "bcryptjs";

const users =[
  {
    name: "Admin",
    email: "admin@casaviitorului.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Alex",
    email: "alex@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Oana",
    email: "oana@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Catalin",
    email: "catalin@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Mihai",
    email: "mihai@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Gabriela",
    email: "gabriela@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Andrei",
    email: "andrei@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Elena",
    email: "elena@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Ioana",
    email: "ioana@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Stefan",
    email: "stefan@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Maria",
    email: "maria@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Ion",
    email: "ion@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Camelia",
    email: "camelia@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Florin",
    email: "florin@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Adriana",
    email: "adriana@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Nicolae",
    email: "nicolae@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Anca",
    email: "anca@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Radu",
    email: "radu@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Sorina",
    email: "sorina@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Tudor",
    email: "tudor@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];


export default users;
