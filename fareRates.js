// 運賃表データ（IC料金、2026年3月15日改定対応）
const fareRates = {
  "東京メトロ": [
    { max: 6, fare: 180 },
    { max: 11, fare: 210 },
    { max: 19, fare: 260 },
    { max: 27, fare: 310 },
    { max: 40, fare: 330 }
  ],
  
  "都営": [
    { max: 4, fare: 180 },
    { max: 8, fare: 220 },
    { max: 12, fare: 270 },
    { max: 20, fare: 320 },
    { max: 28, fare: 370 },
    { max: 40, fare: 430 }
  ],
  
  "JR": [
    { max: 3, fare: 155 },
    { max: 6, fare: 199 },
    { max: 10, fare: 209 },
    { max: 15, fare: 253 },
    { max: 20, fare: 297 },
    { max: 25, fare: 341 },
    { max: 30, fare: 440 },
    { max: 35, fare: 528 },
    { max: 40, fare: 616 }
  ],
  
  "京王": [
    { max: 4, fare: 136 },
    { max: 8, fare: 167 },
    { max: 12, fare: 209 },
    { max: 16, fare: 251 },
    { max: 20, fare: 293 },
    { max: 24, fare: 335 },
    { max: 28, fare: 377 },
    { max: 32, fare: 419 },
    { max: 36, fare: 461 },
    { max: 40, fare: 503 },
    { max: 50, fare: 545 }
  ],
  
  "小田急": [
    { max: 4, fare: 136 },
    { max: 8, fare: 178 },
    { max: 12, fare: 220 },
    { max: 16, fare: 262 },
    { max: 20, fare: 304 },
    { max: 24, fare: 346 },
    { max: 28, fare: 388 },
    { max: 32, fare: 430 },
    { max: 36, fare: 472 },
    { max: 40, fare: 514 }
  ],
  
  "東急": [
    { max: 3, fare: 136 },
    { max: 7, fare: 157 },
    { max: 11, fare: 199 },
    { max: 15, fare: 220 },
    { max: 19, fare: 262 },
    { max: 23, fare: 283 },
    { max: 27, fare: 325 },
    { max: 31, fare: 346 },
    { max: 40, fare: 388 }
  ],
  
  "西武": [
    { max: 4, fare: 169 },
    { max: 8, fare: 207 },
    { max: 12, fare: 245 },
    { max: 16, fare: 284 },
    { max: 20, fare: 323 },
    { max: 24, fare: 362 },
    { max: 28, fare: 402 },
    { max: 32, fare: 442 },
    { max: 36, fare: 483 },
    { max: 40, fare: 521 },
    { max: 44, fare: 557 },
    { max: 48, fare: 592 }
  ],
  
  "東武": [
    { max: 3, fare: 146 },
    { max: 7, fare: 178 },
    { max: 11, fare: 220 },
    { max: 15, fare: 262 },
    { max: 19, fare: 304 },
    { max: 23, fare: 346 },
    { max: 27, fare: 388 },
    { max: 31, fare: 430 },
    { max: 35, fare: 472 },
    { max: 39, fare: 514 },
    { max: 43, fare: 556 },
    { max: 47, fare: 598 }
  ],
  
  "多摩都市モノレール": [
    { max: 3, fare: 136 },
    { max: 6, fare: 157 },
    { max: 9, fare: 199 },
    { max: 12, fare: 220 },
    { max: 15, fare: 262 },
    { max: 20, fare: 283 }
  ],
  
  "つくばエクスプレス": [
    { max: 5, fare: 199 },
    { max: 10, fare: 241 },
    { max: 15, fare: 283 },
    { max: 20, fare: 325 },
    { max: 25, fare: 367 },
    { max: 30, fare: 409 },
    { max: 35, fare: 451 },
    { max: 40, fare: 493 },
    { max: 45, fare: 535 },
    { max: 50, fare: 577 },
    { max: 55, fare: 619 },
    { max: 60, fare: 661 }
  ]
};
