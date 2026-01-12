import type { Guest } from "../types";
import RoboShmelPhoto from "../photos/RoboShmel.jpg";
import KyrillDinin from "../photos/KyrillDinin.jpeg";
import Brukau from "../photos/Brukau.jpeg";
import Solovievi from "../photos/Solovievi.jpeg";
import NikitasParents from "../photos/NikitasParents.jpg";
import Misnikovi from "../photos/Misnikovi.jpeg";
import LerasParents from "../photos/lerasparents.jpeg";
import Degri from "../photos/degri.jpeg";
import SvetaAssaad from "../photos/SvetaAssaad.jpeg";
import Goglovi from "../photos/goglovi.png";
import Olesya from "../photos/olesya.jpeg";
import Bogdan from "../photos/bogdan.jpeg";

export const GUESTS: Guest[] = [
  {
    id: 243,
    title: "Nikita's parents",
    titleRu: "Родители Никиты",
    names: ["Viatcheslav Nikolaievich Grishin", "Svetlana Yurievna Grishina"],
    namesRu: ["Вячеслав Николаевич Гришин", "Светлана Юрьевна Гришина"],
    children: [],
    languages: ["Russian", "English"],
    country: "Sweden",
    countryRu: "Швеция",
    photo: NikitasParents,
    details:
      "Distinguished scientists with a history at CERN. Tireless travelers who have explored more of the globe than most can imagine. The groom's primary support unit.",
    detailsRu:
      "Выдающиеся ученые, работавшие в CERN. Неутомимые путешественники, посетившие больше стран, чем можно вообразить. Главная опора жениха.",
  },
  {
    id: 248,
    title: "Valeriia's parents",
    titleRu: "Родители Валерии",
    names: ["Sergei Vladimirovich Krupin", "Valentina Genadievna Krupina"],
    namesRu: ["Сергей Владимирович Крупин", "Валентина Геннадьевна Крупина"],
    children: [],
    languages: ["Russian"],
    country: "Russia",
    countryRu: "Россия",
    photo: LerasParents,
    details:
      "Real estate experts from Russia. Known for their legendary hospitality and traditional Banya. Always welcoming, they represent the heart of the bride's family.",
    detailsRu:
      "Эксперты в сфере недвижимости из России. Известны своим легендарным гостеприимством и любовью к бане. Всегда рады гостям, представляют сердце семьи невесты.",
  },
  {
    id: 250,
    title: "Ekaterina Avdeeva & Bogdan Belyak",
    titleRu: "Екатерина Авдеева и Богдан Беляк",
    names: ["Ekaterina Avdeeva", "Bogdan Belyak"],
    namesRu: ["Екатерина Авдеева", "Богдан Беляк"],
    children: [],
    languages: ["Russian"],
    country: "Russia",
    countryRu: "Россия",
    photo: Bogdan,
    details:
      "Sister, nephew and godson of the bride. You will never leave their home hungry or sad!",
    detailsRu:
      "Сестра, племянник и крестник невесты. Из их дома вы никогда не уйдёте голодными или грустными!",
  },
  {
    id: 264,
    title: "Denis Grishin",
    titleRu: "Денис Гришин",
    names: ["Denis Grishin"],
    namesRu: ["Денис Гришин"],
    children: [],
    languages: ["Russian", "English"],
    country: "Russia",
    countryRu: "Россия",
    photo: Degri,
    details: "Groom's brother. A top manager, track cyclist and rock star.",
    detailsRu: "Брат жениха. Топ‑менеджер, трековый велогонщик и рок‑звезда.",
  },
  {
    id: 312,
    title: "Svetlana & Assaad Abousamra",
    titleRu: "Светлана и Ассаад Абусамра",
    names: ["Svetlana Charifoullina", "Assaad Abousamra"],
    namesRu: ["Светлана Шарифуллина", "Ассаад Абусамра"],
    children: ["Nadia Abousamra"],
    childrenRu: ["Надя Абусамра"],
    languages: ["English", "Russian", "French", "Arabic", "Dutch"],
    country: "Netherlands",
    countryRu: "Нидерланды",
    photo: SvetaAssaad,
    details:
      "Close friends of the groom. Their family has recently grown with the arrival of their daughter Nadya. Known for their unwavering support and warm hospitality.",
    detailsRu:
      "Близкие друзья жениха. Недавно их семья пополнилась дочерью Надей. Известны своей неизменной поддержкой и гостеприимством.",
  },
  {
    id: 346,
    title: "Alena & Yuri Brukau",
    titleRu: "Алена и Юрий Брюкау",
    names: ["Alena Briukova", "Yuri Brukau"],
    namesRu: ["Алена Брюкова", "Юрий Брюкау"],
    children: ["Lida Brukau", "Zoe Brukau"],
    childrenRu: ["Лида Брюкау", "Зои Брюкау"],
    languages: ["Russian", "English", "French"],
    country: "Switzerland",
    countryRu: "Швейцария",
    photo: Brukau,
    details:
      "Old friends; the bride and groom witnessed the very beginning of their relationship. They live in the mountains of Switzerland. He is a software consultant at AWS, and she supports women during childbirth as a midwife/doula.",
    detailsRu:
      "Давние друзья; жених и невеста были свидетелями начала их отношений. Живут в горах Швейцарии. Он — консультант по программному обеспечению в AWS, она помогает женщинам при родах (акушерка/доула).",
  },
  {
    id: 389,
    title: "Olesya & Irina Melnichuk",
    titleRu: "Олеся Мельничук",
    names: ["Olesya Melnichuk"],
    namesRu: ["Олеся Мельничук"],
    children: ["Irina Melnichuk"],
    childrenRu: ["Ирина Мельничук"],
    languages: ["Russian", "English"],
    country: "Switzerland",
    countryRu: "Швейцария",
    photo: Olesya,
    details:
      "A direct and honest friend living in the groom's childhood flat in Geneva. High integrity, no-nonsense attitude, but a core member of the social circle.",
    detailsRu:
      "Прямая и честная подруга, живущая в квартире в Женеве, где вырос жених. Человек слова, не терпит фальши, но с ней всегда круто проводить время.",
  },
  {
    id: 431,
    title: "Olesya & Andrei Misnikov",
    titleRu: "Олеся и Андрей Мисниковы",
    names: ["Olesya Misnikova", "Andrei Misnikov"],
    namesRu: ["Олеся Мисникова", "Андрей Мисников"],
    children: ["Liliana Misnikova", "Irina Misnikova"],
    childrenRu: ["Лилиана Мисникова"],
    languages: ["Russian", "English"],
    country: "Russia",
    countryRu: "Россия",
    photo: Misnikovi,
    details:
      "Olesya is the bride's schoolmate. A cheerful, close-knit family, the most party-going parents one could imagine.",
    detailsRu:
      "Олеся — одноклассница невесты. Дружная, весёлая семья, самые тусовые родители, которых только можно представить.",
  },
  {
    id: 487,
    title: "Ksenia & Sviatoslav Soloviev",
    titleRu: "Ксения и Святослав Соловьевы",
    names: ["Ksenia Solovieva", "Sviatoslav Soloviev"],
    namesRu: ["Ксения Соловьева", "Святослав Соловьев"],
    children: [],
    languages: ["Russian", "English"],
    country: "Russia",
    countryRu: "Россия",
    photo: Solovievi,
    details: "Friends of the bride. Beautiful and welcoming hedonists.",
    detailsRu: "Друзья невесты. Красивые и гостеприимные гедонисты.",
  },
  {
    id: 500,
    title: "Anastasia & Pavel Goglov",
    titleRu: "Анастасия и Павел Гогловы",
    names: ["Anastasia Goglova", "Pavel Goglov"],
    namesRu: ["Анастасия Гоглова", "Павел Гоглов"],
    children: ["Timothe Goglov", "Andrei Goglov"],
    childrenRu: ["Тимофей Гоглов", "Андрей Гоглов"],
    languages: ["Russian", "English", "French"],
    country: "Switzerland",
    countryRu: "Швейцария",
    photo: Goglovi,
    details:
      "Reliable friends of the groom, always ready to help. Parents of two awesome sons. Corporate employees by day, metal fans by night.",
    detailsRu:
      "Надёжные друзья жениха, всегда готовые прийти на помощь. Родители двух крутых сыновей. Сотрудники крупных корпораций днём, фанаты метала ночью.",
  },

  {
    id: 518,
    title: "Edgar Usupov",
    titleRu: "Эдгар Юсупов",
    names: ["Edgar Usupov"],
    namesRu: ["Эдгар Юсупов"],
    children: [],
    languages: ["Russian", "English"],
    country: "Indonesia",
    countryRu: "Индонезия",
    details:
      "Friend of the groom and bride from Bali. Recently went into seclusion as a hermit on the Indonesian islands. He will avoid speaking Russian with you until the very last moment (prefers to think and speak in English).",
    detailsRu:
      "Друг жениха и невесты с Бали. В последнее время удалился отшельничать на острова Индонезии. Будет избегать общения с вами на русском до последнего (предпочитает думать и говорить на английском).",
  },
  {
    id: 587,
    title: "Kirill Dynin",
    titleRu: "Кирилл Дынин",
    names: ["Kirill Dynin"],
    namesRu: ["Кирилл Дынин"],
    children: [],
    languages: ["Russian", "English"],
    country: "Russia",
    countryRu: "Россия",
    photo: KyrillDinin,
    details:
      "Friend of the bride, tireless traveler, healthy lifestyle in the morning, partying in the evening.",
    detailsRu:
      "Друг невесты, неутомимый путешественник, утром зож, вечером кутеж.",
  },
  {
    id: 645,
    title: "Dmitry Kalachev",
    titleRu: "Дмитрий Калачев",
    names: ["Dmitry Kalachev"],
    namesRu: ["Дмитрий Калачев"],
    children: [],
    languages: ["Russian", "English"],
    country: "Indonesia",
    countryRu: "Индонезия",
    photo: RoboShmelPhoto,
    details:
      "A kind soul from the Bali circle. Has transitioned to a sober. Modest mountain and surfing enthusiast, talented photographer.",
    detailsRu:
      "Добрая душа из круга общения на Бали. Перешел на трезвый образ жизни. Скромный любитель гор и серфинга, талантливый фотограф.",
  },
];
