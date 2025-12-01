// festivals.js - 学祭情報データ
const festivals = [
  {
    university: "中央大学",
    campus: "市谷田町キャンパス",
    festivalName: "iTLFest. 2025",
    number: "第7回",
    dates: "2025年11月1日(土)〜2日(日)",
    highlight: "お笑いライブ2025",
    message: "中央大学最新学部の学園祭！お笑いライブや最新AI技術の展示など、新しい試みが盛りだくさんです！ぜひお越しください！",
    url: "https://itl-festival.jp" // 仮URL
  },
  {
    university: "中央大学",
    campus: "後楽園キャンパス",
    festivalName: "理工白門祭",
    number: "第61回",
    dates: "2025年11月1日(土)〜2日(日)",
    highlight: "サイエンスショー、びっくり空気砲ワークショップ",
    message: "えびちゃん先生のサイエンスショーやらんま先生のワークショップなど、科学を楽しく学べる企画が満載！理工学部の魅力を体感しよう！",
    url: "https://rikohakumon.com" // 仮URL
  },
  {
    university: "中央大学",
    campus: "茗荷谷キャンパス",
    festivalName: "茗荷谷祭",
    number: "第59回",
    dates: "2025年11月1日(土)〜2日(日)",
    highlight: "ストリートピアノ、防災縁日",
    message: "ストリートピアノで自由に演奏できます！防災縁日では遊びながら防災を学べる企画もご用意。ぜひご家族でお越しください！",
    url: "" // URL不明
  },
  {
    university: "中央大学",
    campus: "多摩キャンパス",
    festivalName: "白門祭",
    number: "", // 回数不明
    dates: "2025年10月31日(金)〜11月3日(月・祝)",
    highlight: "はくもっけんグッズ販売、大型ステージ企画",
    message: "中央大学最大規模の学園祭！広大なキャンパスで4日間開催。公式キャラクター「はくもっけん」に会えるチャンスも！",
    url: "https://hakumonsai.jp"
  },
  {
    university: "東京理科大学",
    campus: "神楽坂キャンパス",
    festivalName: "理大祭",
    number: "第77回",
    dates: "2025年11月22日(土)〜23日(日・祝)",
    highlight: "お笑いライブ、TUS AMBASSADOR CONTEST",
    message: "バンドとダンスのライブ、コスプレコンテストなど盛りだくさん！理科大の研究を覗ける研究室ツアーも人気です！",
    url: "https://kagurazaka.ridaisai.com"
  },
  {
    university: "東京理科大学",
    campus: "葛飾キャンパス",
    festivalName: "葛飾地区理大祭",
    number: "第13回",
    dates: "2025年11月22日(土)〜23日(日・祝)",
    highlight: "食販企画",
    message: "各部・研究室伝統のフランクフルトや水餃子など、美味しい企画が勢揃い！理工学の展示もお楽しみに！",
    url: "https://katsushika.ridaisai.com"
  },
  {
    university: "東京理科大学",
    campus: "野田キャンパス",
    festivalName: "野田地区理大祭",
    number: "第77回",
    dates: "2025年11月22日(土)〜23日(日・祝)",
    highlight: "中庭ステージ、TUS-1グランプリ",
    message: "広い中庭でのステージパフォーマンスは圧巻！ペットボトルロケットを作って飛ばそう。ご家族でお楽しみください！",
    url: "https://noda.ridaisai.com"
  },
  {
    university: "法政大学",
    campus: "市ヶ谷キャンパス",
    festivalName: "自主法政祭",
    number: "第78回",
    dates: "2025年10月31日(金)〜11月3日(月・祝)",
    highlight: "公式グッズショップ、能楽公演、手話広場",
    message: "えこぴょんグッズやHOSEIパーカーが買える公式ショップは必見！伝統の能楽公演から現代アカペラまで幅広く楽しめます！",
    url: "https://jishuhoseisai.com"
  },
  {
    university: "日本大学",
    campus: "法学部（水道橋）",
    festivalName: "法桜祭",
    number: "第46回",
    dates: "2025年11月3日(月・祝)〜4日(火)",
    highlight: "各種出し物",
    message: "お化け屋敷やカジノパークなど、アトラクション系企画が充実！法学部ならではの模擬裁判も必見です！",
    url: "" // URL不明
  },
  {
    university: "上智大学",
    campus: "四谷キャンパス",
    festivalName: "SOPHIA FESTIVAL",
    number: "", // 回数不明
    dates: "2025年11月1日(土)〜4日(火)",
    highlight: "Sophian's Got Talent、Sophian's Contest",
    message: "新たなスターを発掘するオーディションは見逃せない！教授による模擬授業で上智の学びを体験できます！",
    url: "https://sophiafestival.jp"
  },
  {
    university: "明治大学",
    campus: "和泉キャンパス",
    festivalName: "生明祭",
    number: "第141回",
    dates: "2025年11月1日(土)〜3日(月・祝)",
    highlight: "ギターサークルメインストリートステージ",
    message: "豊富な種類の飲食物で一息つきながら、ライブやバンド演奏をお楽しみください！音楽が溢れるキャンパスへようこそ！",
    url: "https://seimeisai.com"
  },
  {
    university: "東京大学",
    campus: "駒場キャンパス",
    festivalName: "駒場祭",
    number: "第76回",
    dates: "2025年11月22日(土)〜24日(月・振休)",
    highlight: "RRL: Reality Rebuild Lab, IoT超入門！マイコン体感ゼミ",
    message: "これからの時代を生きる中で学びになる内容が盛りだくさん！ぜひお越しください！",
    url: "https://komabasai.net"
  },
  {
    university: "早稲田大学",
    campus: "早稲田キャンパス",
    festivalName: "早稲田祭",
    number: "", // 回数不明
    dates: "2025年11月1日(土)〜2日(日)",
    highlight: "各種学術展示、サークルパフォーマンス",
    message: "話題の「イオンモール偏差値表」展示や体験型謎解きゲームなど、知的好奇心を刺激する企画が満載です！",
    url: "https://wasedasai.net"
  },
  {
    university: "早稲田大学",
    campus: "西早稲田キャンパス",
    festivalName: "理工展",
    number: "第72回",
    dates: "2025年11月1日(土)〜2日(日)",
    highlight: "河野玄斗トークショー",
    message: "河野玄斗さんのスペシャルトークショーは必見！コップロケット製作やプラネタリウムで宇宙を身近に感じよう！",
    url: "https://rikoten.com"
  },
  {
    university: "東京科学大学",
    campus: "湯島キャンパス",
    festivalName: "お茶の水祭",
    number: "", // 回数不明
    dates: "2025年10月18日(土)〜19日(日)",
    highlight: "芸人ステージ、医歯学系模擬講義",
    message: "人気芸人3組のスペシャルライブと医歯学系の模擬講義で、笑いと学びを両方体験できます！受験生必見の相談会も開催！",
    url: "" // URL不明
  },
  {
    university: "東京科学大学",
    campus: "大岡山キャンパス",
    festivalName: "工大祭2025 Bloom",
    number: "", // 回数不明
    dates: "2025年11月2日(日)〜3日(月・祝)",
    highlight: "CCCレモン（小児がん支援）",
    message: "小児がん研究支援のCCCレモンや各国の料理を楽しみながら、最先端の科学技術に触れられます！",
    url: "https://koudaisai.jp"
  },
  {
    university: "武蔵野美術大学",
    campus: "鷹の台キャンパス",
    festivalName: "芸術祭",
    number: "", // 回数不明
    dates: "2025年10月24日(金)〜26日(日)",
    highlight: "各学科による作品展示",
    message: "油絵と彫刻が融合する「Unframed」展は必見！学生一人ひとりの「人柄」が作品に表れた展示をお楽しみください！",
    url: "https://mau-geisai.com"
  }
];

// グローバルに公開
window.FESTIVAL_DATA = festivals;
