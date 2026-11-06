const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;

// لیست جداگانه کتگوری‌ها
const categories = [
  {
    id: 1,
    name: "Tshirt",
    slug: "tshirt"
  },
  {
    id: 2,
    name: "Shoe",
    slug: "shoe"
  },
  {
    id: 3,
    name: "Handbag",
    slug: "handbag"
  },
  {
    id: 4,
    name: "Hat",
    slug: "hat"
  },
  {
    id: 5,
    name: "Perfume",
    slug: "perfume"
  },
  {
    id: 6,
    name: "Thermos",
    slug: "thermos"
  }
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
    image: [ "https://pngimg.com/uploads/tshirt/tshirt_PNG5454.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5454.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5454.png" ],
    category: "tshirt",
    price: 29,
    review: 2156,
    rating: 4.7,
    createdAt: "2023-01-15T09:30:00.000Z",
    isFeatured: true,
    description: "Elevate your everyday style with our Classic White T-Shirt, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [ "Premium Quality", "Versatile Wardrobe Staple", "Available in Various Sizes", "Tailored Fit" ],
    reviews: [
      {
        id: 1,
        name: "Olivia Johnson",
        date: "2024-06-17T04:42:13.590Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 2,
        name: "Henry Allen",
        date: "2024-04-03T18:17:40.060Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 3,
        name: "Logan Thompson",
        date: "2024-03-27T22:25:51.303Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 4,
        name: "Ava Baker",
        date: "2024-03-26T03:51:29.742Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 5,
        name: "Mia Martin",
        date: "2023-06-13T11:58:39.377Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 6,
        name: "Michael Harris",
        date: "2023-03-14T17:25:15.131Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Off White",
            hex: [ "#F5F5F0" ]
          },
          {
            name: "Ivory",
            hex: [ "#FFFFF0" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "S", "M", "L", "XL", "XXL" ]
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
    image: [ "https://pngimg.com/uploads/tshirt/tshirt_PNG5453.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5453.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5453.png" ],
    category: "tshirt",
    price: 27,
    review: 1893,
    rating: 4.5,
    createdAt: "2023-02-20T11:15:00.000Z",
    isFeatured: false,
    description: "Elevate your everyday style with our Men's Black T-Shirts, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile black tees are a must-have addition to your collection.\n\nThe classic black color never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these black t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [ "Premium Quality", "Versatile Wardrobe Staple", "Available in Various Sizes", "Tailored Fit" ],
    reviews: [
      {
        id: 1,
        name: "Emily Davis",
        date: "2026-03-23T13:33:53.351Z",
        rating: 4,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 2,
        name: "Daniel Smith",
        date: "2026-03-01T03:47:09.887Z",
        rating: 4,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 3,
        name: "Benjamin Clark",
        date: "2025-11-23T08:55:57.062Z",
        rating: 4,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 4,
        name: "Charlotte Hall",
        date: "2025-07-28T18:49:03.333Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 5,
        name: "Noah Wright",
        date: "2023-09-07T09:16:02.964Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 6,
        name: "William Davis",
        date: "2023-06-19T16:01:45.321Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Charcoal",
            hex: [ "#36454F" ]
          },
          {
            name: "Dark Gray",
            hex: [ "#4A4A4A" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "S", "M", "L", "XL", "XXL" ]
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
    image: [ "https://pngimg.com/uploads/tshirt/tshirt_PNG5452.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5452.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5452.png" ],
    category: "tshirt",
    price: 32,
    review: 1247,
    rating: 4.4,
    createdAt: "2023-04-08T14:00:00.000Z",
    isFeatured: false,
    description: "Elevate your everyday style with our Navy Blue Crew Neck, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [ "Premium Quality", "Versatile Wardrobe Staple", "Available in Various Sizes", "Tailored Fit" ],
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
        name: "Jacob King",
        date: "2025-06-05T19:18:55.257Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 3,
        name: "James Hill",
        date: "2023-12-12T20:46:29.090Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 4,
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
            hex: [ "#1F2A44" ]
          },
          {
            name: "Royal Blue",
            hex: [ "#2851A3" ]
          },
          {
            name: "Sky Blue",
            hex: [ "#87CEEB" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "S", "M", "L", "XL", "XXL" ]
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
    image: [ "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png" ],
    category: "tshirt",
    price: 39,
    review: 1678,
    rating: 4.6,
    createdAt: "2023-06-12T10:45:00.000Z",
    isFeatured: true,
    description: "Elevate your everyday style with our Graphic Print T-Shirt, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [ "Premium Quality", "Versatile Wardrobe Staple", "Available in Various Sizes", "Tailored Fit" ],
    reviews: [
      {
        id: 1,
        name: "Michael Walker",
        date: "2025-02-27T18:13:01.869Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 2,
        name: "Emily Wilson",
        date: "2025-01-25T07:16:25.854Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 3,
        name: "Abigail Clark",
        date: "2024-09-06T14:03:09.539Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 4,
        name: "Benjamin Harris",
        date: "2024-01-02T22:14:13.116Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 5,
        name: "Daniel Martinez",
        date: "2023-07-22T06:18:02.564Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Red",
            hex: [ "#D32F2F" ]
          },
          {
            name: "Gray",
            hex: [ "#9E9E9E" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "S", "M", "L", "XL", "XXL" ]
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
    image: [ "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png" ],
    category: "tshirt",
    price: 45,
    review: 982,
    rating: 4.3,
    createdAt: "2023-09-05T16:20:00.000Z",
    isFeatured: false,
    description: "Elevate your everyday style with our Oversized Streetwear Tee, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [ "Premium Quality", "Versatile Wardrobe Staple", "Available in Various Sizes", "Tailored Fit" ],
    reviews: [
      {
        id: 1,
        name: "Liam Anderson",
        date: "2026-07-19T20:04:01.315Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 2,
        name: "Amelia Wright",
        date: "2025-09-21T10:00:41.777Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 3,
        name: "Jackson Johnson",
        date: "2024-04-24T21:30:05.405Z",
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
            hex: [ "#111111" ]
          },
          {
            name: "Olive",
            hex: [ "#6B7B3A" ]
          },
          {
            name: "Beige",
            hex: [ "#E1D5BC" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "S", "M", "L", "XL", "XXL" ]
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
    image: [ "https://pngimg.com/uploads/tshirt/tshirt_PNG5449.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5449.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5449.png" ],
    category: "tshirt",
    price: 34,
    review: 1456,
    rating: 4.2,
    createdAt: "2024-01-18T08:50:00.000Z",
    isFeatured: false,
    description: "Elevate your everyday style with our Striped Casual T-Shirt, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [ "Premium Quality", "Versatile Wardrobe Staple", "Available in Various Sizes", "Tailored Fit" ],
    reviews: [
      {
        id: 1,
        name: "Noah Smith",
        date: "2025-11-17T03:20:56.583Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 2,
        name: "Noah Garcia",
        date: "2025-09-09T22:22:14.173Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 3,
        name: "Mia Scott",
        date: "2025-05-18T04:07:07.043Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 4,
        name: "Daniel Davis",
        date: "2025-03-09T02:50:05.037Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 5,
        name: "William Robinson",
        date: "2025-03-07T00:47:18.956Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Navy/White",
            hex: [ "#1F2A44", "#FFFFFF" ]
          },
          {
            name: "Black/White",
            hex: [ "#111111", "#FFFFFF" ]
          },
          {
            name: "Red/White",
            hex: [ "#D32F2F", "#FFFFFF" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "S", "M", "L", "XL", "XXL" ]
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
    image: [ "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png" ],
    category: "tshirt",
    price: 49,
    review: 876,
    rating: 4.8,
    createdAt: "2024-05-22T13:10:00.000Z",
    isFeatured: true,
    description: "Elevate your everyday style with our Premium Soft Touch Tee, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [ "Premium Quality", "Versatile Wardrobe Staple", "Available in Various Sizes", "Tailored Fit" ],
    reviews: [
      {
        id: 1,
        name: "Emily Nelson",
        date: "2026-02-18T18:14:09.646Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 2,
        name: "Mason Scott",
        date: "2026-01-22T01:14:22.601Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 3,
        name: "Noah Wilson",
        date: "2025-03-27T20:21:08.075Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Gray",
            hex: [ "#9E9E9E" ]
          },
          {
            name: "Beige",
            hex: [ "#E1D5BC" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "S", "M", "L", "XL", "XXL" ]
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
    image: [ "https://pngimg.com/uploads/tshirt/tshirt_PNG5447.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5447.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5447.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5447.png", "https://pngimg.com/uploads/tshirt/tshirt_PNG5447.png" ],
    category: "tshirt",
    price: 25,
    review: 2034,
    rating: 4.5,
    createdAt: "2024-08-03T17:40:00.000Z",
    isFeatured: false,
    description: "Elevate your everyday style with our V-Neck Basic T-Shirt, the ultimate wardrobe essential for modern men. Crafted with meticulous attention to detail and designed for comfort, these versatile tees are a must-have addition to your collection.\n\nThe classic design never goes out of style. Whether you're dressing up for a special occasion or keeping it casual, these t-shirts are the perfect choice, effortlessly complementing any outfit.",
    features: [ "Premium Quality", "Versatile Wardrobe Staple", "Available in Various Sizes", "Tailored Fit" ],
    reviews: [
      {
        id: 1,
        name: "Mason Adams",
        date: "2026-03-16T21:59:25.100Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 2,
        name: "Ava Hill",
        date: "2026-02-14T11:13:35.877Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 3,
        name: "Ethan Robinson",
        date: "2025-09-02T09:47:55.085Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 4,
        name: "Mason Jackson",
        date: "2025-06-25T01:15:28.295Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 5,
        name: "Evelyn Young",
        date: "2025-05-26T02:29:15.649Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 6,
        name: "Noah Thomas",
        date: "2025-01-19T15:46:00.390Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Navy",
            hex: [ "#1F2A44" ]
          },
          {
            name: "Gray",
            hex: [ "#9E9E9E" ]
          },
          {
            name: "Red",
            hex: [ "#D32F2F" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "S", "M", "L", "XL", "XXL" ]
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
    image: [ "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5827.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5827.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5827.png" ],
    category: "shoe",
    price: 89,
    review: 3421,
    rating: 4.8,
    createdAt: "2022-11-10T12:00:00.000Z",
    isFeatured: true,
    description: "Step up your footwear game with our White Sneakers. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [ "Premium Materials", "Comfortable Fit", "Durable Construction", "Stylish Design" ],
    reviews: [
      {
        id: 1,
        name: "Henry Martin",
        date: "2025-12-02T12:22:36.571Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 2,
        name: "Harper Wright",
        date: "2025-02-28T01:34:00.879Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 3,
        name: "Abigail Green",
        date: "2025-02-14T02:10:07.900Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 4,
        name: "Sophia Anderson",
        date: "2025-02-06T23:07:33.440Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 5,
        name: "Jackson Thompson",
        date: "2023-11-01T03:30:38.263Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 6,
        name: "Ethan Lewis",
        date: "2023-10-12T10:13:59.437Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "White/Black",
            hex: [ "#FFFFFF", "#111111" ]
          },
          {
            name: "White/Blue",
            hex: [ "#FFFFFF", "#1E6FD9" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "40", "41", "42", "43", "44" ]
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
    image: [ "https://pngimg.com/uploads/boots/boots_PNG7815.png", "https://pngimg.com/uploads/boots/boots_PNG7815.png", "https://pngimg.com/uploads/boots/boots_PNG7815.png" ],
    category: "shoe",
    price: 129,
    review: 978,
    rating: 3.7,
    createdAt: "2023-03-25T09:25:00.000Z",
    isFeatured: false,
    description: "Step up your footwear game with our Brown Leather Boots. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [ "Premium Materials", "Comfortable Fit", "Durable Construction", "Stylish Design" ],
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
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Brown",
            hex: [ "#6D4C41" ]
          },
          {
            name: "Dark Brown",
            hex: [ "#3E2723" ]
          },
          {
            name: "Tan",
            hex: [ "#D2B48C" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "40", "41", "42", "43", "44" ]
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
    image: [ "https://pngimg.com/uploads/boots/boots_PNG7813.png", "https://pngimg.com/uploads/boots/boots_PNG7813.png", "https://pngimg.com/uploads/boots/boots_PNG7813.png", "https://pngimg.com/uploads/boots/boots_PNG7813.png", "https://pngimg.com/uploads/boots/boots_PNG7813.png", "https://pngimg.com/uploads/boots/boots_PNG7813.png" ],
    category: "shoe",
    price: 115,
    review: 1123,
    rating: 4.5,
    createdAt: "2023-05-14T15:35:00.000Z",
    isFeatured: false,
    description: "Step up your footwear game with our Black Formal Shoes. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [ "Premium Materials", "Comfortable Fit", "Durable Construction", "Stylish Design" ],
    reviews: [
      {
        id: 1,
        name: "Noah Allen",
        date: "2026-05-23T04:29:48.623Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 2,
        name: "Sophia Adams",
        date: "2024-05-30T19:06:50.557Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 3,
        name: "Logan Scott",
        date: "2024-01-09T23:47:13.130Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 4,
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
            hex: [ "#111111" ]
          },
          {
            name: "Dark Brown",
            hex: [ "#3E2723" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "40", "41", "42", "43", "44" ]
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
    image: [ "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png" ],
    category: "shoe",
    price: 99,
    review: 2756,
    rating: 4.6,
    createdAt: "2023-07-30T11:05:00.000Z",
    isFeatured: true,
    description: "Step up your footwear game with our Running Shoes. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [ "Premium Materials", "Comfortable Fit", "Durable Construction", "Stylish Design" ],
    reviews: [
      {
        id: 1,
        name: "Sophia Taylor",
        date: "2026-05-05T21:53:41.973Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 2,
        name: "Jackson White",
        date: "2025-09-03T03:29:04.517Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 3,
        name: "Evelyn Hill",
        date: "2024-12-27T18:21:19.776Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 4,
        name: "Henry King",
        date: "2024-11-16T18:22:58.598Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 5,
        name: "Elizabeth Adams",
        date: "2024-08-23T12:38:09.901Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 6,
        name: "Ava Nelson",
        date: "2024-02-13T11:02:59.413Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Blue",
            hex: [ "#1E6FD9" ]
          },
          {
            name: "Red",
            hex: [ "#D32F2F" ]
          },
          {
            name: "Gray",
            hex: [ "#9E9E9E" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "40", "41", "42", "43", "44" ]
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
    image: [ "https://pngimg.com/uploads/converse/converse_PNG66.png", "https://pngimg.com/uploads/converse/converse_PNG66.png", "https://pngimg.com/uploads/converse/converse_PNG66.png", "https://pngimg.com/uploads/converse/converse_PNG66.png", "https://pngimg.com/uploads/converse/converse_PNG66.png", "https://pngimg.com/uploads/converse/converse_PNG66.png" ],
    category: "shoe",
    price: 55,
    review: 1634,
    rating: 1.3,
    createdAt: "2023-10-19T14:50:00.000Z",
    isFeatured: false,
    description: "Step up your footwear game with our Canvas Low Top. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [ "Premium Materials", "Comfortable Fit", "Durable Construction", "Stylish Design" ],
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
      },
      {
        id: 3,
        name: "Sebastian Martinez",
        date: "2025-09-02T20:09:35.109Z",
        rating: 1,
        comment: "Very disappointed. Not worth the money."
      },
      {
        id: 4,
        name: "Elizabeth Adams",
        date: "2024-06-08T01:48:48.998Z",
        rating: 2,
        comment: "Arrived with a small defect. Disappointed."
      },
      {
        id: 5,
        name: "Daniel Johnson",
        date: "2023-12-09T19:34:36.212Z",
        rating: 2,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Red",
            hex: [ "#D32F2F" ]
          },
          {
            name: "Navy",
            hex: [ "#1F2A44" ]
          },
          {
            name: "Beige",
            hex: [ "#E1D5BC" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "40", "41", "42", "43", "44" ]
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
    image: [ "https://pngimg.com/uploads/boots/boots_PNG7809.png", "https://pngimg.com/uploads/boots/boots_PNG7809.png", "https://pngimg.com/uploads/boots/boots_PNG7809.png", "https://pngimg.com/uploads/boots/boots_PNG7809.png" ],
    category: "shoe",
    price: 149,
    review: 589,
    rating: 4.9,
    createdAt: "2024-02-07T10:15:00.000Z",
    isFeatured: true,
    description: "Step up your footwear game with our Chelsea Boots. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [ "Premium Materials", "Comfortable Fit", "Durable Construction", "Stylish Design" ],
    reviews: [
      {
        id: 1,
        name: "Logan Allen",
        date: "2026-06-14T17:54:04.213Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 2,
        name: "Liam Johnson",
        date: "2026-05-22T19:31:55.113Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 3,
        name: "Mason Harris",
        date: "2024-06-04T09:01:20.581Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Brown",
            hex: [ "#6D4C41" ]
          },
          {
            name: "Burgundy",
            hex: [ "#800020" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "40", "41", "42", "43", "44" ]
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
    image: [ "https://pngimg.com/uploads/boots/boots_PNG7808.png", "https://pngimg.com/uploads/boots/boots_PNG7808.png", "https://pngimg.com/uploads/boots/boots_PNG7808.png", "https://pngimg.com/uploads/boots/boots_PNG7808.png" ],
    category: "shoe",
    price: 45,
    review: 876,
    rating: 4.1,
    createdAt: "2024-04-28T16:00:00.000Z",
    isFeatured: false,
    description: "Step up your footwear game with our Sandals Summer. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [ "Premium Materials", "Comfortable Fit", "Durable Construction", "Stylish Design" ],
    reviews: [
      {
        id: 1,
        name: "Abigail Martinez",
        date: "2025-01-26T14:44:56.623Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 2,
        name: "Olivia Martinez",
        date: "2024-10-23T23:33:17.595Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 3,
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
            hex: [ "#6D4C41" ]
          },
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Beige",
            hex: [ "#E1D5BC" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "40", "41", "42", "43", "44" ]
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
    image: [ "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png", "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png" ],
    category: "shoe",
    price: 85,
    review: 1345,
    rating: 4.4,
    createdAt: "2024-07-11T08:30:00.000Z",
    isFeatured: false,
    description: "Step up your footwear game with our High Top Sneakers. Designed for both comfort and style, these shoes combine premium materials with modern design to keep you looking sharp and feeling great all day long.\n\nPerfect for any occasion, from casual outings to more formal settings, these shoes offer exceptional durability and a perfect fit.",
    features: [ "Premium Materials", "Comfortable Fit", "Durable Construction", "Stylish Design" ],
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
        name: "Liam Young",
        date: "2026-07-01T04:40:39.434Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 3,
        name: "Alexander Thompson",
        date: "2026-01-04T21:23:54.381Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 4,
        name: "Henry Hall",
        date: "2025-06-17T22:35:14.014Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Gray",
            hex: [ "#9E9E9E" ]
          },
          {
            name: "Navy",
            hex: [ "#1F2A44" ]
          }
        ]
      },
      {
        name: "size",
        values: [ "40", "41", "42", "43", "44" ]
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
    image: [ "https://pngimg.com/uploads/women_bag/women_bag_PNG6406.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6406.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6406.png" ],
    category: "handbag",
    price: 119,
    review: 945,
    rating: 2.7,
    createdAt: "2023-01-28T13:20:00.000Z",
    isFeatured: false,
    description: "Discover the perfect blend of style and functionality with our Leather Tote Bag. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [ "Spacious Interior", "Premium Materials", "Versatile Style", "Secure Closures" ],
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
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Brown",
            hex: [ "#6D4C41" ]
          },
          {
            name: "Tan",
            hex: [ "#D2B48C" ]
          },
          {
            name: "Burgundy",
            hex: [ "#800020" ]
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
    image: [ "https://pngimg.com/uploads/women_bag/women_bag_PNG6407.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6407.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6407.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6407.png" ],
    category: "handbag",
    price: 69,
    review: 1678,
    rating: 4.5,
    createdAt: "2023-04-16T09:40:00.000Z",
    isFeatured: false,
    description: "Discover the perfect blend of style and functionality with our Mini Crossbody Bag. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [ "Spacious Interior", "Premium Materials", "Versatile Style", "Secure Closures" ],
    reviews: [
      {
        id: 1,
        name: "Alexander Taylor",
        date: "2026-09-10T02:10:12.153Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 2,
        name: "Logan Martin",
        date: "2025-09-16T00:20:29.767Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 3,
        name: "Daniel Smith",
        date: "2025-01-13T19:18:32.384Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 4,
        name: "Mia Johnson",
        date: "2024-05-07T11:45:41.613Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 5,
        name: "Avery Davis",
        date: "2023-10-13T12:51:50.687Z",
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
            hex: [ "#111111" ]
          },
          {
            name: "Beige",
            hex: [ "#E1D5BC" ]
          },
          {
            name: "Pink",
            hex: [ "#F48FB1" ]
          },
          {
            name: "Navy",
            hex: [ "#1F2A44" ]
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
    image: [ "https://pngimg.com/uploads/women_bag/women_bag_PNG6408.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6408.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6408.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6408.png" ],
    category: "handbag",
    price: 139,
    review: 723,
    rating: 4.8,
    createdAt: "2023-08-02T15:55:00.000Z",
    isFeatured: true,
    description: "Discover the perfect blend of style and functionality with our Structured Shoulder Bag. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [ "Spacious Interior", "Premium Materials", "Versatile Style", "Secure Closures" ],
    reviews: [
      {
        id: 1,
        name: "Benjamin Lewis",
        date: "2026-05-02T08:04:26.127Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 2,
        name: "Benjamin Scott",
        date: "2026-03-13T17:00:02.063Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 3,
        name: "Abigail Thomas",
        date: "2025-08-11T08:57:31.440Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Brown",
            hex: [ "#6D4C41" ]
          },
          {
            name: "Red",
            hex: [ "#D32F2F" ]
          },
          {
            name: "Gray",
            hex: [ "#9E9E9E" ]
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
    image: [ "https://pngimg.com/uploads/shopping_bag/shopping_bag_PNG6392.png", "https://pngimg.com/uploads/shopping_bag/shopping_bag_PNG6392.png", "https://pngimg.com/uploads/shopping_bag/shopping_bag_PNG6392.png", "https://pngimg.com/uploads/shopping_bag/shopping_bag_PNG6392.png", "https://pngimg.com/uploads/shopping_bag/shopping_bag_PNG6392.png" ],
    category: "handbag",
    price: 35,
    review: 2109,
    rating: 1.2,
    createdAt: "2023-11-21T11:10:00.000Z",
    isFeatured: false,
    description: "Discover the perfect blend of style and functionality with our Canvas Shopper. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [ "Spacious Interior", "Premium Materials", "Versatile Style", "Secure Closures" ],
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
      },
      {
        id: 3,
        name: "James Johnson",
        date: "2025-03-21T07:52:19.630Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 4,
        name: "Evelyn Harris",
        date: "2025-01-11T10:49:22.965Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 5,
        name: "Noah Wright",
        date: "2024-09-04T00:23:12.934Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 6,
        name: "Logan Brown",
        date: "2024-03-05T12:38:21.807Z",
        rating: 1,
        comment: "Very disappointed. Not worth the money."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Beige",
            hex: [ "#E1D5BC" ]
          },
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Navy",
            hex: [ "#1F2A44" ]
          },
          {
            name: "Olive",
            hex: [ "#6B7B3A" ]
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
    image: [ "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png" ],
    category: "handbag",
    price: 79,
    review: 412,
    rating: 4.6,
    createdAt: "2024-01-09T17:25:00.000Z",
    isFeatured: false,
    description: "Discover the perfect blend of style and functionality with our Clutch Evening Bag. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [ "Spacious Interior", "Premium Materials", "Versatile Style", "Secure Closures" ],
    reviews: [
      {
        id: 1,
        name: "William Adams",
        date: "2026-04-25T05:03:05.859Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 2,
        name: "Noah Thomas",
        date: "2024-06-01T07:54:21.894Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 3,
        name: "Evelyn Nelson",
        date: "2024-02-01T09:30:05.718Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Gold",
            hex: [ "#D4AF37" ]
          },
          {
            name: "Silver",
            hex: [ "#C0C0C0" ]
          },
          {
            name: "Red",
            hex: [ "#D32F2F" ]
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
    image: [ "https://pngimg.com/uploads/women_bag/women_bag_PNG6410.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6410.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6410.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6410.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6410.png" ],
    category: "handbag",
    price: 129,
    review: 1187,
    rating: 4.4,
    createdAt: "2024-03-15T12:45:00.000Z",
    isFeatured: false,
    description: "Discover the perfect blend of style and functionality with our Backpack Leather. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [ "Spacious Interior", "Premium Materials", "Versatile Style", "Secure Closures" ],
    reviews: [
      {
        id: 1,
        name: "Logan Garcia",
        date: "2026-09-15T00:27:16.016Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 2,
        name: "Daniel Walker",
        date: "2026-08-24T14:04:34.407Z",
        rating: 3,
        comment: "It's okay. Does the job but not amazing."
      },
      {
        id: 3,
        name: "Charlotte Hill",
        date: "2025-08-21T05:57:12.931Z",
        rating: 3,
        comment: "It's okay. Does the job but not amazing."
      },
      {
        id: 4,
        name: "Daniel Martinez",
        date: "2025-02-28T14:12:51.926Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Brown",
            hex: [ "#6D4C41" ]
          },
          {
            name: "Dark Green",
            hex: [ "#1B4D2E" ]
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
    image: [ "https://pngimg.com/uploads/women_bag/women_bag_PNG6411.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6411.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6411.png" ],
    category: "handbag",
    price: 89,
    review: 834,
    rating: 2.3,
    createdAt: "2024-06-20T10:00:00.000Z",
    isFeatured: false,
    description: "Discover the perfect blend of style and functionality with our Bucket Bag. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [ "Spacious Interior", "Premium Materials", "Versatile Style", "Secure Closures" ],
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
        name: "William Harris",
        date: "2026-06-03T08:49:11.820Z",
        rating: 1,
        comment: "Very disappointed. Not worth the money."
      },
      {
        id: 3,
        name: "Jacob Lewis",
        date: "2025-08-13T17:19:20.054Z",
        rating: 2,
        comment: "Took too long to arrive and packaging was damaged."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Brown",
            hex: [ "#6D4C41" ]
          },
          {
            name: "Beige",
            hex: [ "#E1D5BC" ]
          },
          {
            name: "Camel",
            hex: [ "#C19A6B" ]
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
    image: [ "https://pngimg.com/uploads/women_bag/women_bag_PNG6428.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6428.png", "https://pngimg.com/uploads/women_bag/women_bag_PNG6428.png" ],
    category: "handbag",
    price: 149,
    review: 1456,
    rating: 4.7,
    createdAt: "2024-09-04T14:30:00.000Z",
    isFeatured: true,
    description: "Discover the perfect blend of style and functionality with our Work Laptop Bag. Crafted from high-quality materials, this bag is designed to complement your lifestyle while providing ample space for all your essentials.\n\nElegant, versatile, and built to last, it's the ideal accessory for everyday use or special occasions.",
    features: [ "Spacious Interior", "Premium Materials", "Versatile Style", "Secure Closures" ],
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
        name: "Olivia Hill",
        date: "2026-05-01T22:19:27.450Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 3,
        name: "James Scott",
        date: "2025-12-14T12:44:28.643Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 4,
        name: "Mason Wilson",
        date: "2025-05-27T16:11:51.776Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 5,
        name: "Charlotte Wright",
        date: "2024-10-25T12:05:04.271Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Gray",
            hex: [ "#9E9E9E" ]
          },
          {
            name: "Navy",
            hex: [ "#1F2A44" ]
          },
          {
            name: "Brown",
            hex: [ "#6D4C41" ]
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
    image: [ "https://pngimg.com/uploads/hat/hat_PNG5697.png", "https://pngimg.com/uploads/hat/hat_PNG5697.png", "https://pngimg.com/uploads/hat/hat_PNG5697.png" ],
    category: "hat",
    price: 45,
    review: 1023,
    rating: 4.8,
    createdAt: "2023-02-05T08:15:00.000Z",
    isFeatured: true,
    description: "Top off your look with our Classic Fedora. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [ "Comfortable Fit", "Premium Materials", "UV Protection", "Adjustable Design" ],
    reviews: [
      {
        id: 1,
        name: "Isabella Wright",
        date: "2025-09-12T19:30:05.183Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 2,
        name: "Amelia Taylor",
        date: "2025-05-19T19:06:48.605Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 3,
        name: "Olivia Scott",
        date: "2024-09-30T09:07:46.309Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Brown",
            hex: [ "#6D4C41" ]
          },
          {
            name: "Gray",
            hex: [ "#9E9E9E" ]
          },
          {
            name: "Beige",
            hex: [ "#E1D5BC" ]
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
    image: [ "https://pngimg.com/uploads/cap/cap_PNG5685.png", "https://pngimg.com/uploads/cap/cap_PNG5685.png", "https://pngimg.com/uploads/cap/cap_PNG5685.png" ],
    category: "hat",
    price: 25,
    review: 2876,
    rating: 1.4,
    createdAt: "2023-05-01T16:40:00.000Z",
    isFeatured: false,
    description: "Top off your look with our Baseball Cap. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [ "Comfortable Fit", "Premium Materials", "UV Protection", "Adjustable Design" ],
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
      },
      {
        id: 3,
        name: "Emily Thompson",
        date: "2025-07-08T15:29:21.039Z",
        rating: 1,
        comment: "Very disappointed. Not worth the money."
      },
      {
        id: 4,
        name: "Alexander Martinez",
        date: "2024-09-19T22:31:11.831Z",
        rating: 2,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 5,
        name: "William Brown",
        date: "2024-09-06T11:38:37.626Z",
        rating: 2,
        comment: "Arrived with a small defect. Disappointed."
      },
      {
        id: 6,
        name: "Sophia Anderson",
        date: "2023-10-27T13:36:27.516Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Navy",
            hex: [ "#1F2A44" ]
          },
          {
            name: "Red",
            hex: [ "#D32F2F" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Gray",
            hex: [ "#9E9E9E" ]
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
    image: [ "https://pngimg.com/uploads/hat/hat_PNG5698.png", "https://pngimg.com/uploads/hat/hat_PNG5698.png", "https://pngimg.com/uploads/hat/hat_PNG5698.png", "https://pngimg.com/uploads/hat/hat_PNG5698.png" ],
    category: "hat",
    price: 29,
    review: 1543,
    rating: 4.7,
    createdAt: "2023-09-18T11:50:00.000Z",
    isFeatured: true,
    description: "Top off your look with our Wool Beanie. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [ "Comfortable Fit", "Premium Materials", "UV Protection", "Adjustable Design" ],
    reviews: [
      {
        id: 1,
        name: "Logan Walker",
        date: "2026-07-07T00:40:43.308Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 2,
        name: "Logan Clark",
        date: "2026-06-16T18:17:26.385Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 3,
        name: "Elizabeth Garcia",
        date: "2026-03-28T14:13:56.032Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 4,
        name: "Elizabeth King",
        date: "2025-10-17T22:08:16.182Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 5,
        name: "Isabella Davis",
        date: "2024-08-19T06:34:15.360Z",
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
            hex: [ "#111111" ]
          },
          {
            name: "Gray",
            hex: [ "#9E9E9E" ]
          },
          {
            name: "Navy",
            hex: [ "#1F2A44" ]
          },
          {
            name: "Burgundy",
            hex: [ "#800020" ]
          },
          {
            name: "Olive",
            hex: [ "#6B7B3A" ]
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
    image: [ "https://pngimg.com/uploads/hat/hat_PNG5699.png", "https://pngimg.com/uploads/hat/hat_PNG5699.png", "https://pngimg.com/uploads/hat/hat_PNG5699.png", "https://pngimg.com/uploads/hat/hat_PNG5699.png", "https://pngimg.com/uploads/hat/hat_PNG5699.png", "https://pngimg.com/uploads/hat/hat_PNG5699.png", "https://pngimg.com/uploads/hat/hat_PNG5699.png" ],
    category: "hat",
    price: 39,
    review: 678,
    rating: 4.5,
    createdAt: "2024-02-14T09:05:00.000Z",
    isFeatured: false,
    description: "Top off your look with our Straw Summer Hat. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [ "Comfortable Fit", "Premium Materials", "UV Protection", "Adjustable Design" ],
    reviews: [
      {
        id: 1,
        name: "Noah Johnson",
        date: "2025-02-04T09:17:04.088Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 2,
        name: "Sebastian Green",
        date: "2024-11-10T12:24:02.677Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 3,
        name: "Isabella Allen",
        date: "2024-05-05T19:25:15.732Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Natural",
            hex: [ "#E8D9B5" ]
          },
          {
            name: "Beige",
            hex: [ "#E1D5BC" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Black",
            hex: [ "#111111" ]
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
    image: [ "https://pngimg.com/uploads/hat/hat_PNG5700.png", "https://pngimg.com/uploads/hat/hat_PNG5700.png", "https://pngimg.com/uploads/hat/hat_PNG5700.png", "https://pngimg.com/uploads/hat/hat_PNG5700.png", "https://pngimg.com/uploads/hat/hat_PNG5700.png" ],
    category: "hat",
    price: 32,
    review: 1923,
    rating: 4.3,
    createdAt: "2024-04-03T13:35:00.000Z",
    isFeatured: false,
    description: "Top off your look with our Bucket Hat. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [ "Comfortable Fit", "Premium Materials", "UV Protection", "Adjustable Design" ],
    reviews: [
      {
        id: 1,
        name: "James King",
        date: "2026-03-08T01:32:36.071Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 2,
        name: "Henry Robinson",
        date: "2026-02-07T03:56:48.719Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 3,
        name: "Noah Wilson",
        date: "2026-01-01T04:01:31.370Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 4,
        name: "Amelia Jackson",
        date: "2025-11-21T17:09:55.579Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 5,
        name: "Ethan White",
        date: "2025-06-13T00:47:16.275Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 6,
        name: "Elizabeth Davis",
        date: "2024-09-03T05:20:57.293Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Khaki",
            hex: [ "#C3B091" ]
          },
          {
            name: "Navy",
            hex: [ "#1F2A44" ]
          },
          {
            name: "Olive",
            hex: [ "#6B7B3A" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
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
    image: [ "https://pngimg.com/uploads/cap/cap_PNG5686.png", "https://pngimg.com/uploads/cap/cap_PNG5686.png", "https://pngimg.com/uploads/cap/cap_PNG5686.png" ],
    category: "hat",
    price: 35,
    review: 534,
    rating: 3.7,
    createdAt: "2024-06-08T15:20:00.000Z",
    isFeatured: false,
    description: "Top off your look with our Newsboy Cap. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [ "Comfortable Fit", "Premium Materials", "UV Protection", "Adjustable Design" ],
    reviews: [
      {
        id: 1,
        name: "Logan Hall",
        date: "2025-12-13T08:58:28.674Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 2,
        name: "William Walker",
        date: "2025-09-01T11:17:13.211Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 3,
        name: "Benjamin Davis",
        date: "2025-03-27T06:45:23.011Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Gray",
            hex: [ "#9E9E9E" ]
          },
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Brown",
            hex: [ "#6D4C41" ]
          },
          {
            name: "Navy",
            hex: [ "#1F2A44" ]
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
    image: [ "https://pngimg.com/uploads/hat/hat_PNG5701.png", "https://pngimg.com/uploads/hat/hat_PNG5701.png", "https://pngimg.com/uploads/hat/hat_PNG5701.png" ],
    category: "hat",
    price: 42,
    review: 891,
    rating: 4.6,
    createdAt: "2024-08-25T10:55:00.000Z",
    isFeatured: false,
    description: "Top off your look with our Sun Hat Wide Brim. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [ "Comfortable Fit", "Premium Materials", "UV Protection", "Adjustable Design" ],
    reviews: [
      {
        id: 1,
        name: "Benjamin White",
        date: "2025-11-28T18:58:25.208Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 2,
        name: "Emily Wilson",
        date: "2025-05-31T02:08:16.363Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 3,
        name: "Jackson Harris",
        date: "2025-04-14T14:00:38.464Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Natural",
            hex: [ "#E8D9B5" ]
          },
          {
            name: "Beige",
            hex: [ "#E1D5BC" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Black",
            hex: [ "#111111" ]
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
    image: [ "https://pngimg.com/uploads/cap/cap_PNG5687.png", "https://pngimg.com/uploads/cap/cap_PNG5687.png", "https://pngimg.com/uploads/cap/cap_PNG5687.png", "https://pngimg.com/uploads/cap/cap_PNG5687.png", "https://pngimg.com/uploads/cap/cap_PNG5687.png", "https://pngimg.com/uploads/cap/cap_PNG5687.png" ],
    category: "hat",
    price: 28,
    review: 1234,
    rating: 4.2,
    createdAt: "2025-01-12T12:10:00.000Z",
    isFeatured: false,
    description: "Top off your look with our Trucker Cap. Combining classic style with modern comfort, this hat is the perfect accessory to complete any outfit and protect you from the elements.\n\nMade with attention to detail and premium materials for a lasting fit and timeless appeal.",
    features: [ "Comfortable Fit", "Premium Materials", "UV Protection", "Adjustable Design" ],
    reviews: [
      {
        id: 1,
        name: "Ethan Green",
        date: "2026-08-23T05:06:32.478Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 2,
        name: "Liam White",
        date: "2026-08-16T23:35:37.817Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 3,
        name: "Abigail Hall",
        date: "2026-06-28T15:51:09.673Z",
        rating: 5,
        comment: "This company always goes above and beyond to satisfy their customers."
      },
      {
        id: 4,
        name: "Liam Martinez",
        date: "2026-01-20T12:11:51.661Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Navy",
            hex: [ "#1F2A44" ]
          },
          {
            name: "Red",
            hex: [ "#D32F2F" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Camo",
            hex: [ "#78866B" ]
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
    image: [ "https://pngimg.com/uploads/perfume/perfume_PNG99997.png", "https://pngimg.com/uploads/perfume/perfume_PNG99997.png", "https://pngimg.com/uploads/perfume/perfume_PNG99997.png", "https://pngimg.com/uploads/perfume/perfume_PNG99997.png", "https://pngimg.com/uploads/perfume/perfume_PNG99997.png", "https://pngimg.com/uploads/perfume/perfume_PNG99997.png" ],
    category: "perfume",
    price: 65,
    review: 2341,
    rating: 2.7,
    createdAt: "2022-12-05T14:00:00.000Z",
    isFeatured: false,
    description: "Experience the captivating scent of our Fresh Citrus Cologne. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [ "Long-Lasting Fragrance", "Elegant Bottle", "Unique Scent Profile", "Perfect for Any Occasion" ],
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
      },
      {
        id: 5,
        name: "Avery Brown",
        date: "2023-11-17T06:22:26.493Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 6,
        name: "Jackson Robinson",
        date: "2023-02-02T04:52:32.756Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      }
    ],
    options: [
      {
        name: "size",
        values: [ "30ml", "50ml", "100ml" ]
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
    image: [ "https://pngimg.com/uploads/perfume/perfume_PNG99996.png", "https://pngimg.com/uploads/perfume/perfume_PNG99996.png", "https://pngimg.com/uploads/perfume/perfume_PNG99996.png" ],
    category: "perfume",
    price: 95,
    review: 1876,
    rating: 4.9,
    createdAt: "2023-03-11T09:30:00.000Z",
    isFeatured: true,
    description: "Experience the captivating scent of our Woody Oriental Perfume. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [ "Long-Lasting Fragrance", "Elegant Bottle", "Unique Scent Profile", "Perfect for Any Occasion" ],
    reviews: [
      {
        id: 1,
        name: "William Baker",
        date: "2026-07-23T18:51:37.061Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 2,
        name: "Olivia Martinez",
        date: "2026-06-30T13:25:50.930Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 3,
        name: "Mia Hall",
        date: "2026-04-03T21:11:19.729Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 4,
        name: "Henry Brown",
        date: "2025-08-24T00:42:30.225Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 5,
        name: "Daniel Green",
        date: "2025-06-10T08:50:02.053Z",
        rating: 5,
        comment: "These guys know their stuff, and it shows in their products."
      },
      {
        id: 6,
        name: "Alexander Davis",
        date: "2023-09-14T00:56:44.042Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      }
    ],
    options: [
      {
        name: "size",
        values: [ "30ml", "50ml", "100ml" ]
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
    image: [ "https://pngimg.com/uploads/perfume/perfume_PNG99995.png", "https://pngimg.com/uploads/perfume/perfume_PNG99995.png", "https://pngimg.com/uploads/perfume/perfume_PNG99995.png", "https://pngimg.com/uploads/perfume/perfume_PNG99995.png", "https://pngimg.com/uploads/perfume/perfume_PNG99995.png" ],
    category: "perfume",
    price: 85,
    review: 1456,
    rating: 4.5,
    createdAt: "2023-06-27T16:15:00.000Z",
    isFeatured: false,
    description: "Experience the captivating scent of our Floral Eau de Parfum. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [ "Long-Lasting Fragrance", "Elegant Bottle", "Unique Scent Profile", "Perfect for Any Occasion" ],
    reviews: [
      {
        id: 1,
        name: "William Martin",
        date: "2026-09-02T13:32:01.427Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 2,
        name: "Jackson Anderson",
        date: "2026-08-06T05:32:31.465Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 3,
        name: "Liam Thompson",
        date: "2026-07-20T02:21:03.411Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 4,
        name: "Harper Martin",
        date: "2025-02-25T19:35:08.335Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      },
      {
        id: 5,
        name: "Michael Young",
        date: "2024-08-28T07:36:00.585Z",
        rating: 5,
        comment: "Absolutely love it! Will definitely buy again."
      }
    ],
    options: [
      {
        name: "size",
        values: [ "30ml", "50ml", "100ml" ]
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
    image: [ "https://pngimg.com/uploads/perfume/perfume_PNG99993.png", "https://pngimg.com/uploads/perfume/perfume_PNG99993.png", "https://pngimg.com/uploads/perfume/perfume_PNG99993.png" ],
    category: "perfume",
    price: 72,
    review: 1123,
    rating: 4.4,
    createdAt: "2023-10-08T11:45:00.000Z",
    isFeatured: false,
    description: "Experience the captivating scent of our Aquatic Fresh Scent. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [ "Long-Lasting Fragrance", "Elegant Bottle", "Unique Scent Profile", "Perfect for Any Occasion" ],
    reviews: [
      {
        id: 1,
        name: "Evelyn Brown",
        date: "2026-06-29T05:32:11.857Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 2,
        name: "Ava Harris",
        date: "2025-10-29T05:11:17.100Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 3,
        name: "Jacob Walker",
        date: "2025-05-10T20:11:05.145Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 4,
        name: "Henry Nelson",
        date: "2024-06-21T07:33:31.523Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      }
    ],
    options: [
      {
        name: "size",
        values: [ "30ml", "50ml", "100ml" ]
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
    image: [ "https://pngimg.com/uploads/perfume/perfume_PNG99991.png", "https://pngimg.com/uploads/perfume/perfume_PNG99991.png", "https://pngimg.com/uploads/perfume/perfume_PNG99991.png" ],
    category: "perfume",
    price: 68,
    review: 987,
    rating: 2.6,
    createdAt: "2024-01-30T08:20:00.000Z",
    isFeatured: false,
    description: "Experience the captivating scent of our Vanilla Sweet Perfume. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [ "Long-Lasting Fragrance", "Elegant Bottle", "Unique Scent Profile", "Perfect for Any Occasion" ],
    reviews: [
      {
        id: 1,
        name: "Jacob Robinson",
        date: "2026-09-26T23:26:25.985Z",
        rating: 2,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 2,
        name: "William Martin",
        date: "2024-12-11T05:24:27.599Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 3,
        name: "Abigail Hall",
        date: "2024-06-16T02:20:23.546Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      }
    ],
    options: [
      {
        name: "size",
        values: [ "30ml", "50ml", "100ml" ]
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
    image: [ "https://pngimg.com/uploads/perfume/perfume_PNG99989.png", "https://pngimg.com/uploads/perfume/perfume_PNG99989.png", "https://pngimg.com/uploads/perfume/perfume_PNG99989.png" ],
    category: "perfume",
    price: 110,
    review: 756,
    rating: 4.8,
    createdAt: "2024-05-06T13:50:00.000Z",
    isFeatured: true,
    description: "Experience the captivating scent of our Spicy Oriental. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [ "Long-Lasting Fragrance", "Elegant Bottle", "Unique Scent Profile", "Perfect for Any Occasion" ],
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
        name: "Sophia Lewis",
        date: "2025-08-20T05:36:21.051Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 3,
        name: "Isabella Garcia",
        date: "2025-02-08T23:52:49.745Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      }
    ],
    options: [
      {
        name: "size",
        values: [ "30ml", "50ml", "100ml" ]
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
    image: [ "https://pngimg.com/uploads/perfume/perfume_PNG99985.png", "https://pngimg.com/uploads/perfume/perfume_PNG99985.png", "https://pngimg.com/uploads/perfume/perfume_PNG99985.png", "https://pngimg.com/uploads/perfume/perfume_PNG99985.png", "https://pngimg.com/uploads/perfume/perfume_PNG99985.png", "https://pngimg.com/uploads/perfume/perfume_PNG99985.png", "https://pngimg.com/uploads/perfume/perfume_PNG99985.png" ],
    category: "perfume",
    price: 59,
    review: 834,
    rating: 4.3,
    createdAt: "2024-07-19T15:05:00.000Z",
    isFeatured: false,
    description: "Experience the captivating scent of our Green Herbal Cologne. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [ "Long-Lasting Fragrance", "Elegant Bottle", "Unique Scent Profile", "Perfect for Any Occasion" ],
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
        name: "James Scott",
        date: "2025-12-23T17:07:21.631Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 3,
        name: "Elizabeth Harris",
        date: "2024-08-17T10:46:45.810Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      }
    ],
    options: [
      {
        name: "size",
        values: [ "30ml", "50ml", "100ml" ]
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
    image: [ "https://pngimg.com/uploads/perfume/perfume_PNG10245.png", "https://pngimg.com/uploads/perfume/perfume_PNG10245.png", "https://pngimg.com/uploads/perfume/perfume_PNG10245.png", "https://pngimg.com/uploads/perfume/perfume_PNG10245.png", "https://pngimg.com/uploads/perfume/perfume_PNG10245.png" ],
    category: "perfume",
    price: 125,
    review: 2145,
    rating: 3.9,
    createdAt: "2024-10-02T10:40:00.000Z",
    isFeatured: false,
    description: "Experience the captivating scent of our Luxury Night Perfume. A carefully crafted fragrance that leaves a lasting impression, perfect for any occasion and designed to reflect your unique personality.\n\nLong-lasting and elegant, this perfume is a must-have addition to your collection.",
    features: [ "Long-Lasting Fragrance", "Elegant Bottle", "Unique Scent Profile", "Perfect for Any Occasion" ],
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
        name: "Evelyn Robinson",
        date: "2025-11-10T08:08:22.712Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 5,
        name: "Jacob Smith",
        date: "2025-05-25T17:46:28.575Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 6,
        name: "Charlotte Hill",
        date: "2024-11-14T20:32:42.314Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      }
    ],
    options: [
      {
        name: "size",
        values: [ "30ml", "50ml", "100ml" ]
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
    image: [ "https://pngimg.com/uploads/thermos/thermos_PNG44.png", "https://pngimg.com/uploads/thermos/thermos_PNG44.png", "https://pngimg.com/uploads/thermos/thermos_PNG44.png", "https://pngimg.com/uploads/thermos/thermos_PNG44.png", "https://pngimg.com/uploads/thermos/thermos_PNG44.png", "https://pngimg.com/uploads/thermos/thermos_PNG44.png" ],
    category: "thermos",
    price: 35,
    review: 3124,
    rating: 4.8,
    createdAt: "2022-10-18T12:25:00.000Z",
    isFeatured: true,
    description: "Keep your drinks at the perfect temperature with our Stainless Steel Thermos 500ml. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [ "Superior Insulation", "Leak-Proof Design", "Durable Build", "Easy to Clean" ],
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
        name: "Charlotte Johnson",
        date: "2025-03-06T18:17:34.748Z",
        rating: 3,
        comment: "Not bad, but I've seen better for similar price."
      },
      {
        id: 4,
        name: "Ethan Johnson",
        date: "2024-05-20T02:08:21.295Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 5,
        name: "Liam Taylor",
        date: "2024-02-07T00:48:46.858Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 6,
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
            hex: [ "#C0C0C0" ]
          },
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Blue",
            hex: [ "#1E6FD9" ]
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
    image: [ "https://pngimg.com/uploads/thermos/thermos_PNG42.png", "https://pngimg.com/uploads/thermos/thermos_PNG42.png", "https://pngimg.com/uploads/thermos/thermos_PNG42.png", "https://pngimg.com/uploads/thermos/thermos_PNG42.png" ],
    category: "thermos",
    price: 29,
    review: 1987,
    rating: 4.6,
    createdAt: "2023-02-22T14:10:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Insulated Travel Mug. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [ "Superior Insulation", "Leak-Proof Design", "Durable Build", "Easy to Clean" ],
    reviews: [
      {
        id: 1,
        name: "Mason Thompson",
        date: "2026-01-07T05:17:23.741Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 2,
        name: "Benjamin Wright",
        date: "2025-05-05T21:40:08.262Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 3,
        name: "Michael Brown",
        date: "2024-06-18T06:41:08.845Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 4,
        name: "Noah Adams",
        date: "2024-06-11T07:46:09.052Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 5,
        name: "Charlotte King",
        date: "2024-04-19T20:11:11.640Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 6,
        name: "Olivia Davis",
        date: "2023-08-01T20:01:17.080Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Red",
            hex: [ "#D32F2F" ]
          },
          {
            name: "Navy",
            hex: [ "#1F2A44" ]
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
    image: [ "https://pngimg.com/uploads/thermos/thermos_PNG41.png", "https://pngimg.com/uploads/thermos/thermos_PNG41.png", "https://pngimg.com/uploads/thermos/thermos_PNG41.png", "https://pngimg.com/uploads/thermos/thermos_PNG41.png", "https://pngimg.com/uploads/thermos/thermos_PNG41.png", "https://pngimg.com/uploads/thermos/thermos_PNG41.png", "https://pngimg.com/uploads/thermos/thermos_PNG41.png" ],
    category: "thermos",
    price: 25,
    review: 1456,
    rating: 1.5,
    createdAt: "2023-05-09T09:00:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Vacuum Flask Classic. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [ "Superior Insulation", "Leak-Proof Design", "Durable Build", "Easy to Clean" ],
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
        name: "Liam Thomas",
        date: "2025-08-13T12:20:07.141Z",
        rating: 2,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 3,
        name: "Evelyn Hall",
        date: "2025-08-11T10:59:34.048Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      },
      {
        id: 4,
        name: "Charlotte Robinson",
        date: "2024-07-27T17:01:11.187Z",
        rating: 2,
        comment: "Fits a bit differently than shown. Okay but not perfect."
      },
      {
        id: 5,
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
            hex: [ "#C0C0C0" ]
          },
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "Green",
            hex: [ "#2E7D32" ]
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
    image: [ "https://pngimg.com/uploads/thermos/thermos_PNG40.png", "https://pngimg.com/uploads/thermos/thermos_PNG40.png", "https://pngimg.com/uploads/thermos/thermos_PNG40.png", "https://pngimg.com/uploads/thermos/thermos_PNG40.png", "https://pngimg.com/uploads/thermos/thermos_PNG40.png" ],
    category: "thermos",
    price: 55,
    review: 876,
    rating: 4.7,
    createdAt: "2023-08-14T16:30:00.000Z",
    isFeatured: true,
    description: "Keep your drinks at the perfect temperature with our Smart Temperature Thermos. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [ "Superior Insulation", "Leak-Proof Design", "Durable Build", "Easy to Clean" ],
    reviews: [
      {
        id: 1,
        name: "Emily Adams",
        date: "2025-08-02T21:10:42.122Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 2,
        name: "Abigail Taylor",
        date: "2024-12-30T13:45:43.080Z",
        rating: 5,
        comment: "Great product, fast shipping, and exactly as described."
      },
      {
        id: 3,
        name: "William Jackson",
        date: "2023-11-21T16:25:42.053Z",
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
            hex: [ "#111111" ]
          },
          {
            name: "Silver",
            hex: [ "#C0C0C0" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
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
    image: [ "https://pngimg.com/uploads/thermos/thermos_PNG39.png", "https://pngimg.com/uploads/thermos/thermos_PNG39.png", "https://pngimg.com/uploads/thermos/thermos_PNG39.png", "https://pngimg.com/uploads/thermos/thermos_PNG39.png" ],
    category: "thermos",
    price: 32,
    review: 1678,
    rating: 4.4,
    createdAt: "2023-11-03T11:20:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Matte Black Bottle. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [ "Superior Insulation", "Leak-Proof Design", "Durable Build", "Easy to Clean" ],
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
        name: "Alexander Brown",
        date: "2024-12-01T01:24:56.853Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 3,
        name: "Isabella Brown",
        date: "2024-06-20T17:02:28.925Z",
        rating: 4,
        comment: "Solid quality and good value for money."
      },
      {
        id: 4,
        name: "Olivia Thompson",
        date: "2024-06-19T09:06:08.012Z",
        rating: 4,
        comment: "Nice item, shipping was reasonable."
      },
      {
        id: 5,
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
            hex: [ "#1C1C1C" ]
          },
          {
            name: "Matte Gray",
            hex: [ "#6B6B6B" ]
          },
          {
            name: "Matte Blue",
            hex: [ "#2F4F6F" ]
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
    image: [ "https://pngimg.com/uploads/thermos/thermos_PNG35.png", "https://pngimg.com/uploads/thermos/thermos_PNG35.png", "https://pngimg.com/uploads/thermos/thermos_PNG35.png", "https://pngimg.com/uploads/thermos/thermos_PNG35.png", "https://pngimg.com/uploads/thermos/thermos_PNG35.png", "https://pngimg.com/uploads/thermos/thermos_PNG35.png", "https://pngimg.com/uploads/thermos/thermos_PNG35.png" ],
    category: "thermos",
    price: 22,
    review: 2345,
    rating: 3.3,
    createdAt: "2024-02-26T08:45:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Kids Colorful Thermos. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [ "Superior Insulation", "Leak-Proof Design", "Durable Build", "Easy to Clean" ],
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
        name: "Mason Jackson",
        date: "2026-06-02T10:22:46.616Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 3,
        name: "Olivia Martinez",
        date: "2026-03-30T16:37:23.175Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 4,
        name: "Lucas Thompson",
        date: "2025-07-31T12:07:17.402Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      },
      {
        id: 5,
        name: "Jackson King",
        date: "2024-11-23T04:36:33.170Z",
        rating: 1,
        comment: "Received a damaged item and customer service was slow."
      },
      {
        id: 6,
        name: "Evelyn Garcia",
        date: "2024-03-17T11:11:47.325Z",
        rating: 3,
        comment: "Average experience. The product is fine."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Pink",
            hex: [ "#F48FB1" ]
          },
          {
            name: "Blue",
            hex: [ "#1E6FD9" ]
          },
          {
            name: "Yellow",
            hex: [ "#FDD835" ]
          },
          {
            name: "Green",
            hex: [ "#2E7D32" ]
          },
          {
            name: "Purple",
            hex: [ "#8E24AA" ]
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
    image: [ "https://pngimg.com/uploads/thermos/thermos_PNG31.png", "https://pngimg.com/uploads/thermos/thermos_PNG31.png", "https://pngimg.com/uploads/thermos/thermos_PNG31.png" ],
    category: "thermos",
    price: 42,
    review: 2891,
    rating: 4.9,
    createdAt: "2024-05-15T13:00:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Double Wall Coffee Flask. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [ "Superior Insulation", "Leak-Proof Design", "Durable Build", "Easy to Clean" ],
    reviews: [
      {
        id: 1,
        name: "Noah Thomas",
        date: "2026-06-01T02:34:37.982Z",
        rating: 5,
        comment: "Perfect for everyday use. Comfortable and stylish."
      },
      {
        id: 2,
        name: "Avery Anderson",
        date: "2026-05-06T13:50:48.883Z",
        rating: 5,
        comment: "Really impressed with the attention to detail."
      },
      {
        id: 3,
        name: "James Hill",
        date: "2025-09-02T03:06:18.539Z",
        rating: 3,
        comment: "Good product overall, but shipping took a bit longer than expected."
      },
      {
        id: 4,
        name: "Amelia Martin",
        date: "2025-02-05T11:13:18.924Z",
        rating: 5,
        comment: "I can't believe how affordable and high-quality this item is!"
      },
      {
        id: 5,
        name: "Benjamin Thompson",
        date: "2025-01-31T04:38:04.200Z",
        rating: 5,
        comment: "Excellent quality and perfect fit. Highly recommend!"
      },
      {
        id: 6,
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
            hex: [ "#111111" ]
          },
          {
            name: "Silver",
            hex: [ "#C0C0C0" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Red",
            hex: [ "#D32F2F" ]
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
    image: [ "https://pngimg.com/uploads/thermos/thermos_PNG25.png", "https://pngimg.com/uploads/thermos/thermos_PNG25.png", "https://pngimg.com/uploads/thermos/thermos_PNG25.png", "https://pngimg.com/uploads/thermos/thermos_PNG25.png", "https://pngimg.com/uploads/thermos/thermos_PNG25.png", "https://pngimg.com/uploads/thermos/thermos_PNG25.png", "https://pngimg.com/uploads/thermos/thermos_PNG25.png" ],
    category: "thermos",
    price: 28,
    review: 1765,
    rating: 4.5,
    createdAt: "2024-07-28T15:40:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Sport Water Bottle. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [ "Superior Insulation", "Leak-Proof Design", "Durable Build", "Easy to Clean" ],
    reviews: [
      {
        id: 1,
        name: "Henry Martin",
        date: "2026-08-24T05:09:33.543Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 2,
        name: "Olivia Anderson",
        date: "2025-11-18T05:17:37.880Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      },
      {
        id: 3,
        name: "Sebastian White",
        date: "2025-11-08T02:33:01.296Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 4,
        name: "Charlotte Nelson",
        date: "2025-05-07T00:28:40.311Z",
        rating: 5,
        comment: "One of the best purchases I've made this year."
      },
      {
        id: 5,
        name: "Benjamin Smith",
        date: "2025-03-23T07:51:24.284Z",
        rating: 4,
        comment: "Really good product, just a small issue with the size."
      },
      {
        id: 6,
        name: "Michael Jackson",
        date: "2024-11-29T20:57:34.285Z",
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
            hex: [ "#111111" ]
          },
          {
            name: "Blue",
            hex: [ "#1E6FD9" ]
          },
          {
            name: "Red",
            hex: [ "#D32F2F" ]
          },
          {
            name: "Green",
            hex: [ "#2E7D32" ]
          },
          {
            name: "Orange",
            hex: [ "#F57C00" ]
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
    image: [ "https://pngimg.com/uploads/thermos/thermos_PNG16.png", "https://pngimg.com/uploads/thermos/thermos_PNG16.png", "https://pngimg.com/uploads/thermos/thermos_PNG16.png", "https://pngimg.com/uploads/thermos/thermos_PNG16.png", "https://pngimg.com/uploads/thermos/thermos_PNG16.png", "https://pngimg.com/uploads/thermos/thermos_PNG16.png", "https://pngimg.com/uploads/thermos/thermos_PNG16.png" ],
    category: "thermos",
    price: 65,
    review: 654,
    rating: 2.8,
    createdAt: "2024-09-16T10:15:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Premium Gold Trim Thermos. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [ "Superior Insulation", "Leak-Proof Design", "Durable Build", "Easy to Clean" ],
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
        name: "Avery Clark",
        date: "2024-12-05T19:39:41.306Z",
        rating: 3,
        comment: "Decent quality for the price. Nothing extraordinary but solid."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Black/Gold",
            hex: [ "#111111", "#D4AF37" ]
          },
          {
            name: "White/Gold",
            hex: [ "#FFFFFF", "#D4AF37" ]
          },
          {
            name: "Navy/Gold",
            hex: [ "#1F2A44", "#D4AF37" ]
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
    image: [ "https://pngimg.com/uploads/thermos/thermos_PNG15.png", "https://pngimg.com/uploads/thermos/thermos_PNG15.png", "https://pngimg.com/uploads/thermos/thermos_PNG15.png", "https://pngimg.com/uploads/thermos/thermos_PNG15.png", "https://pngimg.com/uploads/thermos/thermos_PNG15.png", "https://pngimg.com/uploads/thermos/thermos_PNG15.png", "https://pngimg.com/uploads/thermos/thermos_PNG15.png" ],
    category: "thermos",
    price: 38,
    review: 1234,
    rating: 4.6,
    createdAt: "2025-02-01T12:50:00.000Z",
    isFeatured: false,
    description: "Keep your drinks at the perfect temperature with our Eco Bamboo Lid Flask. Built with advanced insulation technology and durable materials, this thermos is ideal for everyday use, travel, or outdoor adventures.\n\nStylish, reliable, and eco-friendly, it's the perfect companion for your active lifestyle.",
    features: [ "Superior Insulation", "Leak-Proof Design", "Durable Build", "Easy to Clean" ],
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
        name: "Abigail Nelson",
        date: "2026-04-28T11:33:58.249Z",
        rating: 5,
        comment: "The quality exceeded my expectations. Very happy with my purchase."
      },
      {
        id: 3,
        name: "Harper Martin",
        date: "2026-04-19T16:00:01.690Z",
        rating: 4,
        comment: "Happy with the purchase. Would buy from them again."
      },
      {
        id: 4,
        name: "Henry Brown",
        date: "2025-09-24T14:00:28.431Z",
        rating: 4,
        comment: "Looks great and feels premium. Recommended."
      }
    ],
    options: [
      {
        name: "color",
        values: [
          {
            name: "Natural",
            hex: [ "#E8D9B5" ]
          },
          {
            name: "Black",
            hex: [ "#111111" ]
          },
          {
            name: "White",
            hex: [ "#FFFFFF" ]
          },
          {
            name: "Green",
            hex: [ "#2E7D32" ]
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
