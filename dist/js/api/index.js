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
  - options : محورهای انتخاب (color / size) با مقادیرشان (hex برای نمایش دایره رنگ؛ آرایه چون بعضی رنگ‌ها دو رنگه‌اند)
              عطر فقط محور size (حجم) دارد.
  - variants: هر ترکیب قابل فروش یک آیتم با sku یکتا
              stock: 0  => ترکیب وجود دارد ولی تمام شده
              نبودن ترکیب در لیست => آن ترکیب اصلاً تولید نمی‌شود
  - موجودی کل، رنگ‌های موجود، فیلتر و ... را فرانت از روی variants حساب می‌کند.
*/
const products = [
  {
    id: 1,
    title: "Classic White T-Shirt",
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5454.png",
    category: "tshirt",
    price: 29,
    review: 2156,
    rating: 4.7,
    createdAt: "2023-01-15T09:30:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5453.png",
    category: "tshirt",
    price: 27,
    review: 1893,
    rating: 4.5,
    createdAt: "2023-02-20T11:15:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5452.png",
    category: "tshirt",
    price: 32,
    review: 1247,
    rating: 4.4,
    createdAt: "2023-04-08T14:00:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5451.png",
    category: "tshirt",
    price: 39,
    review: 1678,
    rating: 4.6,
    createdAt: "2023-06-12T10:45:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png",
    category: "tshirt",
    price: 45,
    review: 982,
    rating: 4.3,
    createdAt: "2023-09-05T16:20:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5449.png",
    category: "tshirt",
    price: 34,
    review: 1456,
    rating: 4.2,
    createdAt: "2024-01-18T08:50:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png",
    category: "tshirt",
    price: 49,
    review: 876,
    rating: 4.8,
    createdAt: "2024-05-22T13:10:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5447.png",
    category: "tshirt",
    price: 25,
    review: 2034,
    rating: 4.5,
    createdAt: "2024-08-03T17:40:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5827.png",
    category: "shoe",
    price: 89,
    review: 3421,
    rating: 4.8,
    createdAt: "2022-11-10T12:00:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/boots/boots_PNG7815.png",
    category: "shoe",
    price: 129,
    review: 978,
    rating: 3.7,
    createdAt: "2023-03-25T09:25:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/boots/boots_PNG7813.png",
    category: "shoe",
    price: 115,
    review: 1123,
    rating: 4.5,
    createdAt: "2023-05-14T15:35:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5826.png",
    category: "shoe",
    price: 99,
    review: 2756,
    rating: 4.6,
    createdAt: "2023-07-30T11:05:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/converse/converse_PNG66.png",
    category: "shoe",
    price: 55,
    review: 1634,
    rating: 1.3,
    createdAt: "2023-10-19T14:50:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/boots/boots_PNG7809.png",
    category: "shoe",
    price: 149,
    review: 589,
    rating: 4.9,
    createdAt: "2024-02-07T10:15:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/boots/boots_PNG7808.png",
    category: "shoe",
    price: 45,
    review: 876,
    rating: 4.1,
    createdAt: "2024-04-28T16:00:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5817.png",
    category: "shoe",
    price: 85,
    review: 1345,
    rating: 4.4,
    createdAt: "2024-07-11T08:30:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/women_bag/women_bag_PNG6406.png",
    category: "handbag",
    price: 119,
    review: 945,
    rating: 2.7,
    createdAt: "2023-01-28T13:20:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/women_bag/women_bag_PNG6407.png",
    category: "handbag",
    price: 69,
    review: 1678,
    rating: 4.5,
    createdAt: "2023-04-16T09:40:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/women_bag/women_bag_PNG6408.png",
    category: "handbag",
    price: 139,
    review: 723,
    rating: 4.8,
    createdAt: "2023-08-02T15:55:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/shopping_bag/shopping_bag_PNG6392.png",
    category: "handbag",
    price: 35,
    review: 2109,
    rating: 1.2,
    createdAt: "2023-11-21T11:10:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/women_bag/women_bag_PNG6409.png",
    category: "handbag",
    price: 79,
    review: 412,
    rating: 4.6,
    createdAt: "2024-01-09T17:25:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/women_bag/women_bag_PNG6410.png",
    category: "handbag",
    price: 129,
    review: 1187,
    rating: 4.4,
    createdAt: "2024-03-15T12:45:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/women_bag/women_bag_PNG6411.png",
    category: "handbag",
    price: 89,
    review: 834,
    rating: 2.3,
    createdAt: "2024-06-20T10:00:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/women_bag/women_bag_PNG6428.png",
    category: "handbag",
    price: 149,
    review: 1456,
    rating: 4.7,
    createdAt: "2024-09-04T14:30:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/hat/hat_PNG5697.png",
    category: "hat",
    price: 45,
    review: 1023,
    rating: 4.8,
    createdAt: "2023-02-05T08:15:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/cap/cap_PNG5685.png",
    category: "hat",
    price: 25,
    review: 2876,
    rating: 1.4,
    createdAt: "2023-05-01T16:40:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/hat/hat_PNG5698.png",
    category: "hat",
    price: 29,
    review: 1543,
    rating: 4.7,
    createdAt: "2023-09-18T11:50:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/hat/hat_PNG5699.png",
    category: "hat",
    price: 39,
    review: 678,
    rating: 4.5,
    createdAt: "2024-02-14T09:05:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/hat/hat_PNG5700.png",
    category: "hat",
    price: 32,
    review: 1923,
    rating: 4.3,
    createdAt: "2024-04-03T13:35:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/cap/cap_PNG5686.png",
    category: "hat",
    price: 35,
    review: 534,
    rating: 3.7,
    createdAt: "2024-06-08T15:20:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/hat/hat_PNG5701.png",
    category: "hat",
    price: 42,
    review: 891,
    rating: 4.6,
    createdAt: "2024-08-25T10:55:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/cap/cap_PNG5687.png",
    category: "hat",
    price: 28,
    review: 1234,
    rating: 4.2,
    createdAt: "2025-01-12T12:10:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/perfume/perfume_PNG99997.png",
    category: "perfume",
    price: 65,
    review: 2341,
    rating: 2.7,
    createdAt: "2022-12-05T14:00:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/perfume/perfume_PNG99996.png",
    category: "perfume",
    price: 95,
    review: 1876,
    rating: 4.9,
    createdAt: "2023-03-11T09:30:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/perfume/perfume_PNG99995.png",
    category: "perfume",
    price: 85,
    review: 1456,
    rating: 4.5,
    createdAt: "2023-06-27T16:15:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/perfume/perfume_PNG99993.png",
    category: "perfume",
    price: 72,
    review: 1123,
    rating: 4.4,
    createdAt: "2023-10-08T11:45:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/perfume/perfume_PNG99991.png",
    category: "perfume",
    price: 68,
    review: 987,
    rating: 2.6,
    createdAt: "2024-01-30T08:20:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/perfume/perfume_PNG99989.png",
    category: "perfume",
    price: 110,
    review: 756,
    rating: 4.8,
    createdAt: "2024-05-06T13:50:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/perfume/perfume_PNG99985.png",
    category: "perfume",
    price: 59,
    review: 834,
    rating: 4.3,
    createdAt: "2024-07-19T15:05:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/perfume/perfume_PNG10245.png",
    category: "perfume",
    price: 125,
    review: 2145,
    rating: 3.9,
    createdAt: "2024-10-02T10:40:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/thermos/thermos_PNG44.png",
    category: "thermos",
    price: 35,
    review: 3124,
    rating: 4.8,
    createdAt: "2022-10-18T12:25:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/thermos/thermos_PNG42.png",
    category: "thermos",
    price: 29,
    review: 1987,
    rating: 4.6,
    createdAt: "2023-02-22T14:10:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/thermos/thermos_PNG41.png",
    category: "thermos",
    price: 25,
    review: 1456,
    rating: 1.5,
    createdAt: "2023-05-09T09:00:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/thermos/thermos_PNG40.png",
    category: "thermos",
    price: 55,
    review: 876,
    rating: 4.7,
    createdAt: "2023-08-14T16:30:00.000Z",
    isFeatured: true,
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
    image: "https://pngimg.com/uploads/thermos/thermos_PNG39.png",
    category: "thermos",
    price: 32,
    review: 1678,
    rating: 4.4,
    createdAt: "2023-11-03T11:20:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/thermos/thermos_PNG35.png",
    category: "thermos",
    price: 22,
    review: 2345,
    rating: 3.3,
    createdAt: "2024-02-26T08:45:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/thermos/thermos_PNG31.png",
    category: "thermos",
    price: 42,
    review: 2891,
    rating: 4.9,
    createdAt: "2024-05-15T13:00:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/thermos/thermos_PNG25.png",
    category: "thermos",
    price: 28,
    review: 1765,
    rating: 4.5,
    createdAt: "2024-07-28T15:40:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/thermos/thermos_PNG16.png",
    category: "thermos",
    price: 65,
    review: 654,
    rating: 2.8,
    createdAt: "2024-09-16T10:15:00.000Z",
    isFeatured: false,
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
    image: "https://pngimg.com/uploads/thermos/thermos_PNG15.png",
    category: "thermos",
    price: 38,
    review: 1234,
    rating: 4.6,
    createdAt: "2025-02-01T12:50:00.000Z",
    isFeatured: false,
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
