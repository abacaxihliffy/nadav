export type Track = {
  id: string;
  title: string;
  hours: number;
  cert?: boolean;
  lessons: { id: string; title: string }[];
};

export const tracks: Track[] = [
  {
    id: "responsive-web-design",
    title: "Responsive Web Design",
    hours: 300,
    cert: true,
    lessons: [
      { id: "html-basics", title: "Learn HTML by Building a Cat Photo App" },
      { id: "css-basics", title: "Learn CSS by Building a Cafe Menu" },
      { id: "accessibility", title: "Accessibility Quiz" },
    ],
  },
  {
    id: "javascript-algorithms",
    title: "JavaScript Algorithms and Data Structures",
    hours: 300,
    cert: true,
    lessons: [
      { id: "js-basics", title: "Basic JavaScript" },
      { id: "es6", title: "ES6" },
      { id: "regex", title: "Regular Expressions" },
    ],
  },
  {
    id: "front-end-libraries",
    title: "Front End Development Libraries",
    hours: 300,
    lessons: [
      { id: "react", title: "React" },
      { id: "redux", title: "Redux" },
      { id: "bootstrap", title: "Bootstrap" },
    ],
  },
];
