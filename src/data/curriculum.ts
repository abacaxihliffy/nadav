export type Lesson = { id: string; title: string };
export type Track = {
  id: string;
  title: string;
  hours: number;
  cert?: boolean;
  lessons: Lesson[];
};

export const tracks: Track[] = [
  {
    id: "responsive-web-design",
    title: "Responsive Web Design",
    hours: 300,
    cert: true,
    lessons: [
      { id: "html-basics", title: "HTML Basics" },
      { id: "css-basics", title: "CSS Basics" },
      { id: "accessibility", title: "Accessibility Fundamentals" },
      { id: "flexbox", title: "Flexbox Layouts" },
      { id: "grid", title: "CSS Grid Layouts" },
    ],
  },
  {
    id: "javascript-algorithms",
    title: "JavaScript Algorithms and Data Structures",
    hours: 300,
    cert: true,
    lessons: [
      { id: "js-basics", title: "Basic JavaScript" },
      { id: "es6", title: "ES6 Features" },
      { id: "regex", title: "Regular Expressions" },
      { id: "data-structures", title: "Data Structures" },
      { id: "algorithms", title: "Algorithms" },
    ],
  },
  {
    id: "front-end-libraries",
    title: "Front End Development Libraries",
    hours: 300,
    cert: true,
    lessons: [
      { id: "react", title: "React" },
      { id: "redux", title: "Redux" },
      { id: "bootstrap", title: "Bootstrap" },
      { id: "jquery", title: "jQuery" },
      { id: "sass", title: "Sass" },
    ],
  },
  {
    id: "data-visualization",
    title: "Data Visualization",
    hours: 300,
    cert: true,
    lessons: [
      { id: "d3-basics", title: "D3.js Basics" },
      { id: "charts", title: "Building Charts" },
    ],
  },
  {
    id: "apis-microservices",
    title: "APIs and Microservices",
    hours: 300,
    cert: true,
    lessons: [
      { id: "node-basics", title: "Node.js Basics" },
      { id: "express", title: "Express.js" },
      { id: "mongodb", title: "MongoDB" },
      { id: "rest-api", title: "Building a REST API" },
    ],
  },
  {
    id: "quality-assurance",
    title: "Quality Assurance",
    hours: 300,
    cert: true,
    lessons: [
      { id: "testing", title: "Testing with Mocha/Chai" },
      { id: "functional-tests", title: "Functional Testing" },
    ],
  },
  {
    id: "scientific-computing-python",
    title: "Scientific Computing with Python",
    hours: 300,
    cert: true,
    lessons: [
      { id: "python-basics", title: "Python Basics" },
      { id: "numpy", title: "NumPy" },
      { id: "pandas", title: "Pandas" },
    ],
  },
  {
    id: "data-analysis-python",
    title: "Data Analysis with Python",
    hours: 300,
    cert: true,
    lessons: [
      { id: "data-cleaning", title: "Data Cleaning" },
      { id: "visualization", title: "Data Visualization" },
    ],
  },
  {
    id: "information-security",
    title: "Information Security",
    hours: 300,
    cert: true,
    lessons: [
      { id: "security-fundamentals", title: "Security Fundamentals" },
      { id: "helmetjs", title: "Using HelmetJS" },
    ],
  },
  {
    id: "machine-learning-python",
    title: "Machine Learning with Python",
    hours: 300,
    cert: true,
    lessons: [
      { id: "ml-basics", title: "Machine Learning Basics" },
      { id: "scikit-learn", title: "Scikit-learn" },
    ],
  },
];
