const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;

// لیست جداگانه کتگوری‌ها
const categories = [
  {
    id: 1,
    name: "Tshirt",
    slug: "tshirt",
  },
  {
    id: 2,
    name: "Shoe",
    slug: "shoe",
  },
  {
    id: 3,
    name: "Handbag",
    slug: "handbag",
  },
  {
    id: 4,
    name: "Hat",
    slug: "hat",
  },
  {
    id: 5,
    name: "Perfume",
    slug: "perfume",
  },
  {
    id: 6,
    name: "Thermos",
    slug: "thermos",
  },
];

/*
  ساختار هر محصول:
  - description : توضیحات کامل محصول (متن چند پاراگرافی برای بخش Detail)
  - features    : لیست ویژگی‌های کلیدی محصول (آرایه رشته‌ها برای bullet points)
  - reviews     : آرایه نظرات کاربران برای بخش Reviews (مرتب‌شده بر اساس تاریخ نزولی)
                  هر نظر شامل: id, name, date (ISO string مثل 2024-06-15T10:30:00.000Z), rating (1-5), comment
                  تاریخ نظرات همیشه بعد از createdAt محصول است تا بتوان بر اساس تاریخ واقعی سورت کرد.
  - options : محورهای انتخاب (color / size) با مقادیرشان (hex برای نمایش دایره رنگ؛ آرایه چون بعضی رنگ‌ها دو رنگه‌اند)
              عطر فقط محور size (حجم) دارد.
  - variants: هر ترکیب قابل فروش یک آیتم با sku یکتا
              stock: 0  => ترکیب وجود دارد ولی تمام شده
              نبودن ترکیب در لیست => آن ترکیب اصلاً تولید نمی‌شود
  - موجودی کل، رنگ‌های موجود، فیلتر و ... را فرانت از روی variants حساب می‌کند.
  - review و rating همچنان میانگین و تعداد کل نظرات هستند.
*/
const products = [
  {
    id: 1,
    title: "Classic White T-Shirt",
    image: [
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5454.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5454.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5454.png"
    ],
    category: "tshirt",
    price: 29,
    review: 2156,
    rating: 4.7,
    createdAt: "2023-01-15T09:30:00.000Z",
    isFeatured: true,
    description: "Elevate your everyday style with our Classic White T-Shirt, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [
      "Premium Quality",
      "Versatile Wardrobe Staple",
      "Available in Various Sizes",
      "Tailored Fit"
    ],
    reviews: [
      {
        id: 1,
        name: "Lincoln Allen",
        date: "2026-04-27T05:45:32.790Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 2,
        name: "Carter Davis",
        date: "2025-05-18T22:34:39.620Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 3,
        name: "Anna Morales",
        date: "2024-11-27T16:00:21.987Z",
        rating: 4,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 4,
        name: "Olivia Johnson",
        date: "2024-06-17T04:42:13.590Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 5,
        name: "Henry Allen",
        date: "2024-04-03T18:17:40.060Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 6,
        name: "Logan Thompson",
        date: "2024-03-27T22:25:51.303Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 7,
        name: "Ava Baker",
        date: "2024-03-26T03:51:29.742Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 8,
        name: "Landon Brown",
        date: "2023-12-25T22:49:55.635Z",
        rating: 4,
        comment: "The material feels premium and durable."
      },
      {
        id: 9,
        name: "Mia Martin",
        date: "2023-06-13T11:58:39.377Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 10,
        name: "Charlotte James",
        date: "2023-03-22T23:49:09.949Z",
        rating: 3,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 11,
        name: "Michael Harris",
        date: "2023-03-14T17:25:15.131Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 12,
        name: "Owen Richardson",
        date: "2023-01-20T12:15:47.310Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Off White",
            hex: [
              "#F5F5F0"
            ]
          },
          {
            name: "Ivory",
            hex: [
              "#FFFFF0"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "S",
          "M",
          "L",
          "XL",
          "XXL"
        ]
      }
    ],
    variants: [
      {
        sku: "TSH-0001-WHI-S",
        color: "White",
        size: "S",
        stock: 8
      },
      {
        sku: "TSH-0001-WHI-M",
        color: "White",
        size: "M",
        stock: 12
      },
      {
        sku: "TSH-0001-WHI-L",
        color: "White",
        size: "L",
        stock: 10
      },
      {
        sku: "TSH-0001-WHI-XL",
        color: "White",
        size: "XL",
        stock: 9
      },
      {
        sku: "TSH-0001-WHI-XXL",
        color: "White",
        size: "XXL",
        stock: 5
      },
      {
        sku: "TSH-0001-OFFWHI-S",
        color: "Off White",
        size: "S",
        stock: 5
      },
      {
        sku: "TSH-0001-OFFWHI-M",
        color: "Off White",
        size: "M",
        stock: 7
      },
      {
        sku: "TSH-0001-OFFWHI-L",
        color: "Off White",
        size: "L",
        stock: 0
      },
      {
        sku: "TSH-0001-OFFWHI-XL",
        color: "Off White",
        size: "XL",
        stock: 4
      },
      {
        sku: "TSH-0001-IVO-L",
        color: "Ivory",
        size: "L",
        stock: 6
      },
      {
        sku: "TSH-0001-IVO-XXL",
        color: "Ivory",
        size: "XXL",
        stock: 3
      }
    ]
  },
  {
    id: 2,
    title: "Black Cotton Tee",
    image: [
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5453.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5453.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5453.png"
    ],
    category: "tshirt",
    price: 27,
    review: 1893,
    rating: 4.5,
    createdAt: "2023-02-20T11:15:00.000Z",
    isFeatured: false,
    description: "Elevate your everyday style with our Men's Black T-Shirts, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile black tees are a must-have addition to your collection.\n\nThe classic black color never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these black t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [
      "Premium Quality",
      "Versatile Wardrobe Staple",
      "Available in Various Sizes",
      "Tailored Fit"
    ],
    reviews: [
      {
        id: 1,
        name: "Zoey White",
        date: "2026-08-07T05:06:38.494Z",
        rating: 5,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 2,
        name: "Aurora Parker",
        date: "2026-08-01T01:39:03.859Z",
        rating: 4,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 3,
        name: "Bella Howard",
        date: "2026-07-12T15:03:22.060Z",
        rating: 5,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 4,
        name: "Stella Rogers",
        date: "2026-07-08T14:46:47.504Z",
        rating: 3,
        comment: "The product is fine, nothing special though."
      },
      {
        id: 5,
        name: "Scarlett Gutierrez",
        date: "2026-06-26T05:08:56.694Z",
        rating: 4,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 6,
        name: "Isaac Smith",
        date: "2026-06-12T20:38:46.626Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 7,
        name: "Emily Davis",
        date: "2026-03-23T13:33:53.351Z",
        rating: 4,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 8,
        name: "Daniel Smith",
        date: "2026-03-01T03:47:09.887Z",
        rating: 4,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 9,
        name: "Andrew Ortiz",
        date: "2026-02-26T23:24:54.766Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 10,
        name: "Nathaniel James",
        date: "2025-12-23T19:51:18.584Z",
        rating: 4,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 11,
        name: "Hunter Torres",
        date: "2025-12-14T15:05:03.815Z",
        rating: 5,
        comment: "Worth every penny. Quality is top-notch."
      },
      {
        id: 12,
        name: "Benjamin Clark",
        date: "2025-11-23T08:55:57.062Z",
        rating: 4,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 13,
        name: "Charlotte Hall",
        date: "2025-07-28T18:49:03.333Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 14,
        name: "Camila Morris",
        date: "2025-06-22T11:00:12.702Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 15,
        name: "Penelope Reed",
        date: "2025-02-19T22:21:38.325Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 16,
        name: "Victoria Cooper",
        date: "2024-11-13T02:54:26.214Z",
        rating: 5,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 17,
        name: "Audrey Reed",
        date: "2024-08-18T18:08:32.360Z",
        rating: 4,
        comment: "Fantastic product. My new favorite!"
      },
      {
        id: 18,
        name: "Aaron Rodriguez",
        date: "2024-07-05T17:27:55.307Z",
        rating: 5,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 19,
        name: "Jonathan Kim",
        date: "2024-03-09T15:11:50.414Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 20,
        name: "Andrew Roberts",
        date: "2023-11-30T15:09:17.026Z",
        rating: 4,
        comment: "The material feels premium and durable."
      },
      {
        id: 21,
        name: "Noah Wright",
        date: "2023-09-07T09:16:02.964Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 22,
        name: "Christian Martinez",
        date: "2023-09-01T23:58:02.726Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 23,
        name: "Skylar Bailey",
        date: "2023-07-07T20:33:19.208Z",
        rating: 5,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 24,
        name: "William Davis",
        date: "2023-06-19T16:01:45.321Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 25,
        name: "Wyatt Ross",
        date: "2023-06-18T09:49:52.732Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 26,
        name: "Samuel Baker",
        date: "2023-05-21T15:38:30.222Z",
        rating: 4,
        comment: "The material feels premium and durable."
      },
      {
        id: 27,
        name: "Victoria Hall",
        date: "2023-03-05T21:52:03.173Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Charcoal",
            hex: [
              "#36454F"
            ]
          },
          {
            name: "Dark Gray",
            hex: [
              "#4A4A4A"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "S",
          "M",
          "L",
          "XL",
          "XXL"
        ]
      }
    ],
    variants: [
      {
        sku: "TSH-0002-BLA-S",
        color: "Black",
        size: "S",
        stock: 9
      },
      {
        sku: "TSH-0002-BLA-M",
        color: "Black",
        size: "M",
        stock: 14
      },
      {
        sku: "TSH-0002-BLA-L",
        color: "Black",
        size: "L",
        stock: 11
      },
      {
        sku: "TSH-0002-BLA-XL",
        color: "Black",
        size: "XL",
        stock: 8
      },
      {
        sku: "TSH-0002-BLA-XXL",
        color: "Black",
        size: "XXL",
        stock: 4
      },
      {
        sku: "TSH-0002-CHA-S",
        color: "Charcoal",
        size: "S",
        stock: 6
      },
      {
        sku: "TSH-0002-CHA-M",
        color: "Charcoal",
        size: "M",
        stock: 0
      },
      {
        sku: "TSH-0002-CHA-L",
        color: "Charcoal",
        size: "L",
        stock: 7
      },
      {
        sku: "TSH-0002-CHA-XXL",
        color: "Charcoal",
        size: "XXL",
        stock: 3
      },
      {
        sku: "TSH-0002-DARGRA-M",
        color: "Dark Gray",
        size: "M",
        stock: 8
      },
      {
        sku: "TSH-0002-DARGRA-XL",
        color: "Dark Gray",
        size: "XL",
        stock: 5
      }
    ]
  },
  {
    id: 3,
    title: "Navy Blue Crew Neck",
    image: [
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5452.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5452.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5452.png"
    ],
    category: "tshirt",
    price: 32,
    review: 1247,
    rating: 4.4,
    createdAt: "2023-04-08T14:00:00.000Z",
    isFeatured: false,
    description: "Elevate your everyday style with our Navy Blue Crew Neck, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [
      "Premium Quality",
      "Versatile Wardrobe Staple",
      "Available in Various Sizes",
      "Tailored Fit"
    ],
    reviews: [
      {
        id: 1,
        name: "Henry Lewis",
        date: "2026-08-31T13:20:37.920Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 2,
        name: "Maya Reed",
        date: "2026-06-05T18:38:49.558Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 3,
        name: "Violet James",
        date: "2026-04-15T16:01:36.173Z",
        rating: 3,
        comment: "It's alright. Not the best, not the worst."
      },
      {
        id: 4,
        name: "Jeremiah Peterson",
        date: "2025-10-31T13:58:58.160Z",
        rating: 5,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 5,
        name: "Anna Alvarez",
        date: "2025-09-03T07:06:16.084Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 6,
        name: "Paisley Ramos",
        date: "2025-06-26T03:19:39.208Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 7,
        name: "Jacob King",
        date: "2025-06-05T19:18:55.257Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 8,
        name: "Liam Perez",
        date: "2024-12-07T04:59:47.647Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      },
      {
        id: 9,
        name: "Aaron Mendoza",
        date: "2024-08-04T00:31:17.269Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 10,
        name: "Violet Myers",
        date: "2024-05-30T03:35:45.820Z",
        rating: 2,
        comment: "Poor quality. Would not recommend."
      },
      {
        id: 11,
        name: "Lincoln Thomas",
        date: "2024-05-23T14:02:45.026Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 12,
        name: "James Hill",
        date: "2023-12-12T20:46:29.090Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 13,
        name: "Abigail Ward",
        date: "2023-11-24T09:12:20.251Z",
        rating: 4,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 14,
        name: "Daniel Castillo",
        date: "2023-07-28T20:09:04.472Z",
        rating: 5,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 15,
        name: "Addison Stewart",
        date: "2023-07-08T23:31:59.701Z",
        rating: 5,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 16,
        name: "Henry Brown",
        date: "2023-06-27T07:28:17.570Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 17,
        name: "Michael King",
        date: "2023-06-25T13:40:02.057Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          },
          {
            name: "Royal Blue",
            hex: [
              "#2851A3"
            ]
          },
          {
            name: "Sky Blue",
            hex: [
              "#87CEEB"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "S",
          "M",
          "L",
          "XL",
          "XXL"
        ]
      }
    ],
    variants: [
      {
        sku: "TSH-0003-NAV-S",
        color: "Navy",
        size: "S",
        stock: 6
      },
      {
        sku: "TSH-0003-NAV-M",
        color: "Navy",
        size: "M",
        stock: 9
      },
      {
        sku: "TSH-0003-NAV-L",
        color: "Navy",
        size: "L",
        stock: 8
      },
      {
        sku: "TSH-0003-NAV-XL",
        color: "Navy",
        size: "XL",
        stock: 5
      },
      {
        sku: "TSH-0003-NAV-XXL",
        color: "Navy",
        size: "XXL",
        stock: 3
      },
      {
        sku: "TSH-0003-ROYBLU-S",
        color: "Royal Blue",
        size: "S",
        stock: 4
      },
      {
        sku: "TSH-0003-ROYBLU-M",
        color: "Royal Blue",
        size: "M",
        stock: 0
      },
      {
        sku: "TSH-0003-ROYBLU-L",
        color: "Royal Blue",
        size: "L",
        stock: 4
      },
      {
        sku: "TSH-0003-ROYBLU-XXL",
        color: "Royal Blue",
        size: "XXL",
        stock: 2
      },
      {
        sku: "TSH-0003-SKYBLU-M",
        color: "Sky Blue",
        size: "M",
        stock: 5
      },
      {
        sku: "TSH-0003-SKYBLU-XL",
        color: "Sky Blue",
        size: "XL",
        stock: 3
      }
    ]
  },
  {
    id: 4,
    title: "Graphic Print T-Shirt",
    image: [
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png"
    ],
    category: "tshirt",
    price: 39,
    review: 1678,
    rating: 4.6,
    createdAt: "2023-06-12T10:45:00.000Z",
    isFeatured: true,
    description: "Elevate your everyday style with our Graphic Print T-Shirt, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [
      "Premium Quality",
      "Versatile Wardrobe Staple",
      "Available in Various Sizes",
      "Tailored Fit"
    ],
    reviews: [
      {
        id: 1,
        name: "Colton Lee",
        date: "2026-03-25T13:04:57.326Z",
        rating: 4,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 2,
        name: "Jack Ruiz",
        date: "2025-12-24T04:50:24.493Z",
        rating: 3,
        comment: "It's alright. Not the best, not the worst."
      },
      {
        id: 3,
        name: "Lincoln Alvarez",
        date: "2025-11-18T10:29:25.416Z",
        rating: 4,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 4,
        name: "Mateo Williams",
        date: "2025-11-12T00:18:22.626Z",
        rating: 5,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 5,
        name: "Michael Jones",
        date: "2025-10-31T10:04:55.852Z",
        rating: 4,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 6,
        name: "Harper Perez",
        date: "2025-10-06T03:41:26.647Z",
        rating: 5,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 7,
        name: "Isabella Flores",
        date: "2025-06-16T09:55:02.883Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 8,
        name: "Victoria Moore",
        date: "2025-05-25T21:21:45.565Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 9,
        name: "Kennedy Harris",
        date: "2025-04-02T09:42:12.784Z",
        rating: 4,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 10,
        name: "Michael Walker",
        date: "2025-02-27T18:13:01.869Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 11,
        name: "Landon Ward",
        date: "2025-02-25T10:38:32.157Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 12,
        name: "Lucy Martinez",
        date: "2025-02-25T03:34:25.186Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 13,
        name: "William Ramirez",
        date: "2025-02-10T07:44:12.974Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 14,
        name: "Emily Wilson",
        date: "2025-01-25T07:16:25.854Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 15,
        name: "Joseph Adams",
        date: "2024-12-23T06:28:11.622Z",
        rating: 5,
        comment: "Solid quality and good value for money."
      },
      {
        id: 16,
        name: "Evelyn Jimenez",
        date: "2024-12-19T15:42:25.036Z",
        rating: 5,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 17,
        name: "Wyatt Thomas",
        date: "2024-11-28T19:41:19.874Z",
        rating: 4,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 18,
        name: "Wyatt Miller",
        date: "2024-10-11T08:00:12.530Z",
        rating: 4,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 19,
        name: "Thomas Evans",
        date: "2024-10-07T03:12:19.067Z",
        rating: 5,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 20,
        name: "Abigail Clark",
        date: "2024-09-06T14:03:09.539Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 21,
        name: "Owen Hall",
        date: "2024-07-09T00:53:08.789Z",
        rating: 4,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 22,
        name: "Olivia Flores",
        date: "2024-06-19T01:08:32.614Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 23,
        name: "Nora Thomas",
        date: "2024-05-26T01:13:26.706Z",
        rating: 5,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 24,
        name: "Abigail Jones",
        date: "2024-04-09T18:36:10.139Z",
        rating: 5,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 25,
        name: "Everly Ross",
        date: "2024-02-15T05:03:01.772Z",
        rating: 4,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 26,
        name: "Aurora Richardson",
        date: "2024-01-06T15:23:02.336Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 27,
        name: "Benjamin Harris",
        date: "2024-01-02T22:14:13.116Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 28,
        name: "Daniel Martinez",
        date: "2023-07-22T06:18:02.564Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 29,
        name: "Ava Miller",
        date: "2023-07-05T11:41:18.931Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Red",
            hex: [
              "#D32F2F"
            ]
          },
          {
            name: "Gray",
            hex: [
              "#9E9E9E"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "S",
          "M",
          "L",
          "XL",
          "XXL"
        ]
      }
    ],
    variants: [
      {
        sku: "TSH-0004-WHI-S",
        color: "White",
        size: "S",
        stock: 5
      },
      {
        sku: "TSH-0004-WHI-M",
        color: "White",
        size: "M",
        stock: 7
      },
      {
        sku: "TSH-0004-WHI-L",
        color: "White",
        size: "L",
        stock: 5
      },
      {
        sku: "TSH-0004-WHI-XL",
        color: "White",
        size: "XL",
        stock: 0
      },
      {
        sku: "TSH-0004-WHI-XXL",
        color: "White",
        size: "XXL",
        stock: 2
      },
      {
        sku: "TSH-0004-BLA-S",
        color: "Black",
        size: "S",
        stock: 4
      },
      {
        sku: "TSH-0004-BLA-M",
        color: "Black",
        size: "M",
        stock: 6
      },
      {
        sku: "TSH-0004-BLA-L",
        color: "Black",
        size: "L",
        stock: 4
      },
      {
        sku: "TSH-0004-BLA-XL",
        color: "Black",
        size: "XL",
        stock: 3
      },
      {
        sku: "TSH-0004-RED-M",
        color: "Red",
        size: "M",
        stock: 3
      },
      {
        sku: "TSH-0004-RED-XL",
        color: "Red",
        size: "XL",
        stock: 2
      },
      {
        sku: "TSH-0004-GRA-L",
        color: "Gray",
        size: "L",
        stock: 3
      },
      {
        sku: "TSH-0004-GRA-XXL",
        color: "Gray",
        size: "XXL",
        stock: 1
      }
    ]
  },
  {
    id: 5,
    title: "Oversized Streetwear Tee",
    image: [
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png"
    ],
    category: "tshirt",
    price: 45,
    review: 982,
    rating: 4.3,
    createdAt: "2023-09-05T16:20:00.000Z",
    isFeatured: false,
    description: "Elevate your everyday style with our Oversized Streetwear Tee, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [
      "Premium Quality",
      "Versatile Wardrobe Staple",
      "Available in Various Sizes",
      "Tailored Fit"
    ],
    reviews: [
      {
        id: 1,
        name: "Audrey Howard",
        date: "2026-10-08T18:37:38.048Z",
        rating: 3,
        comment: "It's okay. Does the job but not amazing."
      },
      {
        id: 2,
        name: "Nova Hernandez",
        date: "2026-08-03T06:33:44.959Z",
        rating: 4,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 3,
        name: "Chloe Howard",
        date: "2026-07-24T05:54:15.661Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 4,
        name: "Liam Anderson",
        date: "2026-07-19T20:04:01.315Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 5,
        name: "Avery Chavez",
        date: "2026-05-17T16:47:59.924Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 6,
        name: "Violet Taylor",
        date: "2026-04-21T15:08:52.320Z",
        rating: 4,
        comment: "Will be ordering more in different colors."
      },
      {
        id: 7,
        name: "Samuel Stewart",
        date: "2026-03-30T22:16:47.858Z",
        rating: 5,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 8,
        name: "Luke Lopez",
        date: "2026-01-25T07:07:31.488Z",
        rating: 3,
        comment: "It's alright. Not the best, not the worst."
      },
      {
        id: 9,
        name: "Camila Gutierrez",
        date: "2026-01-21T02:53:22.546Z",
        rating: 4,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 10,
        name: "Everly White",
        date: "2026-01-06T03:42:47.899Z",
        rating: 4,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 11,
        name: "Amelia Wright",
        date: "2025-09-21T10:00:41.777Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 12,
        name: "Emma Nguyen",
        date: "2025-06-05T19:48:50.268Z",
        rating: 3,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 13,
        name: "Chloe Peterson",
        date: "2025-05-19T12:22:28.815Z",
        rating: 4,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 14,
        name: "Savannah Smith",
        date: "2025-04-21T00:53:29.913Z",
        rating: 4,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 15,
        name: "Sophia Wood",
        date: "2025-04-19T02:31:44.874Z",
        rating: 5,
        comment: "Matches the description perfectly."
      },
      {
        id: 16,
        name: "Noah Anderson",
        date: "2025-04-02T02:34:06.737Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 17,
        name: "Victoria Taylor",
        date: "2024-08-08T09:18:00.202Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 18,
        name: "Jackson Johnson",
        date: "2024-04-24T21:30:05.405Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 19,
        name: "Jonathan Cooper",
        date: "2024-04-10T05:24:47.720Z",
        rating: 5,
        comment: "Matches the description perfectly."
      },
      {
        id: 20,
        name: "Sofia Edwards",
        date: "2024-03-16T17:06:52.909Z",
        rating: 5,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 21,
        name: "David White",
        date: "2023-12-26T00:04:25.573Z",
        rating: 5,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 22,
        name: "Julian Ross",
        date: "2023-11-28T15:15:14.774Z",
        rating: 4,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Olive",
            hex: [
              "#6B7B3A"
            ]
          },
          {
            name: "Beige",
            hex: [
              "#E1D5BC"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "S",
          "M",
          "L",
          "XL",
          "XXL"
        ]
      }
    ],
    variants: [
      {
        sku: "TSH-0005-BLA-S",
        color: "Black",
        size: "S",
        stock: 6
      },
      {
        sku: "TSH-0005-BLA-M",
        color: "Black",
        size: "M",
        stock: 9
      },
      {
        sku: "TSH-0005-BLA-L",
        color: "Black",
        size: "L",
        stock: 7
      },
      {
        sku: "TSH-0005-BLA-XL",
        color: "Black",
        size: "XL",
        stock: 5
      },
      {
        sku: "TSH-0005-BLA-XXL",
        color: "Black",
        size: "XXL",
        stock: 0
      },
      {
        sku: "TSH-0005-OLI-S",
        color: "Olive",
        size: "S",
        stock: 4
      },
      {
        sku: "TSH-0005-OLI-L",
        color: "Olive",
        size: "L",
        stock: 4
      },
      {
        sku: "TSH-0005-OLI-XXL",
        color: "Olive",
        size: "XXL",
        stock: 2
      },
      {
        sku: "TSH-0005-BEI-M",
        color: "Beige",
        size: "M",
        stock: 5
      },
      {
        sku: "TSH-0005-BEI-XL",
        color: "Beige",
        size: "XL",
        stock: 3
      },
      {
        sku: "TSH-0005-WHI-L",
        color: "White",
        size: "L",
        stock: 3
      },
      {
        sku: "TSH-0005-WHI-XXL",
        color: "White",
        size: "XXL",
        stock: 2
      }
    ]
  },
  {
    id: 6,
    title: "Striped Casual T-Shirt",
    image: [
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5449.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5449.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5449.png"
    ],
    category: "tshirt",
    price: 34,
    review: 1456,
    rating: 4.2,
    createdAt: "2024-01-18T08:50:00.000Z",
    isFeatured: false,
    description: "Elevate your everyday style with our Striped Casual T-Shirt, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [
      "Premium Quality",
      "Versatile Wardrobe Staple",
      "Available in Various Sizes",
      "Tailored Fit"
    ],
    reviews: [
      {
        id: 1,
        name: "Victoria Phillips",
        date: "2026-08-23T02:40:17.863Z",
        rating: 5,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 2,
        name: "Jeremiah Garcia",
        date: "2026-04-02T18:21:59.544Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 3,
        name: "Grace Jimenez",
        date: "2026-03-25T11:23:50.528Z",
        rating: 4,
        comment: "Fantastic product. My new favorite!"
      },
      {
        id: 4,
        name: "Lucy Parker",
        date: "2025-12-15T14:56:30.785Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 5,
        name: "Noah Smith",
        date: "2025-11-17T03:20:56.583Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 6,
        name: "Michael Scott",
        date: "2025-10-04T17:37:06.215Z",
        rating: 3,
        comment: "It's alright. Not the best, not the worst."
      },
      {
        id: 7,
        name: "Noah Garcia",
        date: "2025-09-09T22:22:14.173Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 8,
        name: "Hannah Reed",
        date: "2025-06-16T11:45:30.911Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 9,
        name: "Emma Ruiz",
        date: "2025-06-06T11:57:54.379Z",
        rating: 4,
        comment: "The material feels premium and durable."
      },
      {
        id: 10,
        name: "Alexander Scott",
        date: "2025-06-04T09:11:56.648Z",
        rating: 4,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 11,
        name: "Mia Scott",
        date: "2025-05-18T04:07:07.043Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 12,
        name: "Lily Cook",
        date: "2025-05-14T20:28:22.320Z",
        rating: 5,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 13,
        name: "Nolan Wood",
        date: "2025-04-05T18:46:32.207Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 14,
        name: "Daniel Davis",
        date: "2025-03-09T02:50:05.037Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 15,
        name: "William Robinson",
        date: "2025-03-07T00:47:18.956Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 16,
        name: "Penelope Chavez",
        date: "2025-02-21T00:43:24.525Z",
        rating: 4,
        comment: "Worth every penny. Quality is top-notch."
      },
      {
        id: 17,
        name: "Addison Torres",
        date: "2025-02-10T13:44:04.419Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 18,
        name: "Amelia Morris",
        date: "2025-02-04T01:44:59.432Z",
        rating: 3,
        comment: "Acceptable quality. Would consider other options next time."
      },
      {
        id: 19,
        name: "Addison Hernandez",
        date: "2025-02-01T15:15:17.825Z",
        rating: 2,
        comment: "Sizing is off and the material is thinner than expected."
      },
      {
        id: 20,
        name: "Lucy Morales",
        date: "2024-12-11T07:51:38.591Z",
        rating: 4,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 21,
        name: "Eleanor Sanchez",
        date: "2024-11-18T16:24:07.217Z",
        rating: 5,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 22,
        name: "John Young",
        date: "2024-10-24T06:53:03.277Z",
        rating: 2,
        comment: "Took too long to arrive and packaging was damaged."
      },
      {
        id: 23,
        name: "William Jimenez",
        date: "2024-10-09T08:26:34.765Z",
        rating: 5,
        comment: "Love the color options available."
      },
      {
        id: 24,
        name: "Gabriel Bennett",
        date: "2024-08-08T08:20:09.187Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 25,
        name: "Stella Hall",
        date: "2024-08-07T04:22:17.007Z",
        rating: 5,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 26,
        name: "Zoey Hill",
        date: "2024-06-02T14:22:30.068Z",
        rating: 4,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 27,
        name: "Henry Martinez",
        date: "2024-05-22T17:03:00.859Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 28,
        name: "Aaron Castillo",
        date: "2024-05-18T14:50:24.967Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Navy/White",
            hex: [
              "#1F2A44",
              "#FFFFFF"
            ]
          },
          {
            name: "Black/White",
            hex: [
              "#111111",
              "#FFFFFF"
            ]
          },
          {
            name: "Red/White",
            hex: [
              "#D32F2F",
              "#FFFFFF"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "S",
          "M",
          "L",
          "XL",
          "XXL"
        ]
      }
    ],
    variants: [
      {
        sku: "TSH-0006-NAVWHI-S",
        color: "Navy/White",
        size: "S",
        stock: 5
      },
      {
        sku: "TSH-0006-NAVWHI-M",
        color: "Navy/White",
        size: "M",
        stock: 8
      },
      {
        sku: "TSH-0006-NAVWHI-L",
        color: "Navy/White",
        size: "L",
        stock: 4
      },
      {
        sku: "TSH-0006-NAVWHI-XL",
        color: "Navy/White",
        size: "XL",
        stock: 0
      },
      {
        sku: "TSH-0006-NAVWHI-XXL",
        color: "Navy/White",
        size: "XXL",
        stock: 2
      },
      {
        sku: "TSH-0006-BLAWHI-S",
        color: "Black/White",
        size: "S",
        stock: 4
      },
      {
        sku: "TSH-0006-BLAWHI-L",
        color: "Black/White",
        size: "L",
        stock: 7
      },
      {
        sku: "TSH-0006-BLAWHI-XL",
        color: "Black/White",
        size: "XL",
        stock: 3
      },
      {
        sku: "TSH-0006-BLAWHI-XXL",
        color: "Black/White",
        size: "XXL",
        stock: 2
      },
      {
        sku: "TSH-0006-REDWHI-M",
        color: "Red/White",
        size: "M",
        stock: 5
      },
      {
        sku: "TSH-0006-REDWHI-XL",
        color: "Red/White",
        size: "XL",
        stock: 3
      }
    ]
  },
  {
    id: 7,
    title: "Premium Soft Touch Tee",
    image: [
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png"
    ],
    category: "tshirt",
    price: 49,
    review: 876,
    rating: 4.8,
    createdAt: "2024-05-22T13:10:00.000Z",
    isFeatured: true,
    description: "Elevate your everyday style with our Premium Soft Touch Tee, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [
      "Premium Quality",
      "Versatile Wardrobe Staple",
      "Available in Various Sizes",
      "Tailored Fit"
    ],
    reviews: [
      {
        id: 1,
        name: "Ellie Martinez",
        date: "2026-10-23T03:40:42.927Z",
        rating: 4,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 2,
        name: "Ellie Nguyen",
        date: "2026-09-28T03:51:08.353Z",
        rating: 5,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 3,
        name: "Jayden Phillips",
        date: "2026-08-16T10:16:51.564Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 4,
        name: "Joseph Martin",
        date: "2026-05-31T10:55:12.195Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 5,
        name: "Emily Nelson",
        date: "2026-02-18T18:14:09.646Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 6,
        name: "Mason Scott",
        date: "2026-01-22T01:14:22.601Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 7,
        name: "Olivia Garcia",
        date: "2025-09-21T23:31:40.283Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 8,
        name: "Isabella Johnson",
        date: "2025-06-22T00:24:13.271Z",
        rating: 5,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 9,
        name: "John Murphy",
        date: "2025-06-02T21:07:20.318Z",
        rating: 5,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 10,
        name: "Noah Wilson",
        date: "2025-03-27T20:21:08.075Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 11,
        name: "Nolan Patel",
        date: "2025-03-05T03:42:17.174Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 12,
        name: "Julian Long",
        date: "2024-08-22T04:24:24.918Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 13,
        name: "Dylan Williams",
        date: "2024-07-22T10:44:11.346Z",
        rating: 5,
        comment: "Will be ordering more in different colors."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Gray",
            hex: [
              "#9E9E9E"
            ]
          },
          {
            name: "Beige",
            hex: [
              "#E1D5BC"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "S",
          "M",
          "L",
          "XL",
          "XXL"
        ]
      }
    ],
    variants: [
      {
        sku: "TSH-0007-WHI-S",
        color: "White",
        size: "S",
        stock: 3
      },
      {
        sku: "TSH-0007-WHI-M",
        color: "White",
        size: "M",
        stock: 5
      },
      {
        sku: "TSH-0007-WHI-L",
        color: "White",
        size: "L",
        stock: 0
      },
      {
        sku: "TSH-0007-WHI-XL",
        color: "White",
        size: "XL",
        stock: 2
      },
      {
        sku: "TSH-0007-BLA-S",
        color: "Black",
        size: "S",
        stock: 3
      },
      {
        sku: "TSH-0007-BLA-L",
        color: "Black",
        size: "L",
        stock: 4
      },
      {
        sku: "TSH-0007-BLA-XL",
        color: "Black",
        size: "XL",
        stock: 2
      },
      {
        sku: "TSH-0007-GRA-M",
        color: "Gray",
        size: "M",
        stock: 4
      },
      {
        sku: "TSH-0007-GRA-XXL",
        color: "Gray",
        size: "XXL",
        stock: 1
      },
      {
        sku: "TSH-0007-BEI-L",
        color: "Beige",
        size: "L",
        stock: 3
      },
      {
        sku: "TSH-0007-BEI-XXL",
        color: "Beige",
        size: "XXL",
        stock: 1
      }
    ]
  },
  {
    id: 8,
    title: "V-Neck Basic T-Shirt",
    image: [
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5447.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5447.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5447.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5447.png",
      "https://pngimg.com/uploads/tshirt/tshirt_PNG5447.png"
    ],
    category: "tshirt",
    price: 25,
    review: 2034,
    rating: 4.5,
    createdAt: "2024-08-03T17:40:00.000Z",
    isFeatured: false,
    description: "Elevate your everyday style with our V-Neck Basic T-Shirt, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [
      "Premium Quality",
      "Versatile Wardrobe Staple",
      "Available in Various Sizes",
      "Tailored Fit"
    ],
    reviews: [
      {
        id: 1,
        name: "Penelope Davis",
        date: "2026-08-10T15:12:12.088Z",
        rating: 4,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 2,
        name: "Gabriel Edwards",
        date: "2026-07-31T04:08:36.816Z",
        rating: 5,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 3,
        name: "Hazel Gutierrez",
        date: "2026-07-13T13:08:44.004Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 4,
        name: "Julian Alvarez",
        date: "2026-07-09T17:43:28.347Z",
        rating: 5,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 5,
        name: "Aria Martin",
        date: "2026-06-29T06:54:50.194Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 6,
        name: "Levi Sanchez",
        date: "2026-06-22T05:45:45.069Z",
        rating: 5,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 7,
        name: "Mason Adams",
        date: "2026-03-16T21:59:25.100Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 8,
        name: "Ava Hill",
        date: "2026-02-14T11:13:35.877Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 9,
        name: "Dylan Ross",
        date: "2026-01-15T23:59:13.010Z",
        rating: 5,
        comment: "Will be ordering more in different colors."
      },
      {
        id: 10,
        name: "Lincoln Cox",
        date: "2025-12-14T20:33:20.022Z",
        rating: 3,
        comment: "It's okay. Does the job but not amazing."
      },
      {
        id: 11,
        name: "Lucas Phillips",
        date: "2025-11-19T08:36:07.667Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 12,
        name: "Ethan Robinson",
        date: "2025-09-02T09:47:55.085Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 13,
        name: "Mason Jackson",
        date: "2025-06-25T01:15:28.295Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 14,
        name: "Evelyn Young",
        date: "2025-05-26T02:29:15.649Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 15,
        name: "Matthew Miller",
        date: "2025-05-23T20:10:31.955Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 16,
        name: "Levi Campbell",
        date: "2025-04-04T00:39:25.419Z",
        rating: 4,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 17,
        name: "Noah Thomas",
        date: "2025-01-19T15:46:00.390Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 18,
        name: "Mia Mendoza",
        date: "2025-01-06T21:02:18.594Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 19,
        name: "Isaiah Johnson",
        date: "2024-10-25T12:43:42.811Z",
        rating: 5,
        comment: "Stylish and practical at the same time."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          },
          {
            name: "Gray",
            hex: [
              "#9E9E9E"
            ]
          },
          {
            name: "Red",
            hex: [
              "#D32F2F"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "S",
          "M",
          "L",
          "XL",
          "XXL"
        ]
      }
    ],
    variants: [
      {
        sku: "TSH-0008-WHI-S",
        color: "White",
        size: "S",
        stock: 8
      },
      {
        sku: "TSH-0008-WHI-M",
        color: "White",
        size: "M",
        stock: 10
      },
      {
        sku: "TSH-0008-WHI-L",
        color: "White",
        size: "L",
        stock: 0
      },
      {
        sku: "TSH-0008-WHI-XL",
        color: "White",
        size: "XL",
        stock: 6
      },
      {
        sku: "TSH-0008-BLA-S",
        color: "Black",
        size: "S",
        stock: 7
      },
      {
        sku: "TSH-0008-BLA-L",
        color: "Black",
        size: "L",
        stock: 9
      },
      {
        sku: "TSH-0008-BLA-XXL",
        color: "Black",
        size: "XXL",
        stock: 3
      },
      {
        sku: "TSH-0008-NAV-M",
        color: "Navy",
        size: "M",
        stock: 8
      },
      {
        sku: "TSH-0008-NAV-XL",
        color: "Navy",
        size: "XL",
        stock: 4
      },
      {
        sku: "TSH-0008-GRA-M",
        color: "Gray",
        size: "M",
        stock: 6
      },
      {
        sku: "TSH-0008-GRA-XXL",
        color: "Gray",
        size: "XXL",
        stock: 2
      },
      {
        sku: "TSH-0008-RED-L",
        color: "Red",
        size: "L",
        stock: 5
      }
    ]
  },
  {
    id: 9,
    title: "White Sneakers",
    image: [
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5827.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5827.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5827.png"
    ],
    category: "shoe",
    price: 89,
    review: 3421,
    rating: 4.8,
    createdAt: "2022-11-10T12:00:00.000Z",
    isFeatured: true,
    description: "Step up your footwear game with our White Sneakers. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [
      "Premium Materials",
      "Comfortable Fit",
      "Durable Construction",
      "Stylish Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Colton Parker",
        date: "2026-03-01T11:58:39.502Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 2,
        name: "Matthew Peterson",
        date: "2026-01-10T16:52:13.585Z",
        rating: 4,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 3,
        name: "Henry Martin",
        date: "2025-12-02T12:22:36.571Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 4,
        name: "Elizabeth Reyes",
        date: "2025-07-22T07:07:24.092Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 5,
        name: "Harper Wright",
        date: "2025-02-28T01:34:00.879Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 6,
        name: "Abigail Green",
        date: "2025-02-14T02:10:07.900Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 7,
        name: "Sophia Anderson",
        date: "2025-02-06T23:07:33.440Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 8,
        name: "Grayson Price",
        date: "2024-09-14T07:17:13.753Z",
        rating: 4,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 9,
        name: "Grace Edwards",
        date: "2024-07-21T05:43:24.374Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 10,
        name: "Dylan Chavez",
        date: "2024-06-03T19:56:03.817Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 11,
        name: "Jackson Thompson",
        date: "2023-11-01T03:30:38.263Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 12,
        name: "Ethan Lewis",
        date: "2023-10-12T10:13:59.437Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 13,
        name: "Sofia Cruz",
        date: "2023-09-07T05:36:43.296Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 14,
        name: "Colton Anderson",
        date: "2023-06-29T18:46:06.319Z",
        rating: 4,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 15,
        name: "Grayson Campbell",
        date: "2023-01-20T21:05:26.078Z",
        rating: 5,
        comment: "Will be ordering more in different colors."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "White/Black",
            hex: [
              "#FFFFFF",
              "#111111"
            ]
          },
          {
            name: "White/Blue",
            hex: [
              "#FFFFFF",
              "#1E6FD9"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "40",
          "41",
          "42",
          "43",
          "44"
        ]
      }
    ],
    variants: [
      {
        sku: "SHO-0009-WHI-40",
        color: "White",
        size: "40",
        stock: 8
      },
      {
        sku: "SHO-0009-WHI-41",
        color: "White",
        size: "41",
        stock: 12
      },
      {
        sku: "SHO-0009-WHI-42",
        color: "White",
        size: "42",
        stock: 10
      },
      {
        sku: "SHO-0009-WHI-43",
        color: "White",
        size: "43",
        stock: 8
      },
      {
        sku: "SHO-0009-WHI-44",
        color: "White",
        size: "44",
        stock: 4
      },
      {
        sku: "SHO-0009-WHIBLA-40",
        color: "White/Black",
        size: "40",
        stock: 5
      },
      {
        sku: "SHO-0009-WHIBLA-41",
        color: "White/Black",
        size: "41",
        stock: 0
      },
      {
        sku: "SHO-0009-WHIBLA-42",
        color: "White/Black",
        size: "42",
        stock: 6
      },
      {
        sku: "SHO-0009-WHIBLA-44",
        color: "White/Black",
        size: "44",
        stock: 2
      },
      {
        sku: "SHO-0009-WHIBLU-41",
        color: "White/Blue",
        size: "41",
        stock: 7
      },
      {
        sku: "SHO-0009-WHIBLU-43",
        color: "White/Blue",
        size: "43",
        stock: 4
      }
    ]
  },
  {
    id: 10,
    title: "Brown Leather Boots",
    image: [
      "https://pngimg.com/uploads/boots/boots_PNG7815.png",
      "https://pngimg.com/uploads/boots/boots_PNG7815.png",
      "https://pngimg.com/uploads/boots/boots_PNG7815.png"
    ],
    category: "shoe",
    price: 129,
    review: 978,
    rating: 3.7,
    createdAt: "2023-03-25T09:25:00.000Z",
    isFeatured: false,
    description: "Step up your footwear game with our Brown Leather Boots. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [
      "Premium Materials",
      "Comfortable Fit",
      "Durable Construction",
      "Stylish Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Isabella Davis",
        date: "2026-07-24T01:46:28.879Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      },
      {
        id: 2,
        name: "Abigail Davis",
        date: "2025-11-23T21:15:13.141Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 3,
        name: "Evelyn Martinez",
        date: "2025-03-29T07:59:30.264Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 4,
        name: "Ellie White",
        date: "2025-03-13T19:10:47.062Z",
        rating: 2,
        comment: "Fell apart after a few uses. Avoid."
      },
      {
        id: 5,
        name: "Lily Kelly",
        date: "2024-10-09T22:38:07.220Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Brown",
            hex: [
              "#6D4C41"
            ]
          },
          {
            name: "Dark Brown",
            hex: [
              "#3E2723"
            ]
          },
          {
            name: "Tan",
            hex: [
              "#D2B48C"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "40",
          "41",
          "42",
          "43",
          "44"
        ]
      }
    ],
    variants: [
      {
        sku: "SHO-0010-BRO-40",
        color: "Brown",
        size: "40",
        stock: 3
      },
      {
        sku: "SHO-0010-BRO-41",
        color: "Brown",
        size: "41",
        stock: 4
      },
      {
        sku: "SHO-0010-BRO-42",
        color: "Brown",
        size: "42",
        stock: 2
      },
      {
        sku: "SHO-0010-BRO-43",
        color: "Brown",
        size: "43",
        stock: 0
      },
      {
        sku: "SHO-0010-BRO-44",
        color: "Brown",
        size: "44",
        stock: 1
      },
      {
        sku: "SHO-0010-DARBRO-40",
        color: "Dark Brown",
        size: "40",
        stock: 2
      },
      {
        sku: "SHO-0010-DARBRO-42",
        color: "Dark Brown",
        size: "42",
        stock: 3
      },
      {
        sku: "SHO-0010-DARBRO-44",
        color: "Dark Brown",
        size: "44",
        stock: 1
      },
      {
        sku: "SHO-0010-TAN-41",
        color: "Tan",
        size: "41",
        stock: 3
      },
      {
        sku: "SHO-0010-TAN-43",
        color: "Tan",
        size: "43",
        stock: 2
      }
    ]
  },
  {
    id: 11,
    title: "Black Formal Shoes",
    image: [
      "https://pngimg.com/uploads/boots/boots_PNG7813.png",
      "https://pngimg.com/uploads/boots/boots_PNG7813.png",
      "https://pngimg.com/uploads/boots/boots_PNG7813.png",
      "https://pngimg.com/uploads/boots/boots_PNG7813.png",
      "https://pngimg.com/uploads/boots/boots_PNG7813.png",
      "https://pngimg.com/uploads/boots/boots_PNG7813.png"
    ],
    category: "shoe",
    price: 115,
    review: 1123,
    rating: 4.5,
    createdAt: "2023-05-14T15:35:00.000Z",
    isFeatured: false,
    description: "Step up your footwear game with our Black Formal Shoes. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [
      "Premium Materials",
      "Comfortable Fit",
      "Durable Construction",
      "Stylish Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Emilia Cook",
        date: "2026-09-24T07:58:09.093Z",
        rating: 4,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 2,
        name: "Noah Allen",
        date: "2026-05-23T04:29:48.623Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 3,
        name: "Lillian Clark",
        date: "2026-05-08T18:29:24.953Z",
        rating: 4,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 4,
        name: "Hazel Brooks",
        date: "2026-01-01T11:55:34.499Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 5,
        name: "Hannah Nguyen",
        date: "2025-12-23T14:41:34.788Z",
        rating: 5,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 6,
        name: "Audrey Thompson",
        date: "2025-12-19T02:14:40.134Z",
        rating: 5,
        comment: "Will be ordering more in different colors."
      },
      {
        id: 7,
        name: "Aaron Parker",
        date: "2025-12-10T10:20:54.734Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 8,
        name: "Jackson Evans",
        date: "2025-12-08T10:17:35.487Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 9,
        name: "Aaron Richardson",
        date: "2025-11-30T17:22:43.022Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 10,
        name: "Isaac Williams",
        date: "2025-07-30T07:53:08.839Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 11,
        name: "Samuel Allen",
        date: "2025-05-23T20:17:30.859Z",
        rating: 4,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 12,
        name: "Ella Cooper",
        date: "2025-03-24T00:58:02.735Z",
        rating: 5,
        comment: "The stitching and finish are excellent."
      },
      {
        id: 13,
        name: "Joseph Rivera",
        date: "2025-02-23T18:42:24.046Z",
        rating: 4,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 14,
        name: "Aaron Bailey",
        date: "2025-02-16T08:12:33.537Z",
        rating: 4,
        comment: "The material feels premium and durable."
      },
      {
        id: 15,
        name: "Amelia Myers",
        date: "2024-12-01T13:06:03.918Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 16,
        name: "Brooklyn Brooks",
        date: "2024-10-24T02:00:32.828Z",
        rating: 4,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 17,
        name: "Grayson Miller",
        date: "2024-09-22T17:24:07.281Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 18,
        name: "Aria Cox",
        date: "2024-09-14T03:36:26.966Z",
        rating: 5,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 19,
        name: "Sophia Adams",
        date: "2024-05-30T19:06:50.557Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 20,
        name: "Grayson Walker",
        date: "2024-03-23T13:19:27.552Z",
        rating: 4,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 21,
        name: "Robert Miller",
        date: "2024-02-02T19:03:15.843Z",
        rating: 5,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 22,
        name: "Logan Scott",
        date: "2024-01-09T23:47:13.130Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 23,
        name: "Mia White",
        date: "2023-06-17T06:17:57.701Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Dark Brown",
            hex: [
              "#3E2723"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "40",
          "41",
          "42",
          "43",
          "44"
        ]
      }
    ],
    variants: [
      {
        sku: "SHO-0011-BLA-40",
        color: "Black",
        size: "40",
        stock: 4
      },
      {
        sku: "SHO-0011-BLA-41",
        color: "Black",
        size: "41",
        stock: 7
      },
      {
        sku: "SHO-0011-BLA-42",
        color: "Black",
        size: "42",
        stock: 6
      },
      {
        sku: "SHO-0011-BLA-43",
        color: "Black",
        size: "43",
        stock: 3
      },
      {
        sku: "SHO-0011-BLA-44",
        color: "Black",
        size: "44",
        stock: 2
      },
      {
        sku: "SHO-0011-DARBRO-41",
        color: "Dark Brown",
        size: "41",
        stock: 3
      },
      {
        sku: "SHO-0011-DARBRO-42",
        color: "Dark Brown",
        size: "42",
        stock: 2
      }
    ]
  },
  {
    id: 12,
    title: "Running Shoes",
    image: [
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png"
    ],
    category: "shoe",
    price: 99,
    review: 2756,
    rating: 4.6,
    createdAt: "2023-07-30T11:05:00.000Z",
    isFeatured: true,
    description: "Step up your footwear game with our Running Shoes. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [
      "Premium Materials",
      "Comfortable Fit",
      "Durable Construction",
      "Stylish Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Christian Richardson",
        date: "2026-09-18T14:51:07.411Z",
        rating: 5,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 2,
        name: "Emily Sanchez",
        date: "2026-09-15T11:05:15.499Z",
        rating: 4,
        comment: "Will be ordering more in different colors."
      },
      {
        id: 3,
        name: "David Robinson",
        date: "2026-09-07T03:28:14.609Z",
        rating: 4,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 4,
        name: "Sophia Taylor",
        date: "2026-05-05T21:53:41.973Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 5,
        name: "Gabriel Morris",
        date: "2025-12-03T09:11:45.480Z",
        rating: 5,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 6,
        name: "Jackson White",
        date: "2025-09-03T03:29:04.517Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 7,
        name: "John Jimenez",
        date: "2025-07-17T21:40:08.706Z",
        rating: 4,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 8,
        name: "Amelia Hall",
        date: "2025-03-06T04:17:58.681Z",
        rating: 4,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 9,
        name: "Evelyn Hill",
        date: "2024-12-27T18:21:19.776Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 10,
        name: "Camila Gray",
        date: "2024-12-23T12:19:42.158Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 11,
        name: "Everly Morales",
        date: "2024-11-30T07:40:52.366Z",
        rating: 5,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 12,
        name: "Henry King",
        date: "2024-11-16T18:22:58.598Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 13,
        name: "Elizabeth Adams",
        date: "2024-08-23T12:38:09.901Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 14,
        name: "Mateo Johnson",
        date: "2024-08-04T08:18:54.250Z",
        rating: 5,
        comment: "Love the color options available."
      },
      {
        id: 15,
        name: "Grace Castillo",
        date: "2024-04-21T19:14:52.650Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 16,
        name: "Ava Nelson",
        date: "2024-02-13T11:02:59.413Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 17,
        name: "Dylan Young",
        date: "2024-01-29T04:20:22.613Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 18,
        name: "Paisley Stewart",
        date: "2023-12-23T20:15:32.622Z",
        rating: 5,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 19,
        name: "Nathaniel Cox",
        date: "2023-08-11T13:45:09.720Z",
        rating: 5,
        comment: "Worth every penny. Quality is top-notch."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Blue",
            hex: [
              "#1E6FD9"
            ]
          },
          {
            name: "Red",
            hex: [
              "#D32F2F"
            ]
          },
          {
            name: "Gray",
            hex: [
              "#9E9E9E"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "40",
          "41",
          "42",
          "43",
          "44"
        ]
      }
    ],
    variants: [
      {
        sku: "SHO-0012-BLA-40",
        color: "Black",
        size: "40",
        stock: 5
      },
      {
        sku: "SHO-0012-BLA-41",
        color: "Black",
        size: "41",
        stock: 8
      },
      {
        sku: "SHO-0012-BLA-42",
        color: "Black",
        size: "42",
        stock: 0
      },
      {
        sku: "SHO-0012-BLA-43",
        color: "Black",
        size: "43",
        stock: 4
      },
      {
        sku: "SHO-0012-BLU-40",
        color: "Blue",
        size: "40",
        stock: 4
      },
      {
        sku: "SHO-0012-BLU-42",
        color: "Blue",
        size: "42",
        stock: 6
      },
      {
        sku: "SHO-0012-RED-41",
        color: "Red",
        size: "41",
        stock: 5
      },
      {
        sku: "SHO-0012-RED-43",
        color: "Red",
        size: "43",
        stock: 3
      },
      {
        sku: "SHO-0012-GRA-41",
        color: "Gray",
        size: "41",
        stock: 4
      },
      {
        sku: "SHO-0012-GRA-44",
        color: "Gray",
        size: "44",
        stock: 2
      },
      {
        sku: "SHO-0012-WHI-42",
        color: "White",
        size: "42",
        stock: 4
      },
      {
        sku: "SHO-0012-WHI-44",
        color: "White",
        size: "44",
        stock: 2
      }
    ]
  },
  {
    id: 13,
    title: "Canvas Low Top",
    image: [
      "https://pngimg.com/uploads/converse/converse_PNG66.png",
      "https://pngimg.com/uploads/converse/converse_PNG66.png",
      "https://pngimg.com/uploads/converse/converse_PNG66.png",
      "https://pngimg.com/uploads/converse/converse_PNG66.png",
      "https://pngimg.com/uploads/converse/converse_PNG66.png",
      "https://pngimg.com/uploads/converse/converse_PNG66.png"
    ],
    category: "shoe",
    price: 55,
    review: 1634,
    rating: 1.3,
    createdAt: "2023-10-19T14:50:00.000Z",
    isFeatured: false,
    description: "Step up your footwear game with our Canvas Low Top. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [
      "Premium Materials",
      "Comfortable Fit",
      "Durable Construction",
      "Stylish Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Mia Taylor",
        date: "2026-05-18T23:08:27.034Z",
        rating: 2,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 2,
        name: "Benjamin White",
        date: "2025-11-10T19:17:50.027Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Red",
            hex: [
              "#D32F2F"
            ]
          },
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          },
          {
            name: "Beige",
            hex: [
              "#E1D5BC"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "40",
          "41",
          "42",
          "43",
          "44"
        ]
      }
    ],
    variants: [
      {
        sku: "SHO-0013-WHI-40",
        color: "White",
        size: "40",
        stock: 7
      },
      {
        sku: "SHO-0013-WHI-41",
        color: "White",
        size: "41",
        stock: 9
      },
      {
        sku: "SHO-0013-WHI-42",
        color: "White",
        size: "42",
        stock: 0
      },
      {
        sku: "SHO-0013-WHI-43",
        color: "White",
        size: "43",
        stock: 4
      },
      {
        sku: "SHO-0013-BLA-40",
        color: "Black",
        size: "40",
        stock: 6
      },
      {
        sku: "SHO-0013-BLA-42",
        color: "Black",
        size: "42",
        stock: 7
      },
      {
        sku: "SHO-0013-BLA-44",
        color: "Black",
        size: "44",
        stock: 2
      },
      {
        sku: "SHO-0013-RED-41",
        color: "Red",
        size: "41",
        stock: 5
      },
      {
        sku: "SHO-0013-RED-44",
        color: "Red",
        size: "44",
        stock: 2
      },
      {
        sku: "SHO-0013-NAV-41",
        color: "Navy",
        size: "41",
        stock: 5
      },
      {
        sku: "SHO-0013-NAV-43",
        color: "Navy",
        size: "43",
        stock: 3
      },
      {
        sku: "SHO-0013-BEI-42",
        color: "Beige",
        size: "42",
        stock: 4
      }
    ]
  },
  {
    id: 14,
    title: "Chelsea Boots",
    image: [
      "https://pngimg.com/uploads/boots/boots_PNG7809.png",
      "https://pngimg.com/uploads/boots/boots_PNG7809.png",
      "https://pngimg.com/uploads/boots/boots_PNG7809.png",
      "https://pngimg.com/uploads/boots/boots_PNG7809.png"
    ],
    category: "shoe",
    price: 149,
    review: 589,
    rating: 4.9,
    createdAt: "2024-02-07T10:15:00.000Z",
    isFeatured: true,
    description: "Step up your footwear game with our Chelsea Boots. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [
      "Premium Materials",
      "Comfortable Fit",
      "Durable Construction",
      "Stylish Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Aria Moore",
        date: "2026-07-18T11:02:07.199Z",
        rating: 5,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 2,
        name: "Logan Allen",
        date: "2026-06-14T17:54:04.213Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 3,
        name: "Layla Morales",
        date: "2026-05-31T21:23:48.510Z",
        rating: 5,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 4,
        name: "Liam Johnson",
        date: "2026-05-22T19:31:55.113Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 5,
        name: "Luke Ramos",
        date: "2026-01-23T01:01:38.833Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 6,
        name: "Nora Walker",
        date: "2025-11-21T08:44:35.644Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 7,
        name: "Paisley Thompson",
        date: "2025-11-18T09:25:31.858Z",
        rating: 5,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 8,
        name: "Aaron Hughes",
        date: "2025-09-24T23:13:50.882Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 9,
        name: "Mateo Rivera",
        date: "2025-07-20T16:17:44.530Z",
        rating: 5,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 10,
        name: "Nathaniel James",
        date: "2025-06-20T08:35:19.720Z",
        rating: 5,
        comment: "Love the color options available."
      },
      {
        id: 11,
        name: "William Torres",
        date: "2025-05-14T11:32:04.868Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 12,
        name: "Jayden Howard",
        date: "2025-04-27T19:25:52.922Z",
        rating: 5,
        comment: "The stitching and finish are excellent."
      },
      {
        id: 13,
        name: "Christopher Adams",
        date: "2025-04-07T07:17:48.109Z",
        rating: 4,
        comment: "Matches the description perfectly."
      },
      {
        id: 14,
        name: "Brooklyn Long",
        date: "2025-02-13T07:50:23.843Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 15,
        name: "Jaxon Allen",
        date: "2025-01-15T15:04:10.023Z",
        rating: 5,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 16,
        name: "Emma Harris",
        date: "2025-01-12T04:09:59.692Z",
        rating: 3,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 17,
        name: "Aaron Price",
        date: "2024-12-24T04:51:17.766Z",
        rating: 5,
        comment: "Fantastic product. My new favorite!"
      },
      {
        id: 18,
        name: "Stella Perez",
        date: "2024-10-30T01:53:45.510Z",
        rating: 5,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 19,
        name: "Carter Robinson",
        date: "2024-10-22T04:37:57.230Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 20,
        name: "Addison Reed",
        date: "2024-10-21T07:58:57.955Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 21,
        name: "Hazel Adams",
        date: "2024-07-24T03:34:26.237Z",
        rating: 4,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 22,
        name: "Violet Cook",
        date: "2024-07-19T11:29:11.911Z",
        rating: 5,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 23,
        name: "Mason Harris",
        date: "2024-06-04T09:01:20.581Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 24,
        name: "Mason Harris",
        date: "2024-06-04T09:01:20.581Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 25,
        name: "Ryan Garcia",
        date: "2024-05-24T19:58:54.604Z",
        rating: 4,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 26,
        name: "Jonathan Turner",
        date: "2024-04-23T03:41:58.414Z",
        rating: 5,
        comment: "The material feels premium and durable."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Brown",
            hex: [
              "#6D4C41"
            ]
          },
          {
            name: "Burgundy",
            hex: [
              "#800020"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "40",
          "41",
          "42",
          "43",
          "44"
        ]
      }
    ],
    variants: [
      {
        sku: "SHO-0014-BLA-40",
        color: "Black",
        size: "40",
        stock: 2
      },
      {
        sku: "SHO-0014-BLA-41",
        color: "Black",
        size: "41",
        stock: 3
      },
      {
        sku: "SHO-0014-BLA-42",
        color: "Black",
        size: "42",
        stock: 2
      },
      {
        sku: "SHO-0014-BLA-43",
        color: "Black",
        size: "43",
        stock: 0
      },
      {
        sku: "SHO-0014-BLA-44",
        color: "Black",
        size: "44",
        stock: 1
      },
      {
        sku: "SHO-0014-BRO-41",
        color: "Brown",
        size: "41",
        stock: 2
      },
      {
        sku: "SHO-0014-BRO-43",
        color: "Brown",
        size: "43",
        stock: 1
      },
      {
        sku: "SHO-0014-BUR-42",
        color: "Burgundy",
        size: "42",
        stock: 1
      }
    ]
  },
  {
    id: 15,
    title: "Sandals Summer",
    image: [
      "https://pngimg.com/uploads/boots/boots_PNG7808.png",
      "https://pngimg.com/uploads/boots/boots_PNG7808.png",
      "https://pngimg.com/uploads/boots/boots_PNG7808.png",
      "https://pngimg.com/uploads/boots/boots_PNG7808.png"
    ],
    category: "shoe",
    price: 45,
    review: 876,
    rating: 4.1,
    createdAt: "2024-04-28T16:00:00.000Z",
    isFeatured: false,
    description: "Step up your footwear game with our Sandals Summer. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [
      "Premium Materials",
      "Comfortable Fit",
      "Durable Construction",
      "Stylish Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Eleanor Peterson",
        date: "2026-10-17T15:01:35.608Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 2,
        name: "Joseph Collins",
        date: "2026-07-23T20:18:21.574Z",
        rating: 3,
        comment: "Acceptable quality. Would consider other options next time."
      },
      {
        id: 3,
        name: "Carter Morales",
        date: "2026-06-19T20:21:33.113Z",
        rating: 4,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 4,
        name: "Connor Wright",
        date: "2026-05-15T16:47:17.588Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 5,
        name: "Lucas Hall",
        date: "2026-04-11T00:09:48.580Z",
        rating: 4,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 6,
        name: "Everly Morgan",
        date: "2026-03-19T17:47:04.420Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 7,
        name: "Grayson Price",
        date: "2026-03-14T19:52:47.496Z",
        rating: 3,
        comment: "Acceptable quality. Would consider other options next time."
      },
      {
        id: 8,
        name: "Addison Gonzalez",
        date: "2026-01-31T14:00:32.366Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 9,
        name: "Caroline Howard",
        date: "2025-12-30T16:43:18.825Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 10,
        name: "Robert Carter",
        date: "2025-11-15T14:30:36.454Z",
        rating: 4,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 11,
        name: "Anthony Murphy",
        date: "2025-11-10T08:47:17.051Z",
        rating: 5,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 12,
        name: "Harper Rivera",
        date: "2025-10-31T05:50:33.139Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      },
      {
        id: 13,
        name: "Robert Harris",
        date: "2025-09-16T03:40:53.776Z",
        rating: 2,
        comment: "Quality is not what I expected for the price."
      },
      {
        id: 14,
        name: "Aaron Hall",
        date: "2025-08-12T10:27:57.045Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 15,
        name: "Julian Cruz",
        date: "2025-08-11T20:22:58.891Z",
        rating: 4,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 16,
        name: "Gabriel Brooks",
        date: "2025-06-01T10:53:19.209Z",
        rating: 5,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 17,
        name: "Michael Williams",
        date: "2025-05-22T16:41:13.845Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 18,
        name: "Bella Ward",
        date: "2025-05-02T07:38:56.611Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 19,
        name: "Ryan Brown",
        date: "2025-04-04T18:20:24.053Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 20,
        name: "Olivia Lopez",
        date: "2025-03-19T17:48:37.212Z",
        rating: 5,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 21,
        name: "Luke Ruiz",
        date: "2025-02-22T12:09:19.465Z",
        rating: 3,
        comment: "It's okay. Does the job but not amazing."
      },
      {
        id: 22,
        name: "Abigail Martinez",
        date: "2025-01-26T14:44:56.623Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 23,
        name: "Jack Scott",
        date: "2024-12-17T19:03:21.522Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      },
      {
        id: 24,
        name: "Dylan White",
        date: "2024-11-10T15:10:17.771Z",
        rating: 4,
        comment: "The stitching and finish are excellent."
      },
      {
        id: 25,
        name: "Olivia Martinez",
        date: "2024-10-23T23:33:17.595Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 26,
        name: "Audrey Carter",
        date: "2024-10-17T01:44:30.065Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 27,
        name: "Liam Hernandez",
        date: "2024-08-26T12:14:32.777Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 28,
        name: "Anna Hall",
        date: "2024-07-13T22:16:04.122Z",
        rating: 3,
        comment: "Functional but the design could be improved."
      },
      {
        id: 29,
        name: "Mason King",
        date: "2024-06-02T13:06:41.268Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Brown",
            hex: [
              "#6D4C41"
            ]
          },
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Beige",
            hex: [
              "#E1D5BC"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "40",
          "41",
          "42",
          "43",
          "44"
        ]
      }
    ],
    variants: [
      {
        sku: "SHO-0015-BRO-40",
        color: "Brown",
        size: "40",
        stock: 5
      },
      {
        sku: "SHO-0015-BRO-42",
        color: "Brown",
        size: "42",
        stock: 5
      },
      {
        sku: "SHO-0015-BLA-40",
        color: "Black",
        size: "40",
        stock: 4
      },
      {
        sku: "SHO-0015-BLA-42",
        color: "Black",
        size: "42",
        stock: 3
      },
      {
        sku: "SHO-0015-BEI-41",
        color: "Beige",
        size: "41",
        stock: 7
      },
      {
        sku: "SHO-0015-BEI-43",
        color: "Beige",
        size: "43",
        stock: 3
      },
      {
        sku: "SHO-0015-WHI-41",
        color: "White",
        size: "41",
        stock: 5
      },
      {
        sku: "SHO-0015-WHI-44",
        color: "White",
        size: "44",
        stock: 2
      }
    ]
  },
  {
    id: 16,
    title: "High Top Sneakers",
    image: [
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png",
      "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png"
    ],
    category: "shoe",
    price: 85,
    review: 1345,
    rating: 4.4,
    createdAt: "2024-07-11T08:30:00.000Z",
    isFeatured: false,
    description: "Step up your footwear game with our High Top Sneakers. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [
      "Premium Materials",
      "Comfortable Fit",
      "Durable Construction",
      "Stylish Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Ethan Hall",
        date: "2026-10-04T15:20:27.850Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 2,
        name: "Jayden Wright",
        date: "2026-07-25T13:13:05.898Z",
        rating: 5,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 3,
        name: "Liam Young",
        date: "2026-07-01T04:40:39.434Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 4,
        name: "Ava Perez",
        date: "2026-05-29T12:46:57.778Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 5,
        name: "Lillian Phillips",
        date: "2026-05-29T11:51:08.948Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 6,
        name: "Jaxon Gutierrez",
        date: "2026-04-06T21:38:31.311Z",
        rating: 5,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 7,
        name: "Carter Ruiz",
        date: "2026-03-18T19:55:55.087Z",
        rating: 4,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 8,
        name: "Nora Patel",
        date: "2026-01-26T03:51:05.726Z",
        rating: 5,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 9,
        name: "Lucy Howard",
        date: "2026-01-23T13:16:23.262Z",
        rating: 5,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 10,
        name: "Alexander Thompson",
        date: "2026-01-04T21:23:54.381Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 11,
        name: "Hazel Reed",
        date: "2025-11-20T20:45:16.163Z",
        rating: 4,
        comment: "The material feels premium and durable."
      },
      {
        id: 12,
        name: "Alexander Bennett",
        date: "2025-07-15T06:30:08.929Z",
        rating: 3,
        comment: "Acceptable quality. Would consider other options next time."
      },
      {
        id: 13,
        name: "Henry Hall",
        date: "2025-06-17T22:35:14.014Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 14,
        name: "Eleanor Thompson",
        date: "2025-06-16T09:54:54.332Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 15,
        name: "Chloe Scott",
        date: "2025-03-03T11:55:42.520Z",
        rating: 4,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 16,
        name: "Riley Lee",
        date: "2024-10-04T12:07:28.919Z",
        rating: 4,
        comment: "The stitching and finish are excellent."
      },
      {
        id: 17,
        name: "Aaron Green",
        date: "2024-09-18T04:41:09.169Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 18,
        name: "Mia Diaz",
        date: "2024-08-10T20:43:41.190Z",
        rating: 4,
        comment: "One of the best purchases I've made this year."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Gray",
            hex: [
              "#9E9E9E"
            ]
          },
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          }
        ]
      },
      {
        name: "size",
        values: [
          "40",
          "41",
          "42",
          "43",
          "44"
        ]
      }
    ],
    variants: [
      {
        sku: "SHO-0016-BLA-40",
        color: "Black",
        size: "40",
        stock: 4
      },
      {
        sku: "SHO-0016-BLA-41",
        color: "Black",
        size: "41",
        stock: 6
      },
      {
        sku: "SHO-0016-BLA-42",
        color: "Black",
        size: "42",
        stock: 0
      },
      {
        sku: "SHO-0016-BLA-43",
        color: "Black",
        size: "43",
        stock: 3
      },
      {
        sku: "SHO-0016-WHI-40",
        color: "White",
        size: "40",
        stock: 3
      },
      {
        sku: "SHO-0016-WHI-42",
        color: "White",
        size: "42",
        stock: 3
      },
      {
        sku: "SHO-0016-GRA-41",
        color: "Gray",
        size: "41",
        stock: 4
      },
      {
        sku: "SHO-0016-GRA-44",
        color: "Gray",
        size: "44",
        stock: 2
      },
      {
        sku: "SHO-0016-NAV-42",
        color: "Navy",
        size: "42",
        stock: 5
      }
    ]
  },
  {
    id: 17,
    title: "Leather Tote Bag",
    image: [
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6406.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6406.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6406.png"
    ],
    category: "handbag",
    price: 119,
    review: 945,
    rating: 2.7,
    createdAt: "2023-01-28T13:20:00.000Z",
    isFeatured: false,
    description: "Discover the perfect blend of style and functionality with our Leather Tote Bag. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [
      "Spacious Interior",
      "Premium Materials",
      "Versatile Style",
      "Secure Closures"
    ],
    reviews: [
      {
        id: 1,
        name: "Ethan Wright",
        date: "2026-08-14T08:19:56.583Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 2,
        name: "Daniel Davis",
        date: "2025-09-09T23:59:39.472Z",
        rating: 1,
        comment: "Very disappointed. Not worth the money."
      },
      {
        id: 3,
        name: "Mia Hall",
        date: "2024-10-03T18:04:47.857Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 4,
        name: "Bella Howard",
        date: "2024-09-13T09:27:41.938Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Brown",
            hex: [
              "#6D4C41"
            ]
          },
          {
            name: "Tan",
            hex: [
              "#D2B48C"
            ]
          },
          {
            name: "Burgundy",
            hex: [
              "#800020"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "BAG-0017-BLA",
        color: "Black",
        stock: 7
      },
      {
        sku: "BAG-0017-BRO",
        color: "Brown",
        stock: 6
      },
      {
        sku: "BAG-0017-TAN",
        color: "Tan",
        stock: 5
      },
      {
        sku: "BAG-0017-BUR",
        color: "Burgundy",
        stock: 3
      }
    ]
  },
  {
    id: 18,
    title: "Mini Crossbody Bag",
    image: [
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6407.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6407.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6407.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6407.png"
    ],
    category: "handbag",
    price: 69,
    review: 1678,
    rating: 4.5,
    createdAt: "2023-04-16T09:40:00.000Z",
    isFeatured: false,
    description: "Discover the perfect blend of style and functionality with our Mini Crossbody Bag. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [
      "Spacious Interior",
      "Premium Materials",
      "Versatile Style",
      "Secure Closures"
    ],
    reviews: [
      {
        id: 1,
        name: "Ryan Lee",
        date: "2026-09-13T07:09:07.979Z",
        rating: 5,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 2,
        name: "Alexander Taylor",
        date: "2026-09-10T02:10:12.153Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 3,
        name: "Hannah Peterson",
        date: "2026-05-28T13:43:59.738Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 4,
        name: "Violet Collins",
        date: "2026-04-21T01:07:01.926Z",
        rating: 4,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 5,
        name: "Logan Martin",
        date: "2025-09-16T00:20:29.767Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 6,
        name: "Penelope Cooper",
        date: "2025-09-14T10:51:55.287Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 7,
        name: "Levi Richardson",
        date: "2025-08-08T15:23:53.427Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 8,
        name: "Charlotte Ortiz",
        date: "2025-05-30T15:56:25.570Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 9,
        name: "Victoria Parker",
        date: "2025-05-11T23:33:53.400Z",
        rating: 4,
        comment: "Will be ordering more in different colors."
      },
      {
        id: 10,
        name: "Daniel Smith",
        date: "2025-01-13T19:18:32.384Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 11,
        name: "Avery Alvarez",
        date: "2025-01-10T14:38:56.951Z",
        rating: 4,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 12,
        name: "Bella Kelly",
        date: "2024-12-10T00:39:00.082Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 13,
        name: "Aaron Collins",
        date: "2024-12-06T16:02:29.770Z",
        rating: 4,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 14,
        name: "Nathaniel Flores",
        date: "2024-10-28T17:59:15.130Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 15,
        name: "Mia Johnson",
        date: "2024-05-07T11:45:41.613Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 16,
        name: "Jayden Castillo",
        date: "2024-03-20T09:36:50.966Z",
        rating: 5,
        comment: "Solid quality and good value for money."
      },
      {
        id: 17,
        name: "Adrian Jones",
        date: "2024-01-27T21:12:06.502Z",
        rating: 3,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 18,
        name: "Grayson Turner",
        date: "2024-01-18T17:51:55.362Z",
        rating: 5,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 19,
        name: "Avery Davis",
        date: "2023-10-13T12:51:50.687Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 20,
        name: "Maya Jackson",
        date: "2023-09-02T17:31:05.655Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 21,
        name: "Olivia Myers",
        date: "2023-06-24T12:38:45.041Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 22,
        name: "Addison Moore",
        date: "2023-06-24T01:32:27.621Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 23,
        name: "Aaron Lewis",
        date: "2023-05-27T10:54:00.993Z",
        rating: 5,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 24,
        name: "Isabella Ward",
        date: "2023-05-02T07:03:13.840Z",
        rating: 5,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 25,
        name: "Paisley White",
        date: "2023-04-27T20:15:22.476Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Beige",
            hex: [
              "#E1D5BC"
            ]
          },
          {
            name: "Pink",
            hex: [
              "#F48FB1"
            ]
          },
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "BAG-0018-BLA",
        color: "Black",
        stock: 12
      },
      {
        sku: "BAG-0018-BEI",
        color: "Beige",
        stock: 10
      },
      {
        sku: "BAG-0018-PIN",
        color: "Pink",
        stock: 8
      },
      {
        sku: "BAG-0018-NAV",
        color: "Navy",
        stock: 6
      }
    ]
  },
  {
    id: 19,
    title: "Structured Shoulder Bag",
    image: [
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6408.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6408.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6408.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6408.png"
    ],
    category: "handbag",
    price: 139,
    review: 723,
    rating: 4.8,
    createdAt: "2023-08-02T15:55:00.000Z",
    isFeatured: true,
    description: "Discover the perfect blend of style and functionality with our Structured Shoulder Bag. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [
      "Spacious Interior",
      "Premium Materials",
      "Versatile Style",
      "Secure Closures"
    ],
    reviews: [
      {
        id: 1,
        name: "Joshua Scott",
        date: "2026-10-13T09:01:46.523Z",
        rating: 4,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 2,
        name: "Eli Collins",
        date: "2026-06-18T00:34:00.319Z",
        rating: 5,
        comment: "The stitching and finish are excellent."
      },
      {
        id: 3,
        name: "Luke Castillo",
        date: "2026-05-15T03:19:26.464Z",
        rating: 4,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 4,
        name: "Benjamin Lewis",
        date: "2026-05-02T08:04:26.127Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 5,
        name: "Benjamin Scott",
        date: "2026-03-13T17:00:02.063Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 6,
        name: "Abigail Thomas",
        date: "2025-08-11T08:57:31.440Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 7,
        name: "Isaac Castillo",
        date: "2025-05-05T01:14:13.999Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 8,
        name: "Brooklyn Cruz",
        date: "2025-03-29T08:00:08.750Z",
        rating: 3,
        comment: "Functional but the design could be improved."
      },
      {
        id: 9,
        name: "Jaxon Johnson",
        date: "2024-08-29T08:35:19.780Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 10,
        name: "Landon King",
        date: "2023-08-16T00:49:38.353Z",
        rating: 4,
        comment: "Surprisingly good quality for the price point."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Brown",
            hex: [
              "#6D4C41"
            ]
          },
          {
            name: "Red",
            hex: [
              "#D32F2F"
            ]
          },
          {
            name: "Gray",
            hex: [
              "#9E9E9E"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "BAG-0019-BLA",
        color: "Black",
        stock: 5
      },
      {
        sku: "BAG-0019-BRO",
        color: "Brown",
        stock: 4
      },
      {
        sku: "BAG-0019-RED",
        color: "Red",
        stock: 3
      },
      {
        sku: "BAG-0019-GRA",
        color: "Gray",
        stock: 2
      }
    ]
  },
  {
    id: 20,
    title: "Canvas Shopper",
    image: [
      "https://pngimg.com/uploads/shopping_bag/shopping_bag_PNG6392.png",
      "https://pngimg.com/uploads/shopping_bag/shopping_bag_PNG6392.png",
      "https://pngimg.com/uploads/shopping_bag/shopping_bag_PNG6392.png",
      "https://pngimg.com/uploads/shopping_bag/shopping_bag_PNG6392.png",
      "https://pngimg.com/uploads/shopping_bag/shopping_bag_PNG6392.png"
    ],
    category: "handbag",
    price: 35,
    review: 2109,
    rating: 1.2,
    createdAt: "2023-11-21T11:10:00.000Z",
    isFeatured: false,
    description: "Discover the perfect blend of style and functionality with our Canvas Shopper. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [
      "Spacious Interior",
      "Premium Materials",
      "Versatile Style",
      "Secure Closures"
    ],
    reviews: [
      {
        id: 1,
        name: "Charlotte Robinson",
        date: "2025-12-10T18:21:52.914Z",
        rating: 2,
        comment: "Quality is not what I expected for the price."
      },
      {
        id: 2,
        name: "Henry Clark",
        date: "2025-10-28T17:16:00.329Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Beige",
            hex: [
              "#E1D5BC"
            ]
          },
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          },
          {
            name: "Olive",
            hex: [
              "#6B7B3A"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "BAG-0020-BEI",
        color: "Beige",
        stock: 15
      },
      {
        sku: "BAG-0020-BLA",
        color: "Black",
        stock: 13
      },
      {
        sku: "BAG-0020-NAV",
        color: "Navy",
        stock: 12
      },
      {
        sku: "BAG-0020-OLI",
        color: "Olive",
        stock: 8
      }
    ]
  },
  {
    id: 21,
    title: "Clutch Evening Bag",
    image: [
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png"
    ],
    category: "handbag",
    price: 79,
    review: 412,
    rating: 4.6,
    createdAt: "2024-01-09T17:25:00.000Z",
    isFeatured: false,
    description: "Discover the perfect blend of style and functionality with our Clutch Evening Bag. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [
      "Spacious Interior",
      "Premium Materials",
      "Versatile Style",
      "Secure Closures"
    ],
    reviews: [
      {
        id: 1,
        name: "Addison Lopez",
        date: "2026-08-21T12:34:01.042Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 2,
        name: "Skylar Jackson",
        date: "2026-08-17T15:33:39.816Z",
        rating: 3,
        comment: "Functional but the design could be improved."
      },
      {
        id: 3,
        name: "Andrew Brown",
        date: "2026-07-18T00:19:01.242Z",
        rating: 5,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 4,
        name: "William Adams",
        date: "2026-04-25T05:03:05.859Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 5,
        name: "Aubrey Hall",
        date: "2025-06-08T20:14:40.704Z",
        rating: 4,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 6,
        name: "Penelope Moore",
        date: "2025-05-11T21:12:30.305Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 7,
        name: "Isaac Price",
        date: "2025-02-26T12:04:51.419Z",
        rating: 4,
        comment: "Fantastic product. My new favorite!"
      },
      {
        id: 8,
        name: "Riley Adams",
        date: "2025-02-03T21:24:31.381Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 9,
        name: "Isaiah Harris",
        date: "2025-01-01T00:44:18.248Z",
        rating: 4,
        comment: "Matches the description perfectly."
      },
      {
        id: 10,
        name: "Riley Sanchez",
        date: "2024-11-08T19:33:17.214Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 11,
        name: "Andrew Bailey",
        date: "2024-10-21T22:35:18.012Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 12,
        name: "Lucy Morales",
        date: "2024-08-15T03:19:52.844Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 13,
        name: "Noah Thomas",
        date: "2024-06-01T07:54:21.894Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 14,
        name: "Nolan Nguyen",
        date: "2024-04-15T20:40:06.245Z",
        rating: 5,
        comment: "Will be ordering more in different colors."
      },
      {
        id: 15,
        name: "Evelyn Nelson",
        date: "2024-02-01T09:30:05.718Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 16,
        name: "Abigail Harris",
        date: "2024-01-15T22:09:30.906Z",
        rating: 5,
        comment: "I've recommended this to all my friends."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Gold",
            hex: [
              "#D4AF37"
            ]
          },
          {
            name: "Silver",
            hex: [
              "#C0C0C0"
            ]
          },
          {
            name: "Red",
            hex: [
              "#D32F2F"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "BAG-0021-BLA",
        color: "Black",
        stock: 3
      },
      {
        sku: "BAG-0021-GOL",
        color: "Gold",
        stock: 2
      },
      {
        sku: "BAG-0021-SIL",
        color: "Silver",
        stock: 2
      },
      {
        sku: "BAG-0021-RED",
        color: "Red",
        stock: 2
      }
    ]
  },
  {
    id: 22,
    title: "Backpack Leather",
    image: [
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6410.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6410.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6410.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6410.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6410.png"
    ],
    category: "handbag",
    price: 129,
    review: 1187,
    rating: 4.4,
    createdAt: "2024-03-15T12:45:00.000Z",
    isFeatured: false,
    description: "Discover the perfect blend of style and functionality with our Backpack Leather. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [
      "Spacious Interior",
      "Premium Materials",
      "Versatile Style",
      "Secure Closures"
    ],
    reviews: [
      {
        id: 1,
        name: "Ava Cox",
        date: "2026-10-22T17:06:19.739Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 2,
        name: "Logan Garcia",
        date: "2026-09-15T00:27:16.016Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 3,
        name: "Daniel Walker",
        date: "2026-08-24T14:04:34.407Z",
        rating: 3,
        comment: "It's okay. Does the job but not amazing."
      },
      {
        id: 4,
        name: "Lincoln Williams",
        date: "2026-07-21T00:16:08.743Z",
        rating: 4,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 5,
        name: "Claire Walker",
        date: "2026-05-15T05:07:18.531Z",
        rating: 2,
        comment: "Took too long to arrive and packaging was damaged."
      },
      {
        id: 6,
        name: "Charlotte Hill",
        date: "2025-08-21T05:57:12.931Z",
        rating: 3,
        comment: "It's okay. Does the job but not amazing."
      },
      {
        id: 7,
        name: "Camila Green",
        date: "2025-07-19T01:05:04.604Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 8,
        name: "Ella Turner",
        date: "2025-05-03T10:39:51.332Z",
        rating: 4,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 9,
        name: "Daniel Martinez",
        date: "2025-02-28T14:12:51.926Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 10,
        name: "Olivia Gonzalez",
        date: "2024-11-05T07:57:17.192Z",
        rating: 4,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 11,
        name: "Lily Bailey",
        date: "2024-09-16T06:30:55.422Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 12,
        name: "Riley Wood",
        date: "2024-09-08T04:26:33.638Z",
        rating: 3,
        comment: "Acceptable quality. Would consider other options next time."
      },
      {
        id: 13,
        name: "Benjamin Lee",
        date: "2024-06-01T14:02:23.967Z",
        rating: 3,
        comment: "It's alright. Not the best, not the worst."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Brown",
            hex: [
              "#6D4C41"
            ]
          },
          {
            name: "Dark Green",
            hex: [
              "#1B4D2E"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "BAG-0022-BLA",
        color: "Black",
        stock: 9
      },
      {
        sku: "BAG-0022-BRO",
        color: "Brown",
        stock: 8
      },
      {
        sku: "BAG-0022-DARGRE",
        color: "Dark Green",
        stock: 6
      }
    ]
  },
  {
    id: 23,
    title: "Bucket Bag",
    image: [
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6411.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6411.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6411.png"
    ],
    category: "handbag",
    price: 89,
    review: 834,
    rating: 2.3,
    createdAt: "2024-06-20T10:00:00.000Z",
    isFeatured: false,
    description: "Discover the perfect blend of style and functionality with our Bucket Bag. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [
      "Spacious Interior",
      "Premium Materials",
      "Versatile Style",
      "Secure Closures"
    ],
    reviews: [
      {
        id: 1,
        name: "Sebastian Martin",
        date: "2026-10-22T13:52:49.211Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 2,
        name: "Emma Smith",
        date: "2026-08-18T22:26:21.620Z",
        rating: 1,
        comment: "Color was different from the photos."
      },
      {
        id: 3,
        name: "William Harris",
        date: "2026-06-03T08:49:11.820Z",
        rating: 1,
        comment: "Very disappointed. Not worth the money."
      },
      {
        id: 4,
        name: "Julian Morris",
        date: "2026-02-27T15:12:16.494Z",
        rating: 2,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 5,
        name: "Jacob Lewis",
        date: "2025-08-13T17:19:20.054Z",
        rating: 2,
        comment: "Took too long to arrive and packaging was damaged."
      },
      {
        id: 6,
        name: "Scarlett Harris",
        date: "2024-12-20T12:17:45.288Z",
        rating: 1,
        comment: "Took too long to arrive and packaging was damaged."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Brown",
            hex: [
              "#6D4C41"
            ]
          },
          {
            name: "Beige",
            hex: [
              "#E1D5BC"
            ]
          },
          {
            name: "Camel",
            hex: [
              "#C19A6B"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "BAG-0023-BLA",
        color: "Black",
        stock: 5
      },
      {
        sku: "BAG-0023-BRO",
        color: "Brown",
        stock: 5
      },
      {
        sku: "BAG-0023-BEI",
        color: "Beige",
        stock: 4
      },
      {
        sku: "BAG-0023-CAM",
        color: "Camel",
        stock: 3
      }
    ]
  },
  {
    id: 24,
    title: "Work Laptop Bag",
    image: [
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6428.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6428.png",
      "https://pngimg.com/uploads/women_bag/women_bag_PNG6428.png"
    ],
    category: "handbag",
    price: 149,
    review: 1456,
    rating: 4.7,
    createdAt: "2024-09-04T14:30:00.000Z",
    isFeatured: true,
    description: "Discover the perfect blend of style and functionality with our Work Laptop Bag. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [
      "Spacious Interior",
      "Premium Materials",
      "Versatile Style",
      "Secure Closures"
    ],
    reviews: [
      {
        id: 1,
        name: "Henry Green",
        date: "2026-07-26T23:15:51.018Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 2,
        name: "David Evans",
        date: "2026-05-02T02:33:01.037Z",
        rating: 5,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 3,
        name: "Olivia Hill",
        date: "2026-05-01T22:19:27.450Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 4,
        name: "Joshua Murphy",
        date: "2026-04-09T12:26:17.736Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 5,
        name: "Emilia Brown",
        date: "2025-12-19T15:43:24.116Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 6,
        name: "James Scott",
        date: "2025-12-14T12:44:28.643Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 7,
        name: "Mason Wilson",
        date: "2025-05-27T16:11:51.776Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 8,
        name: "Aubrey Gray",
        date: "2024-11-21T11:25:47.020Z",
        rating: 3,
        comment: "It's okay. Does the job but not amazing."
      },
      {
        id: 9,
        name: "Charlotte Wright",
        date: "2024-10-25T12:05:04.271Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 10,
        name: "Robert Edwards",
        date: "2024-10-07T15:15:52.295Z",
        rating: 4,
        comment: "Fits perfectly and looks even better in person."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Gray",
            hex: [
              "#9E9E9E"
            ]
          },
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          },
          {
            name: "Brown",
            hex: [
              "#6D4C41"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "BAG-0024-BLA",
        color: "Black",
        stock: 10
      },
      {
        sku: "BAG-0024-GRA",
        color: "Gray",
        stock: 8
      },
      {
        sku: "BAG-0024-NAV",
        color: "Navy",
        stock: 7
      },
      {
        sku: "BAG-0024-BRO",
        color: "Brown",
        stock: 4
      }
    ]
  },
  {
    id: 25,
    title: "Classic Fedora",
    image: [
      "https://pngimg.com/uploads/hat/hat_PNG5697.png",
      "https://pngimg.com/uploads/hat/hat_PNG5697.png",
      "https://pngimg.com/uploads/hat/hat_PNG5697.png"
    ],
    category: "hat",
    price: 45,
    review: 1023,
    rating: 4.8,
    createdAt: "2023-02-05T08:15:00.000Z",
    isFeatured: true,
    description: "Top off your look with our Classic Fedora. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [
      "Comfortable Fit",
      "Premium Materials",
      "UV Protection",
      "Adjustable Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Christian Taylor",
        date: "2026-10-23T20:05:56.675Z",
        rating: 5,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 2,
        name: "Alexander Patel",
        date: "2026-09-25T06:31:26.247Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 3,
        name: "Adrian White",
        date: "2026-08-14T02:53:32.813Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 4,
        name: "John Edwards",
        date: "2026-04-18T15:41:50.810Z",
        rating: 5,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 5,
        name: "Daniel Smith",
        date: "2026-02-21T23:45:31.177Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 6,
        name: "Anna Hall",
        date: "2025-12-14T02:58:02.740Z",
        rating: 5,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 7,
        name: "Isabella Wright",
        date: "2025-09-12T19:30:05.183Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 8,
        name: "Amelia Taylor",
        date: "2025-05-19T19:06:48.605Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 9,
        name: "Joseph Adams",
        date: "2025-04-16T22:39:10.722Z",
        rating: 5,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 10,
        name: "William Rivera",
        date: "2025-04-06T18:18:08.116Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 11,
        name: "Lily Harris",
        date: "2025-03-20T13:20:04.978Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 12,
        name: "Nolan Ward",
        date: "2025-03-01T09:29:57.704Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 13,
        name: "Lucas Davis",
        date: "2025-02-20T02:41:16.738Z",
        rating: 4,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 14,
        name: "Adrian Sanchez",
        date: "2025-02-17T20:26:22.768Z",
        rating: 4,
        comment: "Fantastic product. My new favorite!"
      },
      {
        id: 15,
        name: "Sofia Rogers",
        date: "2024-10-15T04:47:26.946Z",
        rating: 4,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 16,
        name: "Olivia Scott",
        date: "2024-09-30T09:07:46.309Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 17,
        name: "Jeremiah Walker",
        date: "2024-08-27T08:53:15.754Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 18,
        name: "Owen Jackson",
        date: "2024-08-01T14:59:17.400Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 19,
        name: "Layla Miller",
        date: "2024-03-06T14:53:42.745Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 20,
        name: "Levi Cook",
        date: "2024-01-02T10:33:25.278Z",
        rating: 5,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 21,
        name: "Noah Perez",
        date: "2023-07-15T23:34:05.288Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 22,
        name: "Jack Campbell",
        date: "2023-06-29T03:58:46.697Z",
        rating: 5,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 23,
        name: "Connor Patel",
        date: "2023-05-30T21:04:55.643Z",
        rating: 4,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 24,
        name: "Christopher Adams",
        date: "2023-03-03T23:19:38.213Z",
        rating: 5,
        comment: "Super soft and comfortable right out of the box."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Brown",
            hex: [
              "#6D4C41"
            ]
          },
          {
            name: "Gray",
            hex: [
              "#9E9E9E"
            ]
          },
          {
            name: "Beige",
            hex: [
              "#E1D5BC"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "HAT-0025-BLA",
        color: "Black",
        stock: 10
      },
      {
        sku: "HAT-0025-BRO",
        color: "Brown",
        stock: 9
      },
      {
        sku: "HAT-0025-GRA",
        color: "Gray",
        stock: 7
      },
      {
        sku: "HAT-0025-BEI",
        color: "Beige",
        stock: 5
      }
    ]
  },
  {
    id: 26,
    title: "Baseball Cap",
    image: [
      "https://pngimg.com/uploads/cap/cap_PNG5685.png",
      "https://pngimg.com/uploads/cap/cap_PNG5685.png",
      "https://pngimg.com/uploads/cap/cap_PNG5685.png"
    ],
    category: "hat",
    price: 25,
    review: 2876,
    rating: 1.4,
    createdAt: "2023-05-01T16:40:00.000Z",
    isFeatured: false,
    description: "Top off your look with our Baseball Cap. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [
      "Comfortable Fit",
      "Premium Materials",
      "UV Protection",
      "Adjustable Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Daniel Brown",
        date: "2026-08-23T04:09:21.162Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 2,
        name: "Sebastian Johnson",
        date: "2026-04-24T15:21:54.222Z",
        rating: 1,
        comment: "Poor quality. Would not recommend."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          },
          {
            name: "Red",
            hex: [
              "#D32F2F"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Gray",
            hex: [
              "#9E9E9E"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "HAT-0026-BLA",
        color: "Black",
        stock: 14
      },
      {
        sku: "HAT-0026-NAV",
        color: "Navy",
        stock: 12
      },
      {
        sku: "HAT-0026-RED",
        color: "Red",
        stock: 10
      },
      {
        sku: "HAT-0026-WHI",
        color: "White",
        stock: 9
      },
      {
        sku: "HAT-0026-GRA",
        color: "Gray",
        stock: 7
      }
    ]
  },
  {
    id: 27,
    title: "Wool Beanie",
    image: [
      "https://pngimg.com/uploads/hat/hat_PNG5698.png",
      "https://pngimg.com/uploads/hat/hat_PNG5698.png",
      "https://pngimg.com/uploads/hat/hat_PNG5698.png",
      "https://pngimg.com/uploads/hat/hat_PNG5698.png"
    ],
    category: "hat",
    price: 29,
    review: 1543,
    rating: 4.7,
    createdAt: "2023-09-18T11:50:00.000Z",
    isFeatured: true,
    description: "Top off your look with our Wool Beanie. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [
      "Comfortable Fit",
      "Premium Materials",
      "UV Protection",
      "Adjustable Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Camila Nguyen",
        date: "2026-10-07T18:48:09.546Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 2,
        name: "Emily Rivera",
        date: "2026-10-07T17:38:50.449Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 3,
        name: "Audrey Torres",
        date: "2026-09-28T05:58:57.029Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 4,
        name: "Mia Richardson",
        date: "2026-08-25T19:49:15.428Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 5,
        name: "Genesis Gomez",
        date: "2026-07-21T10:40:57.924Z",
        rating: 4,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 6,
        name: "Levi Perez",
        date: "2026-07-16T16:07:26.014Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 7,
        name: "Logan Walker",
        date: "2026-07-07T00:40:43.308Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 8,
        name: "Logan Clark",
        date: "2026-06-16T18:17:26.385Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 9,
        name: "Eli Murphy",
        date: "2026-06-05T05:32:42.088Z",
        rating: 5,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 10,
        name: "Elizabeth Garcia",
        date: "2026-03-28T14:13:56.032Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 11,
        name: "Levi Bailey",
        date: "2026-03-19T04:31:53.325Z",
        rating: 4,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 12,
        name: "Joshua Alvarez",
        date: "2026-02-17T20:34:27.317Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 13,
        name: "Scarlett Morgan",
        date: "2025-12-30T02:09:13.678Z",
        rating: 5,
        comment: "Fantastic product. My new favorite!"
      },
      {
        id: 14,
        name: "Elizabeth King",
        date: "2025-10-17T22:08:16.182Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 15,
        name: "Everly Hernandez",
        date: "2025-10-17T08:53:21.118Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 16,
        name: "Lillian Wilson",
        date: "2025-08-05T13:41:28.010Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 17,
        name: "Aurora Gomez",
        date: "2025-03-31T06:25:25.415Z",
        rating: 4,
        comment: "Love the color options available."
      },
      {
        id: 18,
        name: "Isabella Davis",
        date: "2024-08-19T06:34:15.360Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 19,
        name: "Caroline Flores",
        date: "2024-08-08T05:16:37.726Z",
        rating: 4,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 20,
        name: "Cameron Turner",
        date: "2024-05-20T01:42:20.808Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 21,
        name: "Owen Williams",
        date: "2024-03-26T21:34:07.849Z",
        rating: 5,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 22,
        name: "Nathaniel Turner",
        date: "2024-01-13T14:10:47.814Z",
        rating: 3,
        comment: "The product is fine, nothing special though."
      },
      {
        id: 23,
        name: "Emma Long",
        date: "2023-12-05T03:04:37.327Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Gray",
            hex: [
              "#9E9E9E"
            ]
          },
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          },
          {
            name: "Burgundy",
            hex: [
              "#800020"
            ]
          },
          {
            name: "Olive",
            hex: [
              "#6B7B3A"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "HAT-0027-BLA",
        color: "Black",
        stock: 10
      },
      {
        sku: "HAT-0027-GRA",
        color: "Gray",
        stock: 9
      },
      {
        sku: "HAT-0027-NAV",
        color: "Navy",
        stock: 8
      },
      {
        sku: "HAT-0027-BUR",
        color: "Burgundy",
        stock: 6
      },
      {
        sku: "HAT-0027-OLI",
        color: "Olive",
        stock: 5
      }
    ]
  },
  {
    id: 28,
    title: "Straw Summer Hat",
    image: [
      "https://pngimg.com/uploads/hat/hat_PNG5699.png",
      "https://pngimg.com/uploads/hat/hat_PNG5699.png",
      "https://pngimg.com/uploads/hat/hat_PNG5699.png",
      "https://pngimg.com/uploads/hat/hat_PNG5699.png",
      "https://pngimg.com/uploads/hat/hat_PNG5699.png",
      "https://pngimg.com/uploads/hat/hat_PNG5699.png",
      "https://pngimg.com/uploads/hat/hat_PNG5699.png"
    ],
    category: "hat",
    price: 39,
    review: 678,
    rating: 4.5,
    createdAt: "2024-02-14T09:05:00.000Z",
    isFeatured: false,
    description: "Top off your look with our Straw Summer Hat. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [
      "Comfortable Fit",
      "Premium Materials",
      "UV Protection",
      "Adjustable Design"
    ],
    reviews: [
      {
        id: 1,
        name: "John Diaz",
        date: "2026-10-04T16:59:47.230Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 2,
        name: "Gabriel King",
        date: "2026-08-17T15:56:18.901Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 3,
        name: "Riley Murphy",
        date: "2026-08-13T17:49:28.283Z",
        rating: 5,
        comment: "Fantastic product. My new favorite!"
      },
      {
        id: 4,
        name: "Emilia Mendoza",
        date: "2026-07-16T16:34:44.644Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 5,
        name: "Skylar Gomez",
        date: "2026-07-10T13:13:24.383Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 6,
        name: "Brooklyn Martinez",
        date: "2026-05-25T20:58:47.770Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 7,
        name: "Grace Jimenez",
        date: "2026-05-07T02:05:29.487Z",
        rating: 5,
        comment: "The stitching and finish are excellent."
      },
      {
        id: 8,
        name: "Everly Wright",
        date: "2026-04-15T20:14:34.386Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 9,
        name: "Aaron Evans",
        date: "2026-04-12T14:36:58.035Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 10,
        name: "Henry Turner",
        date: "2026-03-14T22:12:03.434Z",
        rating: 4,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 11,
        name: "Jack Gutierrez",
        date: "2026-02-27T09:01:20.782Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 12,
        name: "Charlotte Reed",
        date: "2026-02-02T08:44:05.382Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 13,
        name: "Skylar Reyes",
        date: "2026-01-05T00:04:47.200Z",
        rating: 5,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 14,
        name: "Bella Gonzalez",
        date: "2025-12-18T10:07:06.076Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 15,
        name: "Henry Ramos",
        date: "2025-12-15T00:16:55.358Z",
        rating: 5,
        comment: "The stitching and finish are excellent."
      },
      {
        id: 16,
        name: "Michael Young",
        date: "2025-08-17T15:35:17.607Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 17,
        name: "Mateo Roberts",
        date: "2025-07-26T14:58:03.330Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 18,
        name: "Owen Howard",
        date: "2025-07-14T05:15:30.411Z",
        rating: 3,
        comment: "It's alright. Not the best, not the worst."
      },
      {
        id: 19,
        name: "Genesis Johnson",
        date: "2025-06-14T09:16:28.112Z",
        rating: 5,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 20,
        name: "Penelope Jones",
        date: "2025-03-26T14:58:21.100Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 21,
        name: "Noah Johnson",
        date: "2025-02-04T09:17:04.088Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 22,
        name: "Sophia Williams",
        date: "2024-12-13T10:53:26.029Z",
        rating: 4,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 23,
        name: "Olivia Howard",
        date: "2024-11-28T11:06:42.502Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 24,
        name: "Sebastian Green",
        date: "2024-11-10T12:24:02.677Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 25,
        name: "Brooklyn Murphy",
        date: "2024-10-08T23:55:36.417Z",
        rating: 4,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 26,
        name: "Noah Ramirez",
        date: "2024-07-13T17:17:34.487Z",
        rating: 3,
        comment: "It's alright. Not the best, not the worst."
      },
      {
        id: 27,
        name: "Jayden Kelly",
        date: "2024-06-12T18:51:07.591Z",
        rating: 4,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 28,
        name: "Isabella Allen",
        date: "2024-05-05T19:25:15.732Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 29,
        name: "Samuel Young",
        date: "2024-03-26T03:31:32.419Z",
        rating: 4,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 30,
        name: "Violet Miller",
        date: "2024-03-14T21:11:16.620Z",
        rating: 4,
        comment: "Super soft and comfortable right out of the box."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Natural",
            hex: [
              "#E8D9B5"
            ]
          },
          {
            name: "Beige",
            hex: [
              "#E1D5BC"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "HAT-0028-NAT",
        color: "Natural",
        stock: 7
      },
      {
        sku: "HAT-0028-BEI",
        color: "Beige",
        stock: 6
      },
      {
        sku: "HAT-0028-WHI",
        color: "White",
        stock: 4
      },
      {
        sku: "HAT-0028-BLA",
        color: "Black",
        stock: 3
      }
    ]
  },
  {
    id: 29,
    title: "Bucket Hat",
    image: [
      "https://pngimg.com/uploads/hat/hat_PNG5700.png",
      "https://pngimg.com/uploads/hat/hat_PNG5700.png",
      "https://pngimg.com/uploads/hat/hat_PNG5700.png",
      "https://pngimg.com/uploads/hat/hat_PNG5700.png",
      "https://pngimg.com/uploads/hat/hat_PNG5700.png"
    ],
    category: "hat",
    price: 32,
    review: 1923,
    rating: 4.3,
    createdAt: "2024-04-03T13:35:00.000Z",
    isFeatured: false,
    description: "Top off your look with our Bucket Hat. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [
      "Comfortable Fit",
      "Premium Materials",
      "UV Protection",
      "Adjustable Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Jack Murphy",
        date: "2026-10-19T14:02:07.927Z",
        rating: 4,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 2,
        name: "Paisley Rogers",
        date: "2026-09-28T05:20:32.728Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 3,
        name: "Kennedy Robinson",
        date: "2026-07-26T10:02:02.187Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 4,
        name: "Grace Nelson",
        date: "2026-05-07T11:02:29.553Z",
        rating: 2,
        comment: "Quality is not what I expected for the price."
      },
      {
        id: 5,
        name: "Chloe Anderson",
        date: "2026-04-21T12:25:15.344Z",
        rating: 4,
        comment: "Worth every penny. Quality is top-notch."
      },
      {
        id: 6,
        name: "Emilia Clark",
        date: "2026-04-08T19:38:36.860Z",
        rating: 5,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 7,
        name: "Emily Turner",
        date: "2026-03-11T21:33:30.815Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 8,
        name: "James King",
        date: "2026-03-08T01:32:36.071Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 9,
        name: "Henry Robinson",
        date: "2026-02-07T03:56:48.719Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 10,
        name: "Isabella Bennett",
        date: "2026-01-03T01:07:29.126Z",
        rating: 4,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 11,
        name: "Noah Wilson",
        date: "2026-01-01T04:01:31.370Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 12,
        name: "Grace Alvarez",
        date: "2025-11-30T01:38:03.509Z",
        rating: 4,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 13,
        name: "Mia Myers",
        date: "2025-11-23T18:51:27.294Z",
        rating: 4,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 14,
        name: "Amelia Jackson",
        date: "2025-11-21T17:09:55.579Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 15,
        name: "Aria Edwards",
        date: "2025-09-12T00:41:55.352Z",
        rating: 4,
        comment: "Worth every penny. Quality is top-notch."
      },
      {
        id: 16,
        name: "Ryan Hernandez",
        date: "2025-08-23T03:39:39.920Z",
        rating: 4,
        comment: "Matches the description perfectly."
      },
      {
        id: 17,
        name: "Dylan Taylor",
        date: "2025-06-14T13:27:55.649Z",
        rating: 5,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 18,
        name: "Ethan White",
        date: "2025-06-13T00:47:16.275Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 19,
        name: "Elizabeth Smith",
        date: "2025-04-23T09:09:39.784Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 20,
        name: "Sophia Phillips",
        date: "2025-02-17T21:33:45.079Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 21,
        name: "Victoria Reyes",
        date: "2025-02-08T17:59:55.279Z",
        rating: 4,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 22,
        name: "Ellie Wood",
        date: "2025-01-11T04:47:10.369Z",
        rating: 4,
        comment: "Worth every penny. Quality is top-notch."
      },
      {
        id: 23,
        name: "Aurora Turner",
        date: "2024-09-30T19:21:08.057Z",
        rating: 3,
        comment: "It's okay. Does the job but not amazing."
      },
      {
        id: 24,
        name: "Isaiah Cooper",
        date: "2024-09-20T10:12:36.699Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 25,
        name: "Elizabeth Davis",
        date: "2024-09-03T05:20:57.293Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 26,
        name: "Abigail Watson",
        date: "2024-07-08T18:27:20.537Z",
        rating: 4,
        comment: "Will be ordering more in different colors."
      },
      {
        id: 27,
        name: "Thomas Stewart",
        date: "2024-06-11T04:16:24.536Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 28,
        name: "Nora Harris",
        date: "2024-05-25T01:58:07.843Z",
        rating: 2,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 29,
        name: "Mia Morgan",
        date: "2024-04-18T06:04:44.119Z",
        rating: 4,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 30,
        name: "Lily Mitchell",
        date: "2024-04-14T08:31:01.291Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Khaki",
            hex: [
              "#C3B091"
            ]
          },
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          },
          {
            name: "Olive",
            hex: [
              "#6B7B3A"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "HAT-0029-BLA",
        color: "Black",
        stock: 11
      },
      {
        sku: "HAT-0029-KHA",
        color: "Khaki",
        stock: 10
      },
      {
        sku: "HAT-0029-NAV",
        color: "Navy",
        stock: 8
      },
      {
        sku: "HAT-0029-OLI",
        color: "Olive",
        stock: 7
      },
      {
        sku: "HAT-0029-WHI",
        color: "White",
        stock: 5
      }
    ]
  },
  {
    id: 30,
    title: "Newsboy Cap",
    image: [
      "https://pngimg.com/uploads/cap/cap_PNG5686.png",
      "https://pngimg.com/uploads/cap/cap_PNG5686.png",
      "https://pngimg.com/uploads/cap/cap_PNG5686.png"
    ],
    category: "hat",
    price: 35,
    review: 534,
    rating: 3.7,
    createdAt: "2024-06-08T15:20:00.000Z",
    isFeatured: false,
    description: "Top off your look with our Newsboy Cap. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [
      "Comfortable Fit",
      "Premium Materials",
      "UV Protection",
      "Adjustable Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Hazel Patel",
        date: "2026-09-16T03:50:01.035Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 2,
        name: "Savannah Allen",
        date: "2026-05-03T06:26:53.212Z",
        rating: 4,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 3,
        name: "Penelope Myers",
        date: "2025-12-30T01:04:55.191Z",
        rating: 3,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 4,
        name: "Logan Hall",
        date: "2025-12-13T08:58:28.674Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 5,
        name: "Camila Ross",
        date: "2025-11-23T23:35:54.707Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 6,
        name: "William Walker",
        date: "2025-09-01T11:17:13.211Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 7,
        name: "Jaxon Morgan",
        date: "2025-06-13T09:46:14.454Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 8,
        name: "Scarlett Allen",
        date: "2025-04-16T14:36:00.596Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 9,
        name: "Benjamin Davis",
        date: "2025-03-27T06:45:23.011Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 10,
        name: "William Brooks",
        date: "2024-11-22T06:40:28.604Z",
        rating: 2,
        comment: "The product feels cheap compared to the description."
      },
      {
        id: 11,
        name: "Jack Reyes",
        date: "2024-10-05T08:07:57.797Z",
        rating: 2,
        comment: "Expected much better based on the reviews."
      },
      {
        id: 12,
        name: "Eleanor Brooks",
        date: "2024-09-22T08:34:30.494Z",
        rating: 2,
        comment: "Not happy with the purchase. Returning it."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Gray",
            hex: [
              "#9E9E9E"
            ]
          },
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Brown",
            hex: [
              "#6D4C41"
            ]
          },
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "HAT-0030-GRA",
        color: "Gray",
        stock: 5
      },
      {
        sku: "HAT-0030-BLA",
        color: "Black",
        stock: 4
      },
      {
        sku: "HAT-0030-BRO",
        color: "Brown",
        stock: 4
      },
      {
        sku: "HAT-0030-NAV",
        color: "Navy",
        stock: 3
      }
    ]
  },
  {
    id: 31,
    title: "Sun Hat Wide Brim",
    image: [
      "https://pngimg.com/uploads/hat/hat_PNG5701.png",
      "https://pngimg.com/uploads/hat/hat_PNG5701.png",
      "https://pngimg.com/uploads/hat/hat_PNG5701.png"
    ],
    category: "hat",
    price: 42,
    review: 891,
    rating: 4.6,
    createdAt: "2024-08-25T10:55:00.000Z",
    isFeatured: false,
    description: "Top off your look with our Sun Hat Wide Brim. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [
      "Comfortable Fit",
      "Premium Materials",
      "UV Protection",
      "Adjustable Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Adrian Stewart",
        date: "2026-10-20T14:57:09.867Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 2,
        name: "Nathaniel Wilson",
        date: "2026-10-01T12:10:34.240Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 3,
        name: "John Cook",
        date: "2026-09-02T01:56:15.139Z",
        rating: 4,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 4,
        name: "Layla Gray",
        date: "2026-08-18T00:15:43.959Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 5,
        name: "Owen Morgan",
        date: "2026-07-04T03:37:18.473Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 6,
        name: "David Ward",
        date: "2026-04-12T07:00:38.730Z",
        rating: 4,
        comment: "Love the color options available."
      },
      {
        id: 7,
        name: "Ella Carter",
        date: "2026-02-07T07:16:11.431Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 8,
        name: "Benjamin White",
        date: "2025-11-28T18:58:25.208Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 9,
        name: "Stella Peterson",
        date: "2025-10-14T02:03:24.463Z",
        rating: 5,
        comment: "The stitching and finish are excellent."
      },
      {
        id: 10,
        name: "Thomas Thompson",
        date: "2025-10-12T01:43:03.763Z",
        rating: 5,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 11,
        name: "Emily Wilson",
        date: "2025-05-31T02:08:16.363Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 12,
        name: "Jackson Harris",
        date: "2025-04-14T14:00:38.464Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      },
      {
        id: 13,
        name: "Victoria Gutierrez",
        date: "2025-02-28T11:17:36.894Z",
        rating: 5,
        comment: "Fantastic product. My new favorite!"
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Natural",
            hex: [
              "#E8D9B5"
            ]
          },
          {
            name: "Beige",
            hex: [
              "#E1D5BC"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "HAT-0031-NAT",
        color: "Natural",
        stock: 8
      },
      {
        sku: "HAT-0031-BEI",
        color: "Beige",
        stock: 7
      },
      {
        sku: "HAT-0031-WHI",
        color: "White",
        stock: 5
      },
      {
        sku: "HAT-0031-BLA",
        color: "Black",
        stock: 4
      }
    ]
  },
  {
    id: 32,
    title: "Trucker Cap",
    image: [
      "https://pngimg.com/uploads/cap/cap_PNG5687.png",
      "https://pngimg.com/uploads/cap/cap_PNG5687.png",
      "https://pngimg.com/uploads/cap/cap_PNG5687.png",
      "https://pngimg.com/uploads/cap/cap_PNG5687.png",
      "https://pngimg.com/uploads/cap/cap_PNG5687.png",
      "https://pngimg.com/uploads/cap/cap_PNG5687.png"
    ],
    category: "hat",
    price: 28,
    review: 1234,
    rating: 4.2,
    createdAt: "2025-01-12T12:10:00.000Z",
    isFeatured: false,
    description: "Top off your look with our Trucker Cap. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [
      "Comfortable Fit",
      "Premium Materials",
      "UV Protection",
      "Adjustable Design"
    ],
    reviews: [
      {
        id: 1,
        name: "Audrey Edwards",
        date: "2026-10-24T20:03:48.038Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 2,
        name: "Layla Cruz",
        date: "2026-09-25T01:47:04.140Z",
        rating: 5,
        comment: "Worth every penny. Quality is top-notch."
      },
      {
        id: 3,
        name: "Ethan Green",
        date: "2026-08-23T05:06:32.478Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 4,
        name: "Liam White",
        date: "2026-08-16T23:35:37.817Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 5,
        name: "Thomas Rivera",
        date: "2026-07-30T21:00:00.775Z",
        rating: 4,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 6,
        name: "Abigail Hall",
        date: "2026-06-28T15:51:09.673Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 7,
        name: "Lucas Stewart",
        date: "2026-06-11T20:52:15.415Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 8,
        name: "Jeremiah Howard",
        date: "2026-05-09T01:26:23.299Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 9,
        name: "Aria Ward",
        date: "2026-04-04T18:09:57.019Z",
        rating: 4,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 10,
        name: "Nathaniel Jones",
        date: "2026-03-10T07:27:38.953Z",
        rating: 4,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 11,
        name: "Aaron Parker",
        date: "2026-02-06T08:43:14.279Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 12,
        name: "Aaron Hall",
        date: "2026-01-23T06:25:14.963Z",
        rating: 5,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 13,
        name: "Liam Martinez",
        date: "2026-01-20T12:11:51.661Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 14,
        name: "Christopher Martinez",
        date: "2025-12-28T13:54:31.883Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 15,
        name: "Isaiah Harris",
        date: "2025-10-29T03:00:36.096Z",
        rating: 5,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 16,
        name: "Aaron Mitchell",
        date: "2025-08-15T04:37:15.488Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 17,
        name: "Olivia Clark",
        date: "2025-07-24T15:39:25.942Z",
        rating: 4,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 18,
        name: "Layla Young",
        date: "2025-05-18T14:43:11.707Z",
        rating: 3,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 19,
        name: "Aria Ross",
        date: "2025-03-22T17:06:28.672Z",
        rating: 5,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 20,
        name: "Joshua Nguyen",
        date: "2025-03-02T21:03:08.676Z",
        rating: 4,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 21,
        name: "Connor Wilson",
        date: "2025-03-01T00:22:07.100Z",
        rating: 4,
        comment: "Love the color options available."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          },
          {
            name: "Red",
            hex: [
              "#D32F2F"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Camo",
            hex: [
              "#78866B"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "HAT-0032-BLA",
        color: "Black",
        stock: 9
      },
      {
        sku: "HAT-0032-NAV",
        color: "Navy",
        stock: 8
      },
      {
        sku: "HAT-0032-RED",
        color: "Red",
        stock: 7
      },
      {
        sku: "HAT-0032-WHI",
        color: "White",
        stock: 6
      },
      {
        sku: "HAT-0032-CAM",
        color: "Camo",
        stock: 5
      }
    ]
  },
  {
    id: 33,
    title: "Fresh Citrus Cologne",
    image: [
      "https://pngimg.com/uploads/perfume/perfume_PNG99997.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99997.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99997.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99997.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99997.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99997.png"
    ],
    category: "perfume",
    price: 65,
    review: 2341,
    rating: 2.7,
    createdAt: "2022-12-05T14:00:00.000Z",
    isFeatured: false,
    description: "Experience the captivating scent of our Fresh Citrus Cologne. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [
      "Long-Lasting Fragrance",
      "Elegant Bottle",
      "Unique Scent Profile",
      "Perfect for Any Occasion"
    ],
    reviews: [
      {
        id: 1,
        name: "Alexander Anderson",
        date: "2024-09-27T13:49:56.884Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      },
      {
        id: 2,
        name: "Daniel Johnson",
        date: "2024-09-10T09:41:17.389Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 3,
        name: "Alexander Green",
        date: "2024-04-28T18:04:14.166Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 4,
        name: "Henry Martin",
        date: "2024-03-29T19:47:32.043Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      }
    ],
    options: [
      {
        name: "size",
        values: [
          "30ml",
          "50ml",
          "100ml"
        ]
      }
    ],
    variants: [
      {
        sku: "PRF-0033-30ML",
        size: "30ml",
        stock: 14
      },
      {
        sku: "PRF-0033-50ML",
        size: "50ml",
        stock: 20
      },
      {
        sku: "PRF-0033-100ML",
        size: "100ml",
        stock: 11
      }
    ]
  },
  {
    id: 34,
    title: "Woody Oriental Perfume",
    image: [
      "https://pngimg.com/uploads/perfume/perfume_PNG99996.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99996.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99996.png"
    ],
    category: "perfume",
    price: 95,
    review: 1876,
    rating: 4.9,
    createdAt: "2023-03-11T09:30:00.000Z",
    isFeatured: true,
    description: "Experience the captivating scent of our Woody Oriental Perfume. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [
      "Long-Lasting Fragrance",
      "Elegant Bottle",
      "Unique Scent Profile",
      "Perfect for Any Occasion"
    ],
    reviews: [
      {
        id: 1,
        name: "Olivia Baker",
        date: "2026-09-09T18:37:19.760Z",
        rating: 4,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 2,
        name: "Caleb Thompson",
        date: "2026-08-14T03:51:58.651Z",
        rating: 5,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 3,
        name: "William Baker",
        date: "2026-07-23T18:51:37.061Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 4,
        name: "Olivia Martinez",
        date: "2026-06-30T13:25:50.930Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 5,
        name: "Paisley Stewart",
        date: "2026-06-05T04:27:31.546Z",
        rating: 5,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 6,
        name: "Mia Hall",
        date: "2026-04-03T21:11:19.729Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 7,
        name: "Aaron Nguyen",
        date: "2026-02-03T09:46:16.103Z",
        rating: 5,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 8,
        name: "Matthew Ramos",
        date: "2025-09-29T22:45:49.681Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 9,
        name: "Amelia Wright",
        date: "2025-08-24T01:40:32.660Z",
        rating: 5,
        comment: "Love the color options available."
      },
      {
        id: 10,
        name: "Henry Brown",
        date: "2025-08-24T00:42:30.225Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 11,
        name: "Andrew Alvarez",
        date: "2025-08-10T02:56:51.245Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 12,
        name: "Daniel Green",
        date: "2025-06-10T08:50:02.053Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 13,
        name: "Everly Nguyen",
        date: "2025-02-11T09:55:50.783Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 14,
        name: "Hunter Gutierrez",
        date: "2025-01-04T21:30:41.921Z",
        rating: 4,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 15,
        name: "Lucas Wright",
        date: "2024-12-18T17:28:28.912Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 16,
        name: "Eleanor Sanders",
        date: "2024-12-07T16:18:09.276Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 17,
        name: "Kennedy Lee",
        date: "2024-11-14T12:24:09.055Z",
        rating: 4,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 18,
        name: "Claire Peterson",
        date: "2024-03-09T12:14:44.323Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 19,
        name: "Isabella Nelson",
        date: "2023-11-22T05:30:11.164Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 20,
        name: "Nora Rodriguez",
        date: "2023-11-21T13:30:55.564Z",
        rating: 4,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 21,
        name: "Alexander Davis",
        date: "2023-09-14T00:56:44.042Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 22,
        name: "Chloe Ross",
        date: "2023-09-08T06:27:21.047Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 23,
        name: "Savannah Ortiz",
        date: "2023-07-30T10:47:44.891Z",
        rating: 5,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 24,
        name: "Harper Anderson",
        date: "2023-04-20T01:53:46.123Z",
        rating: 4,
        comment: "Worth every penny. Quality is top-notch."
      }
    ],
    options: [
      {
        name: "size",
        values: [
          "30ml",
          "50ml",
          "100ml"
        ]
      }
    ],
    variants: [
      {
        sku: "PRF-0034-30ML",
        size: "30ml",
        stock: 7
      },
      {
        sku: "PRF-0034-50ML",
        size: "50ml",
        stock: 9
      },
      {
        sku: "PRF-0034-100ML",
        size: "100ml",
        stock: 6
      }
    ]
  },
  {
    id: 35,
    title: "Floral Eau de Parfum",
    image: [
      "https://pngimg.com/uploads/perfume/perfume_PNG99995.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99995.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99995.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99995.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99995.png"
    ],
    category: "perfume",
    price: 85,
    review: 1456,
    rating: 4.5,
    createdAt: "2023-06-27T16:15:00.000Z",
    isFeatured: false,
    description: "Experience the captivating scent of our Floral Eau de Parfum. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [
      "Long-Lasting Fragrance",
      "Elegant Bottle",
      "Unique Scent Profile",
      "Perfect for Any Occasion"
    ],
    reviews: [
      {
        id: 1,
        name: "Charlotte Wright",
        date: "2026-10-18T18:14:08.101Z",
        rating: 5,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 2,
        name: "William Martin",
        date: "2026-09-02T13:32:01.427Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 3,
        name: "Nolan Jimenez",
        date: "2026-08-26T08:22:59.226Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 4,
        name: "Jackson Anderson",
        date: "2026-08-06T05:32:31.465Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 5,
        name: "Liam Thompson",
        date: "2026-07-20T02:21:03.411Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 6,
        name: "Lily Roberts",
        date: "2026-04-27T12:36:36.440Z",
        rating: 4,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 7,
        name: "Bella Stewart",
        date: "2026-03-22T16:03:35.418Z",
        rating: 5,
        comment: "Worth every penny. Quality is top-notch."
      },
      {
        id: 8,
        name: "Samuel Smith",
        date: "2025-12-29T02:25:39.776Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 9,
        name: "Jayden Jones",
        date: "2025-12-28T18:39:11.433Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 10,
        name: "Mia Morris",
        date: "2025-06-15T18:31:26.944Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 11,
        name: "Scarlett Johnson",
        date: "2025-03-23T05:22:22.381Z",
        rating: 4,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 12,
        name: "Harper Martin",
        date: "2025-02-25T19:35:08.335Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 13,
        name: "Hannah Ruiz",
        date: "2024-12-18T16:36:57.809Z",
        rating: 5,
        comment: "Solid quality and good value for money."
      },
      {
        id: 14,
        name: "Lucy Hernandez",
        date: "2024-09-21T18:37:25.083Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 15,
        name: "Michael Young",
        date: "2024-08-28T07:36:00.585Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 16,
        name: "Penelope Johnson",
        date: "2024-08-16T16:30:22.179Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 17,
        name: "Levi Torres",
        date: "2024-06-19T00:39:14.034Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      }
    ],
    options: [
      {
        name: "size",
        values: [
          "30ml",
          "50ml",
          "100ml"
        ]
      }
    ],
    variants: [
      {
        sku: "PRF-0035-30ML",
        size: "30ml",
        stock: 9
      },
      {
        sku: "PRF-0035-50ML",
        size: "50ml",
        stock: 13
      },
      {
        sku: "PRF-0035-100ML",
        size: "100ml",
        stock: 8
      }
    ]
  },
  {
    id: 36,
    title: "Aquatic Fresh Scent",
    image: [
      "https://pngimg.com/uploads/perfume/perfume_PNG99993.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99993.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99993.png"
    ],
    category: "perfume",
    price: 72,
    review: 1123,
    rating: 4.4,
    createdAt: "2023-10-08T11:45:00.000Z",
    isFeatured: false,
    description: "Experience the captivating scent of our Aquatic Fresh Scent. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [
      "Long-Lasting Fragrance",
      "Elegant Bottle",
      "Unique Scent Profile",
      "Perfect for Any Occasion"
    ],
    reviews: [
      {
        id: 1,
        name: "Maya Hill",
        date: "2026-10-02T02:00:02.078Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 2,
        name: "Jaxon Thomas",
        date: "2026-08-01T13:04:38.723Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 3,
        name: "Hunter Evans",
        date: "2026-07-30T10:30:12.626Z",
        rating: 5,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 4,
        name: "Evelyn Brown",
        date: "2026-06-29T05:32:11.857Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 5,
        name: "Aurora Robinson",
        date: "2026-05-21T21:37:00.958Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 6,
        name: "Chloe Garcia",
        date: "2026-05-06T08:08:21.282Z",
        rating: 3,
        comment: "Functional but the design could be improved."
      },
      {
        id: 7,
        name: "Samuel White",
        date: "2026-04-20T15:52:02.118Z",
        rating: 4,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 8,
        name: "Mateo White",
        date: "2025-11-15T14:55:04.684Z",
        rating: 5,
        comment: "Love the color options available."
      },
      {
        id: 9,
        name: "Ava Harris",
        date: "2025-10-29T05:11:17.100Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 10,
        name: "Henry Jackson",
        date: "2025-08-12T15:52:03.296Z",
        rating: 4,
        comment: "Love the color options available."
      },
      {
        id: 11,
        name: "Emma Martinez",
        date: "2025-06-07T16:15:27.547Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 12,
        name: "Jacob Walker",
        date: "2025-05-10T20:11:05.145Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 13,
        name: "Genesis Reed",
        date: "2025-04-05T06:55:28.025Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 14,
        name: "Lincoln Smith",
        date: "2025-03-31T05:50:12.099Z",
        rating: 4,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 15,
        name: "Andrew Sanchez",
        date: "2025-02-06T20:55:22.416Z",
        rating: 5,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 16,
        name: "Lucas Perez",
        date: "2024-12-15T01:35:21.980Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 17,
        name: "Lily Jimenez",
        date: "2024-11-14T21:44:57.072Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 18,
        name: "Harper Ruiz",
        date: "2024-11-09T22:00:23.427Z",
        rating: 4,
        comment: "Matches the description perfectly."
      },
      {
        id: 19,
        name: "Carter Wilson",
        date: "2024-09-26T20:30:06.445Z",
        rating: 5,
        comment: "Matches the description perfectly."
      },
      {
        id: 20,
        name: "Paisley Ramos",
        date: "2024-08-29T15:17:47.602Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 21,
        name: "Henry Nelson",
        date: "2024-06-21T07:33:31.523Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 22,
        name: "Bella Evans",
        date: "2024-06-19T21:09:08.780Z",
        rating: 4,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 23,
        name: "Jeremiah Allen",
        date: "2024-05-28T18:42:51.955Z",
        rating: 4,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 24,
        name: "John Brooks",
        date: "2024-05-13T13:14:10.537Z",
        rating: 4,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 25,
        name: "Hazel Adams",
        date: "2023-12-18T23:16:45.285Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 26,
        name: "Mia Jackson",
        date: "2023-10-26T17:15:12.630Z",
        rating: 2,
        comment: "Quality is not what I expected for the price."
      }
    ],
    options: [
      {
        name: "size",
        values: [
          "30ml",
          "50ml",
          "100ml"
        ]
      }
    ],
    variants: [
      {
        sku: "PRF-0036-30ML",
        size: "30ml",
        stock: 11
      },
      {
        sku: "PRF-0036-50ML",
        size: "50ml",
        stock: 17
      },
      {
        sku: "PRF-0036-100ML",
        size: "100ml",
        stock: 9
      }
    ]
  },
  {
    id: 37,
    title: "Vanilla Sweet Perfume",
    image: [
      "https://pngimg.com/uploads/perfume/perfume_PNG99991.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99991.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99991.png"
    ],
    category: "perfume",
    price: 68,
    review: 987,
    rating: 2.6,
    createdAt: "2024-01-30T08:20:00.000Z",
    isFeatured: false,
    description: "Experience the captivating scent of our Vanilla Sweet Perfume. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [
      "Long-Lasting Fragrance",
      "Elegant Bottle",
      "Unique Scent Profile",
      "Perfect for Any Occasion"
    ],
    reviews: [
      {
        id: 1,
        name: "Lily Richardson",
        date: "2026-10-10T01:16:53.023Z",
        rating: 2,
        comment: "Not happy with the purchase. Returning it."
      },
      {
        id: 2,
        name: "Sofia Howard",
        date: "2026-09-30T11:30:00.965Z",
        rating: 2,
        comment: "Poor quality. Would not recommend."
      },
      {
        id: 3,
        name: "Jacob Robinson",
        date: "2026-09-26T23:26:25.985Z",
        rating: 2,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 4,
        name: "Grace Hughes",
        date: "2026-09-10T21:02:37.367Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 5,
        name: "Zoey Jimenez",
        date: "2026-07-09T18:55:44.163Z",
        rating: 2,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 6,
        name: "Mateo Patel",
        date: "2026-05-25T23:36:21.683Z",
        rating: 4,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 7,
        name: "Christian Morgan",
        date: "2026-05-04T01:56:44.985Z",
        rating: 2,
        comment: "Sizing is off and the material is thinner than expected."
      },
      {
        id: 8,
        name: "Mateo Moore",
        date: "2026-04-02T10:40:42.613Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 9,
        name: "Michael Jones",
        date: "2026-03-24T21:03:50.652Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 10,
        name: "Isaiah Rodriguez",
        date: "2026-03-24T20:53:00.590Z",
        rating: 3,
        comment: "The product is fine, nothing special though."
      },
      {
        id: 11,
        name: "Everly Gomez",
        date: "2026-01-15T13:25:26.472Z",
        rating: 1,
        comment: "Not happy with the purchase. Returning it."
      },
      {
        id: 12,
        name: "Eli Morgan",
        date: "2025-11-18T04:58:02.029Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 13,
        name: "Jeremiah Wilson",
        date: "2025-09-27T16:05:47.272Z",
        rating: 1,
        comment: "Arrived with a small defect. Disappointed."
      },
      {
        id: 14,
        name: "Thomas Ward",
        date: "2025-09-25T00:40:43.682Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 15,
        name: "Bella Chavez",
        date: "2025-07-15T17:31:19.138Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 16,
        name: "Layla Adams",
        date: "2025-07-05T13:21:43.132Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 17,
        name: "Amelia Young",
        date: "2025-07-01T15:57:06.975Z",
        rating: 2,
        comment: "Poor quality. Would not recommend."
      },
      {
        id: 18,
        name: "Nolan Cook",
        date: "2025-05-04T10:07:58.719Z",
        rating: 2,
        comment: "The product feels cheap compared to the description."
      },
      {
        id: 19,
        name: "Olivia Ruiz",
        date: "2025-04-10T00:51:39.657Z",
        rating: 1,
        comment: "Quality is not what I expected for the price."
      },
      {
        id: 20,
        name: "Andrew Hernandez",
        date: "2025-03-27T04:23:45.760Z",
        rating: 4,
        comment: "The stitching and finish are excellent."
      },
      {
        id: 21,
        name: "Lucas Bailey",
        date: "2025-03-26T02:13:40.231Z",
        rating: 1,
        comment: "The product feels cheap compared to the description."
      },
      {
        id: 22,
        name: "Alexander Sanchez",
        date: "2025-01-18T00:00:13.483Z",
        rating: 1,
        comment: "Fell apart after a few uses. Avoid."
      },
      {
        id: 23,
        name: "Violet Evans",
        date: "2025-01-10T03:05:55.549Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 24,
        name: "William Martin",
        date: "2024-12-11T05:24:27.599Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 25,
        name: "Liam Wilson",
        date: "2024-09-16T16:07:01.369Z",
        rating: 1,
        comment: "Color was different from the photos."
      },
      {
        id: 26,
        name: "Adrian Rivera",
        date: "2024-08-13T04:29:03.242Z",
        rating: 1,
        comment: "Expected much better based on the reviews."
      },
      {
        id: 27,
        name: "Jaxon Turner",
        date: "2024-08-07T00:07:45.267Z",
        rating: 2,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 28,
        name: "Abigail Hall",
        date: "2024-06-16T02:20:23.546Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 29,
        name: "Levi Alvarez",
        date: "2024-05-23T15:39:16.413Z",
        rating: 4,
        comment: "Fantastic product. My new favorite!"
      },
      {
        id: 30,
        name: "Savannah Wood",
        date: "2024-02-20T21:12:39.103Z",
        rating: 1,
        comment: "Fell apart after a few uses. Avoid."
      }
    ],
    options: [
      {
        name: "size",
        values: [
          "30ml",
          "50ml",
          "100ml"
        ]
      }
    ],
    variants: [
      {
        sku: "PRF-0037-30ML",
        size: "30ml",
        stock: 6
      },
      {
        sku: "PRF-0037-50ML",
        size: "50ml",
        stock: 8
      },
      {
        sku: "PRF-0037-100ML",
        size: "100ml",
        stock: 5
      }
    ]
  },
  {
    id: 38,
    title: "Spicy Oriental",
    image: [
      "https://pngimg.com/uploads/perfume/perfume_PNG99989.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99989.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99989.png"
    ],
    category: "perfume",
    price: 110,
    review: 756,
    rating: 4.8,
    createdAt: "2024-05-06T13:50:00.000Z",
    isFeatured: true,
    description: "Experience the captivating scent of our Spicy Oriental. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [
      "Long-Lasting Fragrance",
      "Elegant Bottle",
      "Unique Scent Profile",
      "Perfect for Any Occasion"
    ],
    reviews: [
      {
        id: 1,
        name: "Charlotte Thomas",
        date: "2026-10-31T04:15:22.941Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 2,
        name: "Ryan Edwards",
        date: "2026-10-01T12:06:36.550Z",
        rating: 5,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 3,
        name: "Caleb Moore",
        date: "2026-08-03T22:52:39.027Z",
        rating: 5,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 4,
        name: "Violet Lopez",
        date: "2026-06-06T19:15:30.596Z",
        rating: 5,
        comment: "Worth every penny. Quality is top-notch."
      },
      {
        id: 5,
        name: "Hunter Bailey",
        date: "2026-04-16T10:18:06.842Z",
        rating: 5,
        comment: "Solid quality and good value for money."
      },
      {
        id: 6,
        name: "Everly Jackson",
        date: "2025-11-12T16:50:53.209Z",
        rating: 5,
        comment: "Solid quality and good value for money."
      },
      {
        id: 7,
        name: "Zoey Reed",
        date: "2025-11-12T07:35:55.778Z",
        rating: 5,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 8,
        name: "Jack Stewart",
        date: "2025-09-12T11:16:45.197Z",
        rating: 5,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 9,
        name: "Sophia Lewis",
        date: "2025-08-20T05:36:21.051Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 10,
        name: "Hunter Sanders",
        date: "2025-08-11T14:19:51.262Z",
        rating: 3,
        comment: "Acceptable quality. Would consider other options next time."
      },
      {
        id: 11,
        name: "John Murphy",
        date: "2025-08-04T07:54:46.250Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 12,
        name: "Aaron Hall",
        date: "2025-06-23T14:19:07.135Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 13,
        name: "Nathaniel Mendoza",
        date: "2025-06-01T06:57:38.643Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 14,
        name: "Benjamin Perez",
        date: "2025-05-04T19:58:53.750Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 15,
        name: "Michael Wright",
        date: "2025-04-12T10:05:35.084Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 16,
        name: "Isabella Garcia",
        date: "2025-02-08T23:52:49.745Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 17,
        name: "Victoria Parker",
        date: "2025-01-30T06:33:51.534Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 18,
        name: "Wyatt Adams",
        date: "2024-12-05T22:53:12.344Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 19,
        name: "Caroline Diaz",
        date: "2024-10-28T01:07:00.951Z",
        rating: 4,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 20,
        name: "Aaron Smith",
        date: "2024-08-23T12:19:21.398Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 21,
        name: "Paisley Carter",
        date: "2024-08-07T04:17:21.916Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 22,
        name: "Adrian Brown",
        date: "2024-08-04T08:45:32.488Z",
        rating: 4,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 23,
        name: "Aaron Roberts",
        date: "2024-05-15T11:01:21.425Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 24,
        name: "Kennedy Hernandez",
        date: "2024-05-13T05:31:27.834Z",
        rating: 5,
        comment: "Exactly what I was looking for. Great quality!"
      }
    ],
    options: [
      {
        name: "size",
        values: [
          "30ml",
          "50ml",
          "100ml"
        ]
      }
    ],
    variants: [
      {
        sku: "PRF-0038-30ML",
        size: "30ml",
        stock: 4
      },
      {
        sku: "PRF-0038-50ML",
        size: "50ml",
        stock: 6
      },
      {
        sku: "PRF-0038-100ML",
        size: "100ml",
        stock: 4
      }
    ]
  },
  {
    id: 39,
    title: "Green Herbal Cologne",
    image: [
      "https://pngimg.com/uploads/perfume/perfume_PNG99985.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99985.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99985.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99985.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99985.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99985.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG99985.png"
    ],
    category: "perfume",
    price: 59,
    review: 834,
    rating: 4.3,
    createdAt: "2024-07-19T15:05:00.000Z",
    isFeatured: false,
    description: "Experience the captivating scent of our Green Herbal Cologne. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [
      "Long-Lasting Fragrance",
      "Elegant Bottle",
      "Unique Scent Profile",
      "Perfect for Any Occasion"
    ],
    reviews: [
      {
        id: 1,
        name: "Abigail Harris",
        date: "2026-09-01T10:54:45.123Z",
        rating: 2,
        comment: "Arrived with a small defect. Disappointed."
      },
      {
        id: 2,
        name: "Stella Ortiz",
        date: "2026-04-21T14:34:46.899Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 3,
        name: "Robert White",
        date: "2026-03-13T14:30:22.664Z",
        rating: 4,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 4,
        name: "Grace Lewis",
        date: "2026-01-15T19:08:06.352Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 5,
        name: "James Scott",
        date: "2025-12-23T17:07:21.631Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 6,
        name: "Alexander Edwards",
        date: "2025-03-09T08:49:31.949Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 7,
        name: "Joseph Bennett",
        date: "2025-01-17T09:00:05.709Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 8,
        name: "Aaron Price",
        date: "2024-12-20T10:52:40.906Z",
        rating: 4,
        comment: "The stitching and finish are excellent."
      },
      {
        id: 9,
        name: "Victoria Hill",
        date: "2024-11-07T16:55:50.076Z",
        rating: 4,
        comment: "Love the color options available."
      },
      {
        id: 10,
        name: "Maya Martinez",
        date: "2024-08-19T20:03:03.806Z",
        rating: 5,
        comment: "Matches the description perfectly."
      },
      {
        id: 11,
        name: "Elizabeth Harris",
        date: "2024-08-17T10:46:45.810Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      }
    ],
    options: [
      {
        name: "size",
        values: [
          "30ml",
          "50ml",
          "100ml"
        ]
      }
    ],
    variants: [
      {
        sku: "PRF-0039-30ML",
        size: "30ml",
        stock: 8
      },
      {
        sku: "PRF-0039-50ML",
        size: "50ml",
        stock: 11
      },
      {
        sku: "PRF-0039-100ML",
        size: "100ml",
        stock: 7
      }
    ]
  },
  {
    id: 40,
    title: "Luxury Night Perfume",
    image: [
      "https://pngimg.com/uploads/perfume/perfume_PNG10245.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG10245.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG10245.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG10245.png",
      "https://pngimg.com/uploads/perfume/perfume_PNG10245.png"
    ],
    category: "perfume",
    price: 125,
    review: 2145,
    rating: 3.9,
    createdAt: "2024-10-02T10:40:00.000Z",
    isFeatured: false,
    description: "Experience the captivating scent of our Luxury Night Perfume. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [
      "Long-Lasting Fragrance",
      "Elegant Bottle",
      "Unique Scent Profile",
      "Perfect for Any Occasion"
    ],
    reviews: [
      {
        id: 1,
        name: "Isabella White",
        date: "2026-05-18T10:39:28.912Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 2,
        name: "Daniel Martin",
        date: "2026-04-30T07:30:12.350Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 3,
        name: "Amelia Scott",
        date: "2026-04-24T21:05:44.591Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 4,
        name: "Brooklyn Watson",
        date: "2025-12-06T01:56:26.145Z",
        rating: 2,
        comment: "Poor quality. Would not recommend."
      },
      {
        id: 5,
        name: "Carter Wood",
        date: "2025-11-27T19:54:45.365Z",
        rating: 1,
        comment: "Poor quality. Would not recommend."
      },
      {
        id: 6,
        name: "Evelyn Robinson",
        date: "2025-11-10T08:08:22.712Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 7,
        name: "Jacob Smith",
        date: "2025-05-25T17:46:28.575Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 8,
        name: "Ryan Howard",
        date: "2025-04-08T04:54:15.421Z",
        rating: 2,
        comment: "Quality is not what I expected for the price."
      },
      {
        id: 9,
        name: "Samuel Morales",
        date: "2025-02-20T20:36:04.459Z",
        rating: 2,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 10,
        name: "Robert Anderson",
        date: "2025-01-14T16:24:32.087Z",
        rating: 5,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 11,
        name: "Andrew Murphy",
        date: "2024-12-18T15:38:06.559Z",
        rating: 5,
        comment: "Solid quality and good value for money."
      },
      {
        id: 12,
        name: "Charlotte Hill",
        date: "2024-11-14T20:32:42.314Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      }
    ],
    options: [
      {
        name: "size",
        values: [
          "30ml",
          "50ml",
          "100ml"
        ]
      }
    ],
    variants: [
      {
        sku: "PRF-0040-30ML",
        size: "30ml",
        stock: 3
      },
      {
        sku: "PRF-0040-50ML",
        size: "50ml",
        stock: 5
      },
      {
        sku: "PRF-0040-100ML",
        size: "100ml",
        stock: 3
      }
    ]
  },
  {
    id: 41,
    title: "Stainless Steel Thermos 500ml",
    image: [
      "https://pngimg.com/uploads/thermos/thermos_PNG44.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG44.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG44.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG44.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG44.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG44.png"
    ],
    category: "thermos",
    price: 35,
    review: 3124,
    rating: 4.8,
    createdAt: "2022-10-18T12:25:00.000Z",
    isFeatured: true,
    description: "Keep your drinks at the perfect temperature with our Stainless Steel Thermos 500ml. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [
      "Superior Insulation",
      "Leak-Proof Design",
      "Durable Build",
      "Easy to Clean"
    ],
    reviews: [
      {
        id: 1,
        name: "Logan Thompson",
        date: "2026-08-28T00:51:46.279Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 2,
        name: "Liam Wilson",
        date: "2026-07-12T05:39:18.366Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 3,
        name: "Samuel Anderson",
        date: "2026-06-22T23:10:54.979Z",
        rating: 5,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 4,
        name: "Benjamin Thomas",
        date: "2025-11-05T07:41:04.576Z",
        rating: 5,
        comment: "The stitching and finish are excellent."
      },
      {
        id: 5,
        name: "Zoey King",
        date: "2025-10-31T09:26:34.938Z",
        rating: 5,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 6,
        name: "Genesis Wilson",
        date: "2025-10-03T14:30:46.776Z",
        rating: 5,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 7,
        name: "Chloe Kelly",
        date: "2025-07-10T10:10:15.249Z",
        rating: 5,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 8,
        name: "Jackson Martin",
        date: "2025-05-19T18:06:08.181Z",
        rating: 5,
        comment: "Solid quality and good value for money."
      },
      {
        id: 9,
        name: "Emily Peterson",
        date: "2025-04-07T12:30:20.578Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 10,
        name: "Charlotte Johnson",
        date: "2025-03-06T18:17:34.748Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 11,
        name: "Riley Stewart",
        date: "2024-12-22T01:11:45.826Z",
        rating: 4,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 12,
        name: "Savannah Martinez",
        date: "2024-08-24T10:06:07.191Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 13,
        name: "Ethan Johnson",
        date: "2024-05-20T02:08:21.295Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 14,
        name: "Emma Stewart",
        date: "2024-03-29T10:12:19.834Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 15,
        name: "Carter Williams",
        date: "2024-03-04T05:49:36.535Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 16,
        name: "Liam Taylor",
        date: "2024-02-07T00:48:46.858Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 17,
        name: "Emilia Cooper",
        date: "2023-09-17T11:42:40.626Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 18,
        name: "Logan King",
        date: "2023-09-11T20:03:33.997Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Silver",
            hex: [
              "#C0C0C0"
            ]
          },
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Blue",
            hex: [
              "#1E6FD9"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "THM-0041-SIL",
        color: "Silver",
        stock: 18
      },
      {
        sku: "THM-0041-BLA",
        color: "Black",
        stock: 16
      },
      {
        sku: "THM-0041-WHI",
        color: "White",
        stock: 14
      },
      {
        sku: "THM-0041-BLU",
        color: "Blue",
        stock: 10
      }
    ]
  },
  {
    id: 42,
    title: "Insulated Travel Mug",
    image: [
      "https://pngimg.com/uploads/thermos/thermos_PNG42.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG42.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG42.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG42.png"
    ],
    category: "thermos",
    price: 29,
    review: 1987,
    rating: 4.6,
    createdAt: "2023-02-22T14:10:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Insulated Travel Mug. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [
      "Superior Insulation",
      "Leak-Proof Design",
      "Durable Build",
      "Easy to Clean"
    ],
    reviews: [
      {
        id: 1,
        name: "Riley Kelly",
        date: "2026-07-19T13:55:21.603Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 2,
        name: "Julian Mendoza",
        date: "2026-06-27T09:23:28.413Z",
        rating: 5,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 3,
        name: "Evelyn Reyes",
        date: "2026-04-19T13:55:31.063Z",
        rating: 5,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 4,
        name: "Levi Wilson",
        date: "2026-03-27T06:38:06.768Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 5,
        name: "Isaiah Perez",
        date: "2026-03-19T18:12:19.347Z",
        rating: 5,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 6,
        name: "Mason Thompson",
        date: "2026-01-07T05:17:23.741Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 7,
        name: "Sophia King",
        date: "2025-11-25T08:07:55.920Z",
        rating: 4,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 8,
        name: "Hunter Edwards",
        date: "2025-07-27T20:01:03.961Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 9,
        name: "Thomas White",
        date: "2025-07-07T13:35:54.235Z",
        rating: 3,
        comment: "It's okay. Does the job but not amazing."
      },
      {
        id: 10,
        name: "Benjamin Wright",
        date: "2025-05-05T21:40:08.262Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 11,
        name: "Avery Clark",
        date: "2025-04-28T21:02:40.673Z",
        rating: 4,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 12,
        name: "Chloe Gray",
        date: "2025-04-09T04:52:28.013Z",
        rating: 5,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 13,
        name: "Joshua Brooks",
        date: "2025-03-21T00:42:07.245Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 14,
        name: "Ava Moore",
        date: "2025-01-10T13:39:13.943Z",
        rating: 5,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 15,
        name: "Adrian Perez",
        date: "2025-01-01T15:26:10.518Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 16,
        name: "Levi Ward",
        date: "2024-11-27T02:40:46.408Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 17,
        name: "Matthew Murphy",
        date: "2024-09-13T23:23:03.333Z",
        rating: 4,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 18,
        name: "Elizabeth Young",
        date: "2024-09-04T00:43:51.092Z",
        rating: 3,
        comment: "Acceptable quality. Would consider other options next time."
      },
      {
        id: 19,
        name: "Michael Brown",
        date: "2024-06-18T06:41:08.845Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 20,
        name: "Noah Adams",
        date: "2024-06-11T07:46:09.052Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 21,
        name: "Charlotte King",
        date: "2024-04-19T20:11:11.640Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 22,
        name: "Adrian Scott",
        date: "2024-04-18T21:29:38.861Z",
        rating: 4,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 23,
        name: "Jeremiah Reyes",
        date: "2024-03-11T03:45:14.110Z",
        rating: 4,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 24,
        name: "Hannah Morales",
        date: "2023-11-19T13:17:01.645Z",
        rating: 5,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 25,
        name: "Aria Ruiz",
        date: "2023-11-06T15:56:14.068Z",
        rating: 5,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 26,
        name: "Evelyn Hernandez",
        date: "2023-08-30T14:45:26.920Z",
        rating: 5,
        comment: "Matches the description perfectly."
      },
      {
        id: 27,
        name: "Olivia Davis",
        date: "2023-08-01T20:01:17.080Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 28,
        name: "Adrian Watson",
        date: "2023-06-16T23:40:22.856Z",
        rating: 5,
        comment: "Nice item, shipping was reasonable."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Red",
            hex: [
              "#D32F2F"
            ]
          },
          {
            name: "Navy",
            hex: [
              "#1F2A44"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "THM-0042-BLA",
        color: "Black",
        stock: 14
      },
      {
        sku: "THM-0042-WHI",
        color: "White",
        stock: 12
      },
      {
        sku: "THM-0042-RED",
        color: "Red",
        stock: 10
      },
      {
        sku: "THM-0042-NAV",
        color: "Navy",
        stock: 7
      }
    ]
  },
  {
    id: 43,
    title: "Vacuum Flask Classic",
    image: [
      "https://pngimg.com/uploads/thermos/thermos_PNG41.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG41.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG41.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG41.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG41.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG41.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG41.png"
    ],
    category: "thermos",
    price: 25,
    review: 1456,
    rating: 1.5,
    createdAt: "2023-05-09T09:00:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Vacuum Flask Classic. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [
      "Superior Insulation",
      "Leak-Proof Design",
      "Durable Build",
      "Easy to Clean"
    ],
    reviews: [
      {
        id: 1,
        name: "Avery Taylor",
        date: "2026-06-18T12:52:29.021Z",
        rating: 2,
        comment: "Arrived with a small defect. Disappointed."
      },
      {
        id: 2,
        name: "Anthony Howard",
        date: "2025-12-06T22:55:41.238Z",
        rating: 1,
        comment: "Fell apart after a few uses. Avoid."
      },
      {
        id: 3,
        name: "Liam Thomas",
        date: "2025-08-13T12:20:07.141Z",
        rating: 2,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 4,
        name: "Evelyn Hall",
        date: "2025-08-11T10:59:34.048Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 5,
        name: "Charlotte Robinson",
        date: "2024-07-27T17:01:11.187Z",
        rating: 2,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 6,
        name: "Mason Wilson",
        date: "2023-05-20T15:55:42.180Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Silver",
            hex: [
              "#C0C0C0"
            ]
          },
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Green",
            hex: [
              "#2E7D32"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "THM-0043-SIL",
        color: "Silver",
        stock: 11
      },
      {
        sku: "THM-0043-BLA",
        color: "Black",
        stock: 10
      },
      {
        sku: "THM-0043-GRE",
        color: "Green",
        stock: 6
      }
    ]
  },
  {
    id: 44,
    title: "Smart Temperature Thermos",
    image: [
      "https://pngimg.com/uploads/thermos/thermos_PNG40.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG40.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG40.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG40.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG40.png"
    ],
    category: "thermos",
    price: 55,
    review: 876,
    rating: 4.7,
    createdAt: "2023-08-14T16:30:00.000Z",
    isFeatured: true,
    description: "Keep your drinks at the perfect temperature with our Smart Temperature Thermos. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [
      "Superior Insulation",
      "Leak-Proof Design",
      "Durable Build",
      "Easy to Clean"
    ],
    reviews: [
      {
        id: 1,
        name: "Nova Thomas",
        date: "2026-10-23T23:48:11.742Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 2,
        name: "Aurora Mendoza",
        date: "2026-06-12T12:10:37.076Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 3,
        name: "Landon Jimenez",
        date: "2026-04-06T23:52:49.590Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 4,
        name: "Hannah Gonzalez",
        date: "2026-04-03T22:36:01.894Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 5,
        name: "Olivia Thompson",
        date: "2026-03-02T08:54:06.442Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 6,
        name: "Owen Campbell",
        date: "2026-02-11T07:57:51.076Z",
        rating: 5,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 7,
        name: "Stella Gonzalez",
        date: "2026-02-10T05:21:46.594Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 8,
        name: "Aaron Rivera",
        date: "2026-01-16T03:00:32.123Z",
        rating: 5,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 9,
        name: "Harper Cooper",
        date: "2026-01-03T06:52:52.660Z",
        rating: 5,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 10,
        name: "Paisley Reed",
        date: "2025-12-27T14:48:30.923Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 11,
        name: "Joseph Nguyen",
        date: "2025-11-11T20:15:34.447Z",
        rating: 3,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 12,
        name: "Ella Mitchell",
        date: "2025-10-20T15:53:58.736Z",
        rating: 4,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 13,
        name: "Eli Young",
        date: "2025-09-22T13:52:25.833Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 14,
        name: "Nora Stewart",
        date: "2025-09-11T01:23:11.253Z",
        rating: 4,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 15,
        name: "Christopher Reed",
        date: "2025-09-06T11:53:55.554Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 16,
        name: "Daniel Baker",
        date: "2025-09-03T00:06:53.318Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 17,
        name: "Emily Adams",
        date: "2025-08-02T21:10:42.122Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 18,
        name: "Cameron King",
        date: "2025-07-17T06:13:14.019Z",
        rating: 5,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 19,
        name: "Ryan Lewis",
        date: "2025-07-07T06:42:22.627Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 20,
        name: "Sofia Young",
        date: "2025-05-29T22:14:04.667Z",
        rating: 5,
        comment: "Fantastic product. My new favorite!"
      },
      {
        id: 21,
        name: "Abigail Taylor",
        date: "2024-12-30T13:45:43.080Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 22,
        name: "Nathan Rogers",
        date: "2024-12-03T18:59:44.994Z",
        rating: 5,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 23,
        name: "Dylan Phillips",
        date: "2024-10-10T12:14:09.351Z",
        rating: 5,
        comment: "Fantastic product. My new favorite!"
      },
      {
        id: 24,
        name: "Sophia Alvarez",
        date: "2024-09-27T04:35:51.276Z",
        rating: 3,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 25,
        name: "Jaxon Miller",
        date: "2024-07-01T09:27:45.479Z",
        rating: 5,
        comment: "Matches the description perfectly."
      },
      {
        id: 26,
        name: "Charlotte Flores",
        date: "2024-01-23T14:37:21.699Z",
        rating: 5,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 27,
        name: "Skylar Hughes",
        date: "2024-01-15T14:37:15.190Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 28,
        name: "William Jackson",
        date: "2023-11-21T16:25:42.053Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 29,
        name: "Jaxon Mitchell",
        date: "2023-08-22T15:44:57.172Z",
        rating: 5,
        comment: "Happy with the purchase. Would buy from them again."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Silver",
            hex: [
              "#C0C0C0"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "THM-0044-BLA",
        color: "Black",
        stock: 6
      },
      {
        sku: "THM-0044-SIL",
        color: "Silver",
        stock: 5
      },
      {
        sku: "THM-0044-WHI",
        color: "White",
        stock: 4
      }
    ]
  },
  {
    id: 45,
    title: "Matte Black Bottle",
    image: [
      "https://pngimg.com/uploads/thermos/thermos_PNG39.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG39.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG39.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG39.png"
    ],
    category: "thermos",
    price: 32,
    review: 1678,
    rating: 4.4,
    createdAt: "2023-11-03T11:20:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Matte Black Bottle. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [
      "Superior Insulation",
      "Leak-Proof Design",
      "Durable Build",
      "Easy to Clean"
    ],
    reviews: [
      {
        id: 1,
        name: "Olivia Lewis",
        date: "2026-10-09T13:40:41.100Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 2,
        name: "Lucy Green",
        date: "2026-06-20T14:45:09.023Z",
        rating: 4,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 3,
        name: "Caleb Wright",
        date: "2025-03-17T04:02:06.437Z",
        rating: 4,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 4,
        name: "Alexander Brown",
        date: "2024-12-01T01:24:56.853Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 5,
        name: "Isabella Brown",
        date: "2024-06-20T17:02:28.925Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 6,
        name: "Olivia Thompson",
        date: "2024-06-19T09:06:08.012Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 7,
        name: "Lincoln Lewis",
        date: "2024-02-20T00:45:34.273Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 8,
        name: "Lily Walker",
        date: "2023-12-31T15:51:24.651Z",
        rating: 3,
        comment: "Meets basic expectations. Could be better."
      },
      {
        id: 9,
        name: "Lillian Carter",
        date: "2023-12-23T16:00:30.973Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 10,
        name: "Michael Brown",
        date: "2023-11-12T08:59:13.719Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Matte Black",
            hex: [
              "#1C1C1C"
            ]
          },
          {
            name: "Matte Gray",
            hex: [
              "#6B6B6B"
            ]
          },
          {
            name: "Matte Blue",
            hex: [
              "#2F4F6F"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "THM-0045-MATBLA",
        color: "Matte Black",
        stock: 16
      },
      {
        sku: "THM-0045-MATGRA",
        color: "Matte Gray",
        stock: 13
      },
      {
        sku: "THM-0045-MATBLU",
        color: "Matte Blue",
        stock: 10
      }
    ]
  },
  {
    id: 46,
    title: "Kids Colorful Thermos",
    image: [
      "https://pngimg.com/uploads/thermos/thermos_PNG35.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG35.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG35.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG35.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG35.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG35.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG35.png"
    ],
    category: "thermos",
    price: 22,
    review: 2345,
    rating: 3.3,
    createdAt: "2024-02-26T08:45:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Kids Colorful Thermos. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [
      "Superior Insulation",
      "Leak-Proof Design",
      "Durable Build",
      "Easy to Clean"
    ],
    reviews: [
      {
        id: 1,
        name: "Sebastian Green",
        date: "2026-10-12T12:29:15.440Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 2,
        name: "Christopher Bailey",
        date: "2026-07-26T02:09:44.281Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 3,
        name: "Mason Jackson",
        date: "2026-06-02T10:22:46.616Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 4,
        name: "Jaxon Garcia",
        date: "2026-04-09T13:34:03.033Z",
        rating: 3,
        comment: "It's alright. Not the best, not the worst."
      },
      {
        id: 5,
        name: "Olivia Martinez",
        date: "2026-03-30T16:37:23.175Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 6,
        name: "Lillian Jimenez",
        date: "2026-02-24T23:20:19.920Z",
        rating: 3,
        comment: "The product is fine, nothing special though."
      },
      {
        id: 7,
        name: "Zoey Gomez",
        date: "2026-02-20T18:40:53.052Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 8,
        name: "Emma Kim",
        date: "2026-02-20T13:36:30.560Z",
        rating: 2,
        comment: "Sizing is off and the material is thinner than expected."
      },
      {
        id: 9,
        name: "Isaac Gray",
        date: "2026-01-03T19:34:11.379Z",
        rating: 2,
        comment: "Very disappointed. Not worth the money."
      },
      {
        id: 10,
        name: "Christian Hughes",
        date: "2025-10-06T18:10:37.438Z",
        rating: 4,
        comment: "Fits perfectly and looks even better in person."
      },
      {
        id: 11,
        name: "Matthew Mitchell",
        date: "2025-09-10T16:50:09.191Z",
        rating: 4,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 12,
        name: "Lucas Thompson",
        date: "2025-07-31T12:07:17.402Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      },
      {
        id: 13,
        name: "Nora Thomas",
        date: "2025-07-01T23:11:50.657Z",
        rating: 4,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 14,
        name: "Sofia Ross",
        date: "2025-05-12T16:55:17.762Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 15,
        name: "Sophia Parker",
        date: "2025-02-10T15:42:16.768Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 16,
        name: "Penelope Kelly",
        date: "2025-01-19T00:51:25.332Z",
        rating: 5,
        comment: "Matches the description perfectly."
      },
      {
        id: 17,
        name: "Jackson King",
        date: "2024-11-23T04:36:33.170Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 18,
        name: "Caleb Ramos",
        date: "2024-11-16T22:23:19.591Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 19,
        name: "Jackson Gomez",
        date: "2024-06-28T19:00:48.051Z",
        rating: 5,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 20,
        name: "Henry Myers",
        date: "2024-05-15T03:49:15.488Z",
        rating: 2,
        comment: "The product feels cheap compared to the description."
      },
      {
        id: 21,
        name: "Evelyn Garcia",
        date: "2024-03-17T11:11:47.325Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      },
      {
        id: 22,
        name: "Luke Collins",
        date: "2024-02-29T12:13:56.446Z",
        rating: 2,
        comment: "Arrived with a small defect. Disappointed."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Pink",
            hex: [
              "#F48FB1"
            ]
          },
          {
            name: "Blue",
            hex: [
              "#1E6FD9"
            ]
          },
          {
            name: "Yellow",
            hex: [
              "#FDD835"
            ]
          },
          {
            name: "Green",
            hex: [
              "#2E7D32"
            ]
          },
          {
            name: "Purple",
            hex: [
              "#8E24AA"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "THM-0046-PIN",
        color: "Pink",
        stock: 12
      },
      {
        sku: "THM-0046-BLU",
        color: "Blue",
        stock: 12
      },
      {
        sku: "THM-0046-YEL",
        color: "Yellow",
        stock: 10
      },
      {
        sku: "THM-0046-GRE",
        color: "Green",
        stock: 9
      },
      {
        sku: "THM-0046-PUR",
        color: "Purple",
        stock: 8
      }
    ]
  },
  {
    id: 47,
    title: "Double Wall Coffee Flask",
    image: [
      "https://pngimg.com/uploads/thermos/thermos_PNG31.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG31.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG31.png"
    ],
    category: "thermos",
    price: 42,
    review: 2891,
    rating: 4.9,
    createdAt: "2024-05-15T13:00:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Double Wall Coffee Flask. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [
      "Superior Insulation",
      "Leak-Proof Design",
      "Durable Build",
      "Easy to Clean"
    ],
    reviews: [
      {
        id: 1,
        name: "Harper Taylor",
        date: "2026-09-23T15:47:54.667Z",
        rating: 5,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 2,
        name: "Anthony Jones",
        date: "2026-09-09T16:55:37.098Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 3,
        name: "Lucy Ross",
        date: "2026-08-25T13:21:23.258Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 4,
        name: "Emma Jackson",
        date: "2026-07-15T01:27:35.075Z",
        rating: 4,
        comment: "Super soft and comfortable right out of the box."
      },
      {
        id: 5,
        name: "Lincoln Hall",
        date: "2026-07-14T21:52:05.348Z",
        rating: 5,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 6,
        name: "Layla Kelly",
        date: "2026-06-22T12:16:41.092Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 7,
        name: "Jaxon Cooper",
        date: "2026-06-02T18:19:37.707Z",
        rating: 5,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 8,
        name: "Noah Thomas",
        date: "2026-06-01T02:34:37.982Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 9,
        name: "Avery Anderson",
        date: "2026-05-06T13:50:48.883Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 10,
        name: "Andrew White",
        date: "2026-04-18T11:50:44.526Z",
        rating: 5,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 11,
        name: "Julian Kim",
        date: "2026-03-10T11:11:11.940Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      },
      {
        id: 12,
        name: "Isabella Smith",
        date: "2025-11-16T17:47:55.942Z",
        rating: 4,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 13,
        name: "Adrian King",
        date: "2025-11-03T01:24:53.382Z",
        rating: 5,
        comment: "Great everyday staple. Very happy."
      },
      {
        id: 14,
        name: "Dylan Mendoza",
        date: "2025-10-17T01:01:43.980Z",
        rating: 5,
        comment: "Solid quality and good value for money."
      },
      {
        id: 15,
        name: "Caleb Martin",
        date: "2025-10-15T16:25:37.968Z",
        rating: 5,
        comment: "Great value for the price. Highly satisfied."
      },
      {
        id: 16,
        name: "Emilia Peterson",
        date: "2025-10-14T23:15:15.352Z",
        rating: 5,
        comment: "Exactly what I was looking for. Great quality!"
      },
      {
        id: 17,
        name: "James Hill",
        date: "2025-09-02T03:06:18.539Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 18,
        name: "Scarlett Castillo",
        date: "2025-08-25T07:35:58.029Z",
        rating: 5,
        comment: "Will be ordering more in different colors."
      },
      {
        id: 19,
        name: "Matthew Gomez",
        date: "2025-06-16T00:45:32.147Z",
        rating: 4,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 20,
        name: "Benjamin Wood",
        date: "2025-04-11T19:32:48.800Z",
        rating: 5,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 21,
        name: "Caroline White",
        date: "2025-02-24T12:05:42.721Z",
        rating: 5,
        comment: "Surprisingly good quality for the price point."
      },
      {
        id: 22,
        name: "Robert Robinson",
        date: "2025-02-23T23:44:10.214Z",
        rating: 5,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 23,
        name: "Amelia Martin",
        date: "2025-02-05T11:13:18.924Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 24,
        name: "Benjamin Thompson",
        date: "2025-01-31T04:38:04.200Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 25,
        name: "Genesis Ruiz",
        date: "2025-01-28T03:52:01.725Z",
        rating: 4,
        comment: "Will be ordering more in different colors."
      },
      {
        id: 26,
        name: "William Peterson",
        date: "2025-01-05T20:18:59.453Z",
        rating: 4,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 27,
        name: "Owen Price",
        date: "2024-12-23T15:45:54.104Z",
        rating: 5,
        comment: "Worth every penny. Quality is top-notch."
      },
      {
        id: 28,
        name: "Adrian Hernandez",
        date: "2024-11-24T01:19:49.195Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 29,
        name: "Ethan Green",
        date: "2024-10-17T14:57:41.330Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Silver",
            hex: [
              "#C0C0C0"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Red",
            hex: [
              "#D32F2F"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "THM-0047-BLA",
        color: "Black",
        stock: 11
      },
      {
        sku: "THM-0047-SIL",
        color: "Silver",
        stock: 9
      },
      {
        sku: "THM-0047-WHI",
        color: "White",
        stock: 8
      },
      {
        sku: "THM-0047-RED",
        color: "Red",
        stock: 5
      }
    ]
  },
  {
    id: 48,
    title: "Sport Water Bottle",
    image: [
      "https://pngimg.com/uploads/thermos/thermos_PNG25.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG25.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG25.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG25.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG25.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG25.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG25.png"
    ],
    category: "thermos",
    price: 28,
    review: 1765,
    rating: 4.5,
    createdAt: "2024-07-28T15:40:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Sport Water Bottle. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [
      "Superior Insulation",
      "Leak-Proof Design",
      "Durable Build",
      "Easy to Clean"
    ],
    reviews: [
      {
        id: 1,
        name: "Cameron Gray",
        date: "2026-10-27T17:09:14.769Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 2,
        name: "Caleb Myers",
        date: "2026-10-17T17:45:24.976Z",
        rating: 4,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 3,
        name: "Henry Martin",
        date: "2026-08-24T05:09:33.543Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 4,
        name: "Jayden James",
        date: "2026-06-05T23:41:49.591Z",
        rating: 5,
        comment: "Packaging was nice and product arrived safely."
      },
      {
        id: 5,
        name: "Emilia Reed",
        date: "2026-03-14T22:18:49.880Z",
        rating: 5,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 6,
        name: "Eleanor Taylor",
        date: "2026-03-02T08:58:32.191Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 7,
        name: "Paisley Cook",
        date: "2026-01-26T20:11:21.527Z",
        rating: 5,
        comment: "The material feels premium and durable."
      },
      {
        id: 8,
        name: "Camila Cox",
        date: "2025-12-29T07:43:48.835Z",
        rating: 5,
        comment: "Will be ordering more in different colors."
      },
      {
        id: 9,
        name: "Olivia Anderson",
        date: "2025-11-18T05:17:37.880Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 10,
        name: "Sebastian White",
        date: "2025-11-08T02:33:01.296Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 11,
        name: "Avery Richardson",
        date: "2025-10-30T19:38:18.556Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 12,
        name: "Claire Lopez",
        date: "2025-08-25T21:12:40.708Z",
        rating: 5,
        comment: "The stitching and finish are excellent."
      },
      {
        id: 13,
        name: "James Smith",
        date: "2025-08-01T17:25:26.813Z",
        rating: 5,
        comment: "Love the color options available."
      },
      {
        id: 14,
        name: "Amelia Baker",
        date: "2025-07-27T18:42:27.159Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 15,
        name: "Grayson Reed",
        date: "2025-06-07T07:42:39.444Z",
        rating: 3,
        comment: "The product is fine, nothing special though."
      },
      {
        id: 16,
        name: "Charlotte Nelson",
        date: "2025-05-07T00:28:40.311Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 17,
        name: "Benjamin Smith",
        date: "2025-03-23T07:51:24.284Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 18,
        name: "Nora Jones",
        date: "2025-01-24T19:05:00.499Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 19,
        name: "Michael Ortiz",
        date: "2024-11-29T21:17:19.286Z",
        rating: 5,
        comment: "I've recommended this to all my friends."
      },
      {
        id: 20,
        name: "Michael Jackson",
        date: "2024-11-29T20:57:34.285Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 21,
        name: "Violet Davis",
        date: "2024-09-06T08:46:28.477Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "Blue",
            hex: [
              "#1E6FD9"
            ]
          },
          {
            name: "Red",
            hex: [
              "#D32F2F"
            ]
          },
          {
            name: "Green",
            hex: [
              "#2E7D32"
            ]
          },
          {
            name: "Orange",
            hex: [
              "#F57C00"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "THM-0048-BLA",
        color: "Black",
        stock: 12
      },
      {
        sku: "THM-0048-BLU",
        color: "Blue",
        stock: 11
      },
      {
        sku: "THM-0048-RED",
        color: "Red",
        stock: 9
      },
      {
        sku: "THM-0048-GRE",
        color: "Green",
        stock: 8
      },
      {
        sku: "THM-0048-ORA",
        color: "Orange",
        stock: 6
      }
    ]
  },
  {
    id: 49,
    title: "Premium Gold Trim Thermos",
    image: [
      "https://pngimg.com/uploads/thermos/thermos_PNG16.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG16.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG16.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG16.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG16.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG16.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG16.png"
    ],
    category: "thermos",
    price: 65,
    review: 654,
    rating: 2.8,
    createdAt: "2024-09-16T10:15:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Premium Gold Trim Thermos. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [
      "Superior Insulation",
      "Leak-Proof Design",
      "Durable Build",
      "Easy to Clean"
    ],
    reviews: [
      {
        id: 1,
        name: "James Walker",
        date: "2026-07-04T09:29:16.519Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 2,
        name: "Noah Clark",
        date: "2026-05-26T21:40:58.949Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 3,
        name: "Lincoln Alvarez",
        date: "2026-03-28T06:58:27.189Z",
        rating: 2,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 4,
        name: "Luke Gomez",
        date: "2025-11-30T18:49:41.167Z",
        rating: 1,
        comment: "Very disappointed. Not worth the money."
      },
      {
        id: 5,
        name: "Daniel Diaz",
        date: "2025-10-28T15:51:36.942Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 6,
        name: "Lily Sanchez",
        date: "2025-09-23T14:03:18.816Z",
        rating: 3,
        comment: "Works as expected, no major complaints."
      },
      {
        id: 7,
        name: "Zoey Johnson",
        date: "2025-04-19T22:52:57.099Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 8,
        name: "Avery Clark",
        date: "2024-12-05T19:39:41.306Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 9,
        name: "Audrey Watson",
        date: "2024-10-28T01:02:27.242Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 10,
        name: "Adrian Rogers",
        date: "2024-10-12T11:29:49.532Z",
        rating: 1,
        comment: "Not happy with the purchase. Returning it."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black/Gold",
            hex: [
              "#111111",
              "#D4AF37"
            ]
          },
          {
            name: "White/Gold",
            hex: [
              "#FFFFFF",
              "#D4AF37"
            ]
          },
          {
            name: "Navy/Gold",
            hex: [
              "#1F2A44",
              "#D4AF37"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "THM-0049-BLAGOL",
        color: "Black/Gold",
        stock: 3
      },
      {
        sku: "THM-0049-WHIGOL",
        color: "White/Gold",
        stock: 3
      },
      {
        sku: "THM-0049-NAVGOL",
        color: "Navy/Gold",
        stock: 2
      }
    ]
  },
  {
    id: 50,
    title: "Eco Bamboo Lid Flask",
    image: [
      "https://pngimg.com/uploads/thermos/thermos_PNG15.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG15.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG15.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG15.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG15.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG15.png",
      "https://pngimg.com/uploads/thermos/thermos_PNG15.png"
    ],
    category: "thermos",
    price: 38,
    review: 1234,
    rating: 4.6,
    createdAt: "2025-02-01T12:50:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Eco Bamboo Lid Flask. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [
      "Superior Insulation",
      "Leak-Proof Design",
      "Durable Build",
      "Easy to Clean"
    ],
    reviews: [
      {
        id: 1,
        name: "Ava Hall",
        date: "2026-10-26T03:39:24.470Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 2,
        name: "Ellie Mendoza",
        date: "2026-10-20T17:55:58.539Z",
        rating: 3,
        comment: "Functional but the design could be improved."
      },
      {
        id: 3,
        name: "Layla Turner",
        date: "2026-08-19T10:14:43.162Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 4,
        name: "Addison Castillo",
        date: "2026-06-10T13:55:12.648Z",
        rating: 5,
        comment: "Matches the description perfectly."
      },
      {
        id: 5,
        name: "Lily James",
        date: "2026-05-27T18:53:37.997Z",
        rating: 4,
        comment: "Stylish and practical at the same time."
      },
      {
        id: 6,
        name: "Bella Thompson",
        date: "2026-05-11T08:59:51.203Z",
        rating: 5,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 7,
        name: "Abigail Nelson",
        date: "2026-04-28T11:33:58.249Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 8,
        name: "Harper Martin",
        date: "2026-04-19T16:00:01.690Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 9,
        name: "Michael King",
        date: "2026-04-03T05:25:20.789Z",
        rating: 4,
        comment: "Very comfortable and well-made. Exceeded my expectations."
      },
      {
        id: 10,
        name: "Aaron Morris",
        date: "2026-02-22T04:51:24.344Z",
        rating: 5,
        comment: "Customer service was excellent when I had a question."
      },
      {
        id: 11,
        name: "Elizabeth Cox",
        date: "2025-12-18T10:21:36.199Z",
        rating: 5,
        comment: "Beautiful design and high-quality materials."
      },
      {
        id: 12,
        name: "Julian Reyes",
        date: "2025-11-23T13:26:37.623Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 13,
        name: "Thomas Gutierrez",
        date: "2025-11-03T17:13:03.924Z",
        rating: 5,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 14,
        name: "Henry Brown",
        date: "2025-09-24T14:00:28.431Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 15,
        name: "Mateo Wood",
        date: "2025-08-01T12:27:54.042Z",
        rating: 5,
        comment: "Will be ordering more in different colors."
      },
      {
        id: 16,
        name: "Jeremiah Richardson",
        date: "2025-05-31T04:26:53.120Z",
        rating: 4,
        comment: "Arrived quickly and in perfect condition."
      },
      {
        id: 17,
        name: "Gabriel Kim",
        date: "2025-02-25T07:23:08.904Z",
        rating: 5,
        comment: "Solid quality and good value for money."
      },
      {
        id: 18,
        name: "Adrian Hall",
        date: "2025-02-08T15:05:38.053Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Natural",
            hex: [
              "#E8D9B5"
            ]
          },
          {
            name: "Black",
            hex: [
              "#111111"
            ]
          },
          {
            name: "White",
            hex: [
              "#FFFFFF"
            ]
          },
          {
            name: "Green",
            hex: [
              "#2E7D32"
            ]
          }
        ]
      }
    ],
    variants: [
      {
        sku: "THM-0050-NAT",
        color: "Natural",
        stock: 9
      },
      {
        sku: "THM-0050-BLA",
        color: "Black",
        stock: 8
      },
      {
        sku: "THM-0050-WHI",
        color: "White",
        stock: 7
      },
      {
        sku: "THM-0050-GRE",
        color: "Green",
        stock: 5
      }
    ]
  }
];

app.use(cors());

// all products
app.get("/", (req, res) => {
  res.json(products);
});

// filter products by categories
app.get("/category/:cat", (req, res) => {
  const filtered = products.filter(
    (p) => p.category.toLowerCase() === req.params.cat.toLowerCase(),
  );
  res.json(filtered);
});

// categories list
app.get("/categories", (req, res) => {
  res.json(categories);
});

// get single product by id
app.get("/product/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API is running on http://0.0.0.0:${PORT}`);
});
