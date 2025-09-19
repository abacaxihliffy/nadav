import type { Course } from "../../../utils/loadCurriculum";
import { slugify, stripAfterComma } from "../../../utils/loadCurriculum";

const L = (t: string) => ({ id: slugify(stripAfterComma(t)), title: stripAfterComma(t) });

const html: Course = {
  id: "html",
  title: "HTML",
  sections: [
    {
      id: "basic-html",
      title: "Basic HTML",
      lessons: [
        L("Welcome Message from Quincy Larson, Completed"),
        L("Debug Camperbot's Profile Page, Completed"),
      ],
    },
  ],
};

export default html;
