import { Question } from "../types/test.types";

export const mockQuestions: Question[] = [
  {
    id: 1,
    image: "/placeholder.svg",
    question: "",
    options: [
      "Поперечный перелом",
      "Косой перелом",
      "Спиральный перелом",
      "Оскольчатый перелом"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    image: "/placeholder.svg",
    question: "Определите тип вывиха на представленном снимке:",
    options: [
      "Передний вывих",
      "Задний вывих",
      "Нижний вывих",
      "Верхний вывих"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    image: "/placeholder.svg",
    question: "Какой сустав изображен на рентгенограмме?",
    options: [
      "Плечевой сустав",
      "Локтевой сустав",
      "Лучезапястный сустав",
      "Коленный сустав"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    image: "/placeholder.svg",
    question: "Определите патологию на снимке:",
    options: [
      "Артроз",
      "Остеопороз",
      "Остеомиелит",
      "Костная киста"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    image: "/placeholder.svg",
    question: "Какой вид проекции представлен на снимке?",
    options: [
      "Прямая проекция",
      "Боковая проекция",
      "Аксиальная проекция",
      "Косая проекция"
    ],
    correctAnswer: 0
  },
  {
    id: 6,
    image: "/placeholder.svg",
    question: "Определите локализацию перелома:",
    options: [
      "Диафиз",
      "Метафиз",
      "Эпифиз",
      "Апофиз"
    ],
    correctAnswer: 2
  },
  {
    id: 7,
    image: "/placeholder.svg",
    question: "Какой тип костной мозоли формируется на снимке?",
    options: [
      "Периостальная",
      "Эндостальная",
      "Интермедиарная",
      "Параоссальная"
    ],
    correctAnswer: 0
  },
  {
    id: 8,
    image: "/placeholder.svg",
    question: "Определите степень смещения отломков:",
    options: [
      "Без смещения",
      "Смещение по ширине",
      "Смещение под углом",
      "Ротационное смещение"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    image: "/placeholder.svg",
    question: "Какая стадия консолидации перелома представлена на снимке?",
    options: [
      "Первая стадия",
      "Вторая стадия",
      "Третья стадия",
      "Четвертая стадия"
    ],
    correctAnswer: 2
  },
  {
    id: 10,
    image: "/placeholder.svg",
    question: "Определите характер перелома по линии излома:",
    options: [
      "Зубчатый",
      "Косой",
      "Винтообразный",
      "Многооскольчатый"
    ],
    correctAnswer: 3
  }
];
