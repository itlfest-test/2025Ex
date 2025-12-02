// キャンパスデータ（最寄り駅と徒歩情報）
const campusData = [
  
  {
    name: "中央（市ヶ谷田町）",
    stations: [
      {
        station: "市ヶ谷",
        line: "有楽町線",
        door: "1号車1番ドア",
        exit: "6番出口",
        walkFromExit: 0,
        walkTotal: 2,
        note: "出口正面"
      },
      {
        station: "市ヶ谷",
        line: "南北線",
        door: "3号車3番ドア",
        exit: "6番出口",
        walkFromExit: 0,
        walkTotal: 2,
        note: "出口正面"
      },
      {
        station: "市ヶ谷",
        line: "都営新宿線",
        door: "5号車4番ドア",
        exit: "6番出口",
        walkFromExit: 0,
        walkTotal: 2,
        note: "出口正面"
      },
      {
        station: "市ヶ谷",
        line: "JR中央・総武線",
        door: "5号車2番ドア",
        exit: "市ヶ谷橋方面口",
        walkFromExit: 0,
        walkTotal: 3,
        note: "改札出て正面"
      }
    ]
  },

  {
    name: "中央（後楽園）",
    stations: [
      {
        station: "後楽園",
        line: "丸ノ内線",
        door: "5号車2番ドア",
        exit: "2番出口",
        walkFromExit: 1,
        walkTotal: 5,
        note: "春日通り沿い"
      },
      {
        station: "後楽園",
        line: "南北線",
        door: "3号車3番ドア",
        exit: "2番出口",
        walkFromExit: 1,
        walkTotal: 5,
        note: "春日通り沿い"
      },
      {
        station: "春日",
        line: "都営三田線",
        door: "6号車1番ドア",
        exit: "A2出口",
        walkFromExit: 1,
        walkTotal: 4,
        note: "春日通り沿い"
      },
      {
        station: "春日",
        line: "都営大江戸線",
        door: "4号車4番ドア",
        exit: "A2出口",
        walkFromExit: 1,
        walkTotal: 4,
        note: "春日通り沿い"
      }
    ]
  },
  {
    name: "中央（茗荷谷）",
    stations: [
      {
        station: "茗荷谷",
        line: "丸ノ内線",
        door: "5号車2番ドア",
        exit: "2番出口",
        walkFromExit: 1,
        walkTotal: 2,
        note: "左手大通り沿いすぐです"
      },
      {
        station: "江戸川橋",
        line: "有楽町線",
        door: "3号車2番ドア",
        exit: "4番出口",
        walkFromExit: 10,
        walkTotal: 12,
        note: "急坂です、推奨しません"
      }
    ]
  },
  {
    name: "中央（多摩）",
    stations: [
      {
        station: "中央大学・明星大学",
        line: "多摩都市モノレール",
        door: "不明",
        exit: "直結",
        walkFromExit: 0,
        walkTotal: 1,
        note: "右手すぐ、直結しています"
      },
      {
        station: "多摩動物公園",
        line: "京王動物園線",
        door: "最前部",
        exit: "出口",
        walkFromExit: 10,
        walkTotal: 12,
        note: "急坂のある山道です"
      },
      {
        station: "豊田",
        line: "中央線快速",
        door: "8号車3番ドア",
        exit: "南口",
        walkFromExit: 15,
        walkTotal: 20,
        note: "京王バス豊33系統が出ています"
      }
    ]
  },
  {
    "name": "理科大（神楽坂）",
    "stations": [
      {
        "station": "飯田橋",
        "line": "有楽町線",
        "door": "9号車4番ドア",
        "exit": "B3出口",
        "walkFromExit": "5分",
        "walkTotal": "6分",
        "note": "狭い階段です"
      },
      {
        "station": "飯田橋",
        "line": "南北線",
        "door": "1号車1番ドア",
        "exit": "B3出口",
        "walkFromExit": "5分",
        "walkTotal": "6分",
        "note": "狭い階段です"
      },
      {
        "station": "飯田橋",
        "line": "東西線",
        "door": "10号車4番ドア",
        "exit": "B3出口",
        "walkFromExit": "5分",
        "walkTotal": "10分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "飯田橋",
        "line": "中央・総武線各駅停車",
        "door": "5号車4番ドア",
        "exit": "西口改札",
        "walkFromExit": "5分",
        "walkTotal": "6分",
        "note": ""
      },
      {
        "station": "飯田橋",
        "line": "都営大江戸線",
        "door": "1号車1番ドア",
        "exit": "C1出口",
        "walkFromExit": "7分",
        "walkTotal": "10分",
        "note": "所要時間詳細不明"
      }
    ]
  },
  {
    "name": "理科大（葛飾）",
    "stations": [
      {
        "station": "金町",
        "line": "常磐緩行線",
        "door": "6号車2番ドア",
        "exit": "北口改札",
        "walkFromExit": "6分",
        "walkTotal": "8分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "京成金町",
        "line": "京成金町線",
        "door": "中央部",
        "exit": "出口",
        "walkFromExit": "6分",
        "walkTotal": "8分",
        "note": "所要時間詳細不明"
      }
    ]
  },
  {
    "name": "理科大（野田）",
    "stations": [
      {
        "station": "運河",
        "line": "東武アーバンパークライン",
        "door": "不明",
        "exit": "不明",
        "walkFromExit": "5分",
        "walkTotal": "5分",
        "note": "所要時間詳細不明"
      }
    ]
  },
  {
    "name": "法政（市ヶ谷）",
    "stations": [
      {
        "station": "飯田橋",
        "line": "有楽町線",
        "door": "9号車4番ドア",
        "exit": "B2a出口",
        "walkFromExit": "10分",
        "walkTotal": "10分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "飯田橋",
        "line": "南北線",
        "door": "1号車1番ドア",
        "exit": "B2a出口",
        "walkFromExit": "10分",
        "walkTotal": "10分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "飯田橋",
        "line": "東西線",
        "door": "10号車4番ドア",
        "exit": "A4出口",
        "walkFromExit": "10分",
        "walkTotal": "10分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "飯田橋",
        "line": "中央・総武線各駅停車",
        "door": "5号車4番ドア",
        "exit": "西口改札",
        "walkFromExit": "10分",
        "walkTotal": "10分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "飯田橋",
        "line": "都営大江戸線",
        "door": "不明",
        "exit": "不明",
        "walkFromExit": "10分",
        "walkTotal": "10分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "市ヶ谷",
        "line": "有楽町線",
        "door": "10号車4番ドア",
        "exit": "A1番出口",
        "walkFromExit": "10分",
        "walkTotal": "10分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "市ヶ谷",
        "line": "南北線",
        "door": "3号車4番ドア",
        "exit": "5番出口",
        "walkFromExit": "10分",
        "walkTotal": "10分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "市ヶ谷",
        "line": "都営新宿線",
        "door": "10号車4番ドア",
        "exit": "A4番出口",
        "walkFromExit": "10分",
        "walkTotal": "10分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "市ケ谷",
        "line": "中央・総武線各駅停車",
        "door": "9号車4番ドア",
        "exit": "出口",
        "walkFromExit": "10分",
        "walkTotal": "10分",
        "note": "所要時間詳細不明"
      }
    ]
  },
  {
    "name": "上智（四谷）",
    "stations": [
      {
        "station": "四ツ谷",
        "line": "中央線快速",
        "door": "高尾方面行：9号車3番ドア, 東京方面行：10号車2番ドア",
        "exit": "麹町口・赤坂口",
        "walkFromExit": "3分",
        "walkTotal": "5分",
        "note": ""
      },
      {
        "station": "四ツ谷",
        "line": "中央・総武線各駅停車",
        "door": "10号車4番ドア",
        "exit": "麹町口・赤坂口",
        "walkFromExit": "3分",
        "walkTotal": "5分",
        "note": ""
      },
      {
        "station": "四ツ谷",
        "line": "丸ノ内線",
        "door": "1号車1番ドア",
        "exit": "麹町口・赤坂口",
        "walkFromExit": "3分",
        "walkTotal": "5分",
        "note": ""
      },
      {
        "station": "四ツ谷",
        "line": "南北線",
        "door": "6号車4番ドア",
        "exit": "麹町口・赤坂口",
        "walkFromExit": "3分",
        "walkTotal": "5分",
        "note": ""
      }
    ]
  },
  {
    "name": "日本（水道橋）",
    "stations": [
      {
        "station": "水道橋",
        "line": "中央・総武線各駅停車",
        "door": "不明",
        "exit": "不明",
        "walkFromExit": "3分",
        "walkTotal": "4分",
        "note": ""
      },
      {
        "station": "水道橋",
        "line": "都営三田線",
        "door": "不明",
        "exit": "不明",
        "walkFromExit": "3分",
        "walkTotal": "4分",
        "note": ""
      },
      {
        "station": "神保町",
        "line": "半蔵門線",
        "door": "不明",
        "exit": "不明",
        "walkFromExit": "5分",
        "walkTotal": "5分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "神保町",
        "line": "都営三田線",
        "door": "不明",
        "exit": "不明",
        "walkFromExit": "5分",
        "walkTotal": "5分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "神保町",
        "line": "都営新宿線",
        "door": "不明",
        "exit": "不明",
        "walkFromExit": "5分",
        "walkTotal": "5分",
        "note": "所要時間詳細不明"
      }
    ]
  },
  {
    "name": "明治（明大前）",
    "stations": [
      {
        "station": "明大前",
        "line": "京王線",
        "door": "8両の時3号車4番ドア, 10両の時4号車4番ドア",
        "exit": "出口",
        "walkFromExit": "5分",
        "walkTotal": "5分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "明大前",
        "line": "京王井の頭線",
        "door": "5号車2番ドア",
        "exit": "出口",
        "walkFromExit": "5分",
        "walkTotal": "5分",
        "note": "所要時間詳細不明"
      }
    ]
  },
  {
    "name": "東京（駒場）",
    "stations": [
      {
        "station": "駒場東大前",
        "line": "京王井の頭線",
        "door": "1号車1番ドア",
        "exit": "東口（北）",
        "walkFromExit": "1分",
        "walkTotal": "3分",
        "note": "ほぼ直結です"
      }
    ]
  },
  {
    "name": "早稲田（文）",
    "stations": [
      {
        "station": "早稲田",
        "line": "東西線",
        "door": "10号車4番ドア",
        "exit": "3番出口",
        "walkFromExit": "5分",
        "walkTotal": "5分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "早稲田",
        "line": "都電荒川線",
        "door": "どの乗車位置でも可",
        "exit": "出口",
        "walkFromExit": "5分",
        "walkTotal": "5分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "早大正門",
        "line": "都営バス",
        "door": "前乗後降",
        "exit": "-",
        "walkFromExit": "0分",
        "walkTotal": "0分",
        "note": "池袋駅・渋谷駅直行"
      }
    ]
  },
  {
    "name": "早稲田（理工）",
    "stations": [
      {
        "station": "西早稲田",
        "line": "副都心線",
        "door": "8両の時8号車4番ドア, 10両の時10号車4番ドア",
        "exit": "3番出口",
        "walkFromExit": "0分",
        "walkTotal": "0分",
        "note": "西早稲田駅直結"
      }
    ]
  },
  {
    "name": "東京科学（湯島）",
    "stations": [
      {
        "station": "御茶ノ水",
        "line": "中央線快速",
        "door": "10号車4番ドア",
        "exit": "御茶ノ水橋口",
        "walkFromExit": "5分",
        "walkTotal": "5分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "御茶ノ水",
        "line": "中央・総武線各駅停車",
        "door": "10号車4番ドア",
        "exit": "御茶ノ水橋口",
        "walkFromExit": "5分",
        "walkTotal": "5分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "御茶ノ水",
        "line": "丸ノ内線",
        "door": "1号車1番ドア",
        "exit": "1番出口",
        "walkFromExit": "5分",
        "walkTotal": "5分",
        "note": "所要時間詳細不明"
      },
      {
        "station": "新御茶ノ水",
        "line": "千代田線",
        "door": "10号車4番ドア",
        "exit": "B1出口",
        "walkFromExit": "5分",
        "walkTotal": "5分",
        "note": "所要時間詳細不明"
      }
    ]
  },
  {
    "name": "東京科学（大岡山）",
    "stations": [
      {
        "station": "大岡山",
        "line": "東急目黒線",
        "door": "1号車1番ドア",
        "exit": "南口",
        "walkFromExit": "1分",
        "walkTotal": "3分",
        "note": ""
      },
      {
        "station": "大岡山",
        "line": "東急大井町線",
        "door": "1号車1番ドア",
        "exit": "南口",
        "walkFromExit": "1分",
        "walkTotal": "3分",
        "note": ""
      }
    ]
  },
  {
    "name": "武蔵野美術（鷹の台）",
    "stations": [
      {
        "station": "鷹の台",
        "line": "西武国分寺線",
        "door": "東村山行：2号車3番ドア, 国分寺行早朝深夜帯：4号車1番ドア, 国分寺行日中時間帯：4号車3番ドア",
        "exit": "出口",
        "walkFromExit": "18分",
        "walkTotal": "18分",
        "note": "所要時間詳細不明"
      }
    ]
  }
];
