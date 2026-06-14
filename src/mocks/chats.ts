import type { Chat } from "./types";

export const chats: Chat[] = [
  {
    id: 1,
    title: "Приветственный чат",
    avatarUrl: "https://placehold.co/64/lightgrey/lightgrey/png",
    unreadCount: 2,
    lastMessage: {
      author: "Бот",
      text: "<b>Добро пожаловать!</b>",
      time: "09:20",
    },
    createdBy: 0,
    members: [
      {
        id: 0,
        name: "Бот",
        login: "bot",
        avatarUrl: "https://placehold.co/64/lightpink/lightpink/png",
        initials: "Б",
        isOwner: true,
      },
    ],
    messages: [
      { id: 1, type: "date", text: "19 июня" },
      {
        id: 2,
        type: "in",
        author: "Бот",
        time: "09:18",
        text: "Привет! Это приветственный чат. Тут можно потренироваться отправлять сообщения и смотреть, как выглядят входящие.",
      },
      {
        id: 3,
        type: "in",
        author: "Бот",
        time: "09:19",
        text: "А ещё сюда можно прикреплять картинки.",
        imageUrl: "https://placehold.co/320x240/eeeeee/cccccc/png",
      },
      { id: 4, type: "out", time: "09:20", text: "Круто!", status: "read" },
    ],
  },
  {
    id: 2,
    title: "Frontend Crew",
    avatarUrl: "https://placehold.co/64/lightgrey/lightgrey/png",
    unreadCount: 0,
    lastMessage: {
      author: "Катя",
      text: "Код-ревью в четверг?",
      time: "18:05",
    },
    createdBy: 1,
    members: [
      {
        id: 1,
        name: "Катя",
        login: "katya",
        avatarUrl: "https://placehold.co/64/lightblue/lightblue/png",
        initials: "К",
        isOwner: true,
      },
      {
        id: 2,
        name: "Витя",
        login: "vitya",
        avatarUrl: "https://placehold.co/64/lightgreen/lightgreen/png",
        initials: "В",
        isOwner: false,
      },
      {
        id: 3,
        name: "Аня",
        login: "anya",
        avatarUrl: "https://placehold.co/64/lightsalmon/lightsalmon/png",
        initials: "А",
        isOwner: false,
      },
      {
        id: 4,
        name: "Лёша",
        login: "lyosha",
        avatarUrl: "https://placehold.co/64/lightseagreen/lightseagreen/png",
        initials: "Л",
        isOwner: false,
      },
    ],
    messages: [
      { id: 1, type: "date", text: "Сегодня" },
      {
        id: 2,
        type: "in",
        author: "Катя",
        time: "17:58",
        text: "Привет! Когда удобно созвон?",
      },
      {
        id: 3,
        type: "out",
        time: "18:00",
        text: "После 19:00 подойдёт?",
        status: "read",
      },
      {
        id: 4,
        type: "in",
        author: "Катя",
        time: "18:05",
        text: "Код-ревью в четверг?",
      },
    ],
  },
];

export const activeChatId: number | null = null;
