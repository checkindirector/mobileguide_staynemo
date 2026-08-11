(function () {
  const L = (ko, en, ja, zh) => ({ ko, en, ja, zh });

  window.STAY_NEMO_CONFIG = {
    otaLinks: {
      airbnb: null,
      booking: null,
      agoda: null,
      trip: null
    },
    maps: {
      naver: 'https://map.naver.com/p/entry/address/3zihYH,2AM0Fm,%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EC%A4%91%EA%B5%AC%20%EC%9D%84%EC%A7%80%EB%A1%9C3%EA%B0%80%20291-37?c=15.00,0,0,0,dh',
      google: 'https://www.google.co.kr/maps/place/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C+%EC%A4%91%EA%B5%AC+%EC%9D%84%EC%A7%80%EB%A1%9C3%EA%B0%80+291-37/data=!3m1!4b1!4m6!3m5!1s0x357ca2e3e0364611:0x302eecf11346acf6!8m2!3d37.5655962!4d126.9929351!16s%2Fg%2F11bzdm7t9m'
    }
  };

  window.STAY_NEMO_DATA = {
    translations: {
      heroEyebrow: L('SEOUL PRIVATE STAY', 'SEOUL PRIVATE STAY', 'SEOUL PRIVATE STAY', 'SEOUL PRIVATE STAY'),
      heroLine: L('네모난 방, 둥글게 모이는 우리', 'Square rooms, a circle of us', '四角い部屋で、輪になる私たち', '方正的房间，团聚的我们'),
      conciergeKicker: L('STAY NEMO CONCIERGE', 'STAY NEMO CONCIERGE', 'STAY NEMO CONCIERGE', 'STAY NEMO CONCIERGE'),
      conciergeTitle: L('무엇을 도와드릴까요?', 'How can we help?', '何をお探しですか？', '需要什么帮助？'),
      conciergePlaceholder: L('체크인, 교통, Wi-Fi를 검색해 보세요', 'Search check-in, transport, Wi-Fi', 'チェックイン・交通・Wi-Fiを検索', '搜索入住、交通或 Wi-Fi'),
      searchNoResult: L('정확한 안내를 찾지 못했습니다.', 'We could not find an exact guide.', '該当する案内が見つかりませんでした。', '未找到准确指南。'),
      searchContact: L('예약 플랫폼 메시지로 호스트에게 문의해 주세요.', 'Please message the host through your booking platform.', '予約サイトのメッセージでホストへお問い合わせください。', '请通过预订平台消息联系房东。'),
      appliancesShort: L('시설 이용', 'Facilities', '設備利用', '设施使用'),
      frequentTitle: L('투숙 중 자주 찾는 정보', 'Frequently needed during your stay', '滞在中によく使う案内', '入住期间常用信息'),
      rulesShort: L('숙소 이용 안내', 'House guide', '宿泊ルール', '住宿指南'),
      viewSpace: L('공간 보기', 'View the space', '空間を見る', '查看空间'), guestGuide: L('이용 안내', 'Guest guide', 'ご利用案内', '住宿指南'),
      welcomeTitle: L('아무도 아닌 여행자에서<br>소중한 누군가로', 'From a nameless traveler<br>to someone who matters', '名もない旅人から<br>大切な誰かへ', '从无名的旅人<br>成为珍贵的某个人'),
      welcomeBody: L('라틴어 ‘Nemo’는 아무도 아닌 사람을 뜻합니다. 낯선 도시에서 이 문을 여는 순간, 스테이 네모는 당신을 가장 소중한 누군가로 맞이합니다.', 'In Latin, “Nemo” means nobody. The moment you open this door in an unfamiliar city, Stay NEMO welcomes you as someone who truly matters.', 'ラテン語の「Nemo」は「誰でもない人」。見知らぬ街でこの扉を開けた瞬間、Stay NEMOはあなたを大切な「誰か」として迎えます。', '拉丁语“Nemo”意为“无名之人”。在陌生城市推开这扇门的瞬间，Stay NEMO 会把你当作最珍贵的“某个人”来迎接。'),
      essentialsLabel: L('STAY ESSENTIALS', 'STAY ESSENTIALS', 'STAY ESSENTIALS', 'STAY ESSENTIALS'), essentialsTitle: L('도착부터 퇴실까지', 'From arrival to departure', '到着からチェックアウトまで', '从抵达到退房'),
      checkin: L('체크인', 'Check-in', 'チェックイン', '入住'), checkout: L('체크아웃', 'Check-out', 'チェックアウト', '退房'), station: L('가까운 역', 'Nearest station', '最寄り駅', '最近地铁站'), stationValue: L('을지로3가', 'Euljiro 3-ga', '乙支路3街', '乙支路3街'), wifiValue: L('바로 연결', 'Connect now', 'すぐ接続', '立即连接'),
      privateTitle: L('한 층 전체가<br>우리만의 공간', 'A whole floor,<br>entirely yours', 'ワンフロアすべてが<br>私たちだけの空間', '整层空间<br>只属于我们'),
      privateBody: L('객실 하나가 곧 층 하나. 옆방과 복도를 다른 투숙객과 나누지 않아 최대 10인의 가족과 친구들이 온전히 함께 머뭅니다.', 'One booking means one whole floor. With no neighboring guest rooms or shared corridor, up to 10 family members and friends can stay entirely together.', '1組の予約でワンフロアを丸ごと利用。隣室や廊下を他のゲストと共有せず、最大10名の家族や友人だけで過ごせます。', '一组客人独享整层，无需与其他住客共享邻室或走廊，最多 10 位家人朋友可自在相聚。'),
      people: L('최대 인원', 'Guests', '最大人数', '最多入住'), beds: L('퀸 베드', 'Queen beds', 'クイーンベッド', '大床'), bathrooms: L('욕실', 'Bathrooms', 'バスルーム', '浴室'),
      roomTitle: L('함께, 그리고 편안하게', 'Together, in comfort', '一緒に、心地よく', '相聚，且舒适'), viewAll: L('전체 보기', 'View all', 'すべて見る', '查看全部'), nemoRoom: L('퀸 베드 2', '2 queen beds', 'クイーンベッド2台', '2 张大床'), hadaRoom: L('퀸 베드 3', '3 queen beds', 'クイーンベッド3台', '3 张大床'),
      locationTitle: L('서울의 모든 길목,<br>을지로3가', 'At the crossroads<br>of Seoul', 'ソウルをつなぐ街、<br>乙支路3街', '首尔交通枢纽，<br>乙支路3街'), locationBody: L('2호선과 3호선이 만나는 역 가까이. 명동과 청계천은 걸어서, 경복궁과 강남은 환승 없이 닿습니다.', 'Close to the junction of Lines 2 and 3. Walk to Myeongdong and Cheonggyecheon, or ride directly to Gyeongbokgung and Gangnam.', '2号線と3号線が交わる駅のすぐ近く。明洞・清渓川は徒歩で、景福宮・江南へは乗り換えなしでアクセスできます。', '靠近地铁 2、3 号线交汇站。步行可到明洞和清溪川，前往景福宫与江南无需换乘。'), directions: L('오시는 길', 'Directions', 'アクセス', '交通指南'),
      otaTitle: L('곧 예약이 열립니다', 'Booking opens soon', 'まもなく予約開始', '即将开放预订'), otaBody: L('예약 플랫폼 등록을 준비하고 있습니다. 버튼은 링크가 연결되는 즉시 활성화됩니다.', 'Our booking pages are being prepared. Each button will activate as soon as its link is connected.', '予約サイトを準備中です。リンク接続後、各ボタンが有効になります。', '预订平台正在准备中，链接接入后按钮将立即启用。'),
      address: L('서울시 중구 을지로3가 291-37 · 3층', '3F, 291-37 Euljiro 3-ga, Jung-gu, Seoul', 'ソウル特別市中区乙支路3街291-37・3階', '首尔特别市中区乙支路3街 291-37 · 3层'), contactHost: L('호스트에게 문의하기', 'Contact the host', 'ホストに問い合わせる', '联系房东'),
      guideTitle: L('필요한 순간에<br>바로 찾는 안내', 'The right guide,<br>right when you need it', '必要なときに<br>すぐ見つかる案内', '需要时<br>立即找到答案'), guideBody: L('도착, 머무는 동안, 그리고 퇴실까지 꼭 필요한 내용을 모았습니다.', 'Everything you need for arrival, your stay, and departure.', '到着から滞在中、チェックアウトまで必要な情報をまとめました。', '汇集抵达、住宿期间及退房所需的所有信息。'),
      galleryTitle: L('우리만의 한 층', 'A floor of our own', '私たちだけのワンフロア', '只属于我们的整层空间'), galleryBody: L('두 개의 침실과 다이닝 공간을 사진으로 둘러보세요.', 'Explore two bedrooms and the dining space.', '2つのベッドルームとダイニングをご覧ください。', '通过照片探索两间卧室与用餐空间。'), all: L('전체', 'All', 'すべて', '全部'), common: L('공용 공간', 'Living space', '共用空間', '公共空间'),
      checkinGuide: L('체크인 안내', 'Check-in guide', 'チェックイン案内', '入住指南'), checkoutGuide: L('체크아웃 안내', 'Check-out guide', '退室案内', '退房指南'), transportTitle: L('오시는 길', 'Getting here', 'アクセス', '交通指南'), rulesTitle: L('모두가 편안한<br>머무름을 위해', 'For a comfortable<br>stay for everyone', 'みんなが心地よく<br>過ごすために', '为了每个人<br>舒适入住'),
      appliancesTitle: L('가전·시설 안내', 'Appliances & facilities', '家電・設備案内', '家电与设施指南'), appliancesBody: L('숙소 안 기기를 쉽고 안전하게 사용하세요.', 'Use every device easily and safely.', '室内の機器を安全にご利用ください。', '轻松安全地使用房内设备。'), contactTitle: L('도움이 필요하신가요?', 'Need a little help?', 'お困りですか？', '需要帮助吗？'),
      home: L('홈', 'Home', 'ホーム', '首页'), gallery: L('공간', 'Space', '空間', '空间'), guide: L('안내', 'Guide', '案内', '指南'), location: L('위치', 'Location', 'アクセス', '位置'), contact: L('문의', 'Contact', 'お問い合わせ', '联系'),
      drawerLine: L('네모난 방, 둥글게 모이는 우리', 'Square rooms, a circle of us', '四角い部屋で、輪になる私たち', '方正的房间，团聚的我们'),
      readySoon: L('예약 페이지를 준비하고 있습니다.', 'The booking page is being prepared.', '予約ページを準備中です。', '预订页面正在准备中。'), copied: L('복사했습니다.', 'Copied.', 'コピーしました。', '已复制。')
    },
    menu: [
      ['home', 'home', 'home'], ['gallery', 'photo_library', 'gallery'], ['guide', 'menu_book', 'guide'], ['checkin', 'login', 'checkinGuide'], ['checkout', 'logout', 'checkoutGuide'], ['wifi', 'wifi', 'Wi-Fi'], ['transport', 'map', 'transportTitle'], ['rules', 'policy', 'rulesTitle'], ['appliances', 'devices', 'appliancesTitle'], ['contact', 'chat_bubble', 'contactTitle']
    ],
    guideCards: [
      { route:'checkin', icon:'login', title:L('체크인', 'Check-in', 'チェックイン', '入住'), text:L('16:00 · 비대면 도어락', '16:00 · Self check-in', '16:00・セルフチェックイン', '16:00 · 自助入住'), color:'mustard' },
      { route:'checkout', icon:'logout', title:L('체크아웃', 'Check-out', 'チェックアウト', '退房'), text:L('11:00 · 퇴실 체크리스트', '11:00 · Departure checklist', '11:00・退室チェック', '11:00 · 退房清单'), color:'cream' },
      { route:'wifi', icon:'wifi', title:L('Wi-Fi', 'Wi-Fi', 'Wi-Fi', 'Wi-Fi'), text:L('네트워크와 비밀번호 복사', 'Copy network & password', 'ネットワークをコピー', '复制网络与密码'), color:'dark' },
      { route:'transport', icon:'subway', title:L('교통·위치', 'Transport', '交通・位置', '交通与位置'), text:L('을지로3가역에서 찾아오기', 'From Euljiro 3-ga Station', '乙支路3街駅から', '从乙支路3街站前往'), color:'brown' },
      { route:'rules', icon:'policy', title:L('숙소 규칙', 'House rules', 'ハウスルール', '住宿规则'), text:L('금연 · 매너타임 · 취사', 'No smoking · Quiet hours · Cooking', '禁煙・静粛時間・調理', '禁烟 · 安静时间 · 烹饪'), color:'cream' },
      { route:'appliances', icon:'devices', title:L('가전·시설', 'Appliances', '家電・設備', '家电设施'), text:L('TV · 냉난방 · 세탁 · 주방', 'TV · Climate · Laundry · Kitchen', 'TV・空調・洗濯・キッチン', '电视 · 空调 · 洗衣 · 厨房'), color:'mustard' },
      { route:'gallery', icon:'photo_library', title:L('공간 둘러보기', 'Explore the space', '空間を見る', '查看空间'), text:L('공용부와 두 개의 침실', 'Living space & two bedrooms', '共用部と2つの寝室', '公共空间与两间卧室'), color:'brown' },
      { route:'contact', icon:'chat_bubble', title:L('호스트 문의', 'Contact host', 'ホストに連絡', '联系房东'), text:L('예약 플랫폼 메시지 이용', 'Use your booking platform message', '予約サイトのメッセージを利用', '通过预订平台消息联系'), color:'dark' }
    ],
    gallery: [
      ['hero-main-professional.webp','common',L('다이닝 라운지', 'Dining lounge', 'ダイニングラウンジ', '用餐休闲区')],
      ['hero-sub-professional.webp','common',L('주방과 다이닝', 'Kitchen & dining', 'キッチン＆ダイニング', '厨房与餐厅')],
      ['common-01.webp','common',L('공용 공간', 'Living space', '共用空間', '公共空间')],
      ['common-02.webp','common',L('함께 머무는 자리', 'A place to gather', '集う場所', '相聚之处')],
      ['common-03.webp','common',L('프라이빗 라운지', 'Private lounge', 'プライベートラウンジ', '私人休闲区')],
      ['common-05.webp','common',L('주방 디테일', 'Kitchen details', 'キッチンのディテール', '厨房细节')],
      ['common-06.webp','common',L('따뜻한 조명', 'Warm lighting', '温かな照明', '温暖灯光')],
      ['room-nemo-01.webp','nemo',L('NEMO · 퀸 베드 2', 'NEMO · 2 queen beds', 'NEMO・クイーン2台', 'NEMO · 2 张大床')],
      ['room-nemo-03.webp','nemo',L('NEMO 룸', 'NEMO room', 'NEMOルーム', 'NEMO 房间')],
      ['room-nemo-06.webp','nemo',L('NEMO 휴식 공간', 'NEMO resting space', 'NEMOのくつろぎ', 'NEMO 休息空间')],
      ['room-nemo-02.webp','nemo',L('NEMO 침실', 'NEMO bedroom', 'NEMO ベッドルーム', 'NEMO 卧室')],
      ['room-nemo-04.webp','nemo',L('NEMO 침실 디테일', 'NEMO bedroom detail', 'NEMO 寝室のディテール', 'NEMO 卧室细节')],
      ['room-nemo-05.webp','nemo',L('NEMO 객실', 'NEMO room view', 'NEMO 客室', 'NEMO 客房')],
      ['room-nemo-07.webp','nemo',L('NEMO 휴식', 'NEMO rest area', 'NEMO くつろぎ', 'NEMO 休息区')],
      ['room-nemo-08.webp','nemo',L('NEMO 공간', 'NEMO space', 'NEMO 空間', 'NEMO 空间')],
      ['room-nemo-09.webp','nemo',L('NEMO 수납 공간', 'NEMO storage', 'NEMO 収納', 'NEMO 收纳空间')],
      ['room-nemo-10.webp','nemo',L('NEMO 객실 디테일', 'NEMO room detail', 'NEMO 客室のディテール', 'NEMO 客房细节')],
      ['room-nemo-11.webp','nemo',L('NEMO 디테일', 'NEMO details', 'NEMOのディテール', 'NEMO 细节')],
      ['room-nemo-12.webp','nemo',L('NEMO 전경', 'NEMO overview', 'NEMO 全景', 'NEMO 全景')],
      ['room-hada-01.webp','hada',L('HADA · 퀸 베드 3', 'HADA · 3 queen beds', 'HADA・クイーン3台', 'HADA · 3 张大床')],
      ['room-hada-02.webp','hada',L('HADA 침실', 'HADA bedroom', 'HADA ベッドルーム', 'HADA 卧室')],
      ['room-hada-03.webp','hada',L('HADA 룸', 'HADA room', 'HADAルーム', 'HADA 房间')],
      ['room-hada-04.webp','hada',L('HADA 객실', 'HADA room view', 'HADA 客室', 'HADA 客房')],
      ['room-hada-05.webp','hada',L('HADA 디테일', 'HADA details', 'HADAのディテール', 'HADA 细节')],
      ['room-hada-06.webp','hada',L('HADA 전경', 'HADA overview', 'HADA 全景', 'HADA 全景')]
    ],
    content: {
      checkin: [
        { type:'notice', title:L('체크인 16:00', 'Check-in 16:00', 'チェックイン 16:00', '入住 16:00'), text:L('개인 출입번호는 체크인 당일 15:00에 예약 플랫폼 메시지로 안내됩니다.', 'Your personal entry code is sent through your booking platform at 15:00 on check-in day.', '個人用入室番号はチェックイン当日15:00に予約サイトのメッセージで届きます。', '个人入门密码将在入住当日 15:00 通过预订平台消息发送。') },
        { type:'steps', title:L('건물 입구에서 객실까지', 'From the building entrance', '建物入口から客室まで', '从楼门到房间'), items:[L('1층 록갈비와 은성농원 사이 골목의 유리문으로 들어오세요.', 'Enter the glass door in the alley between Rokgalbi and Eunseong Nongwon.', '1階のロクカルビとウンソン農園の間の路地にあるガラス扉から入ります。', '从 1 层 Rokgalbi 与 Eunseong Nongwon 之间小巷的玻璃门进入。'),L('엘리베이터를 이용해 3층으로 올라오세요.', 'Take the elevator to the 3rd floor.', 'エレベーターで3階へ上がります。', '乘电梯到 3 层。'),L('엘리베이터에서 내린 뒤 왼쪽 출입문이 스테이 네모입니다.', 'After exiting the elevator, the door on your left is Stay NEMO.', 'エレベーターを降りて左側の扉がStay NEMOです。', '出电梯后左侧门即是 Stay NEMO。')] },
        { type:'photo', image:'building-entrance.webp', title:L('1층 입구', 'Ground-floor entrance', '1階入口', '1层入口') },
        { type:'card', icon:'luggage', title:L('짐 보관', 'Luggage storage', '荷物預かり', '行李寄存'), text:L('체크인 전에는 3층 엘리베이터 옆 공간에 보관할 수 있습니다. 체크아웃 후 보관은 반드시 사전에 협의해 주세요.', 'Before check-in, luggage may be left beside the 3rd-floor elevator. Storage after check-out requires advance agreement.', 'チェックイン前は3階エレベーター横に保管できます。チェックアウト後は事前相談が必要です。', '入住前可寄存在 3 层电梯旁。退房后寄存需提前协商。') }
      ],
      checkout: [
        { type:'steps', title:L('퇴실 전 체크리스트', 'Before you leave', '退室前チェック', '退房前清单'), items:[L('개인 OTT 계정에서 로그아웃해 주세요.', 'Log out of your personal streaming accounts.', '個人の動画配信アカウントからログアウトしてください。', '请退出个人流媒体账号。'),L('사용한 그릇과 컵은 설거지해 주세요.', 'Wash used dishes and cups.', '使用した食器とカップを洗ってください。', '请清洗使用过的餐具和杯子。'),L('사용한 수건은 Return Box에 넣어 주세요.', 'Place used towels in the Return Box.', '使用済みタオルはReturn Boxへ入れてください。', '请将用过的毛巾放入 Return Box。'),L('창문을 닫고 입구의 일괄소등 스위치를 꺼 주세요.', 'Close the windows and turn off the master light switch by the entrance.', '窓を閉め、入口の一括消灯スイッチを切ってください。', '关闭窗户，并关闭入口处总灯开关。'),L('현관문이 잠겼는지 마지막으로 확인해 주세요.', 'Make sure the front door is locked.', '玄関ドアの施錠を確認してください。', '最后确认房门已锁。')] },
        { type:'card', icon:'delete', title:L('쓰레기 정리', 'Waste', 'ごみの分別', '垃圾整理'), text:L('재활용품은 투명 봉투, 일반 쓰레기는 일반 봉투, 음식물은 물기를 빼 전용 봉투에 담아 싱크볼에 두어 주세요.', 'Place recyclables in a clear bag, general waste in a regular bag, and drained food waste in its dedicated bag in the sink.', '資源ごみは透明袋、一般ごみは一般袋、生ごみは水気を切って専用袋に入れ、シンクに置いてください。', '可回收物放透明袋，一般垃圾放普通袋，厨余沥水后放专用袋并置于水槽中。') },
        { type:'notice', title:L('얼리 체크인·레이트 체크아웃', 'Early check-in & late check-out', 'アーリーチェックイン・レイトチェックアウト', '提前入住与延迟退房'), text:L('둘 중 한 가지만 이용할 수 있으며, 반드시 사전에 호스트와 협의해야 합니다.', 'Only one of these options may be available, and it must be arranged with the host in advance.', 'どちらか一方のみ利用でき、必ず事前にホストと相談してください。', '两项中仅可选择一项，且必须提前与房东协商。') }
      ],
      wifi: [
        { type:'wifi', title:'SK_98D4_5G', password:'CKA13@3310', label:L('빠른 5GHz 네트워크', 'Faster 5GHz network', '高速5GHzネットワーク', '高速 5GHz 网络') },
        { type:'wifi', title:'SK_98D4_2.4G', password:'CKA13@3310', label:L('연결 범위가 넓은 2.4GHz', 'Wider-range 2.4GHz', '広範囲の2.4GHz', '覆盖更广的 2.4GHz') },
        { type:'card', icon:'router', title:L('공유기 위치', 'Router location', 'ルーターの場所', '路由器位置'), text:L('거실 벽걸이 TV 뒤에 매립되어 있습니다. 연결되지 않으면 호스트에게 메시지를 보내 주세요.', 'The router is installed behind the living-room wall-mounted TV. If you cannot connect, message the host.', 'リビングの壁掛けテレビ裏に設置されています。接続できない場合はホストへご連絡ください。', '路由器安装在客厅壁挂电视后方。如无法连接，请给房东留言。') }
      ],
      transport: [
        { type:'destination', title:'STAY NEMO', address:L('서울시 중구 을지로3가 291-37 · 3층', '3F, 291-37 Euljiro 3-ga, Jung-gu, Seoul', 'ソウル特別市中区乙支路3街291-37・3階', '首尔特别市中区乙支路3街 291-37 · 3层') },
        { type:'steps', title:L('지하철에서', 'From the subway', '地下鉄から', '从地铁站'), items:[L('을지로3가역 7번 또는 8번 출구에서 지상으로 나오세요.', 'Use Exit 7 or 8 at Euljiro 3-ga Station.', '乙支路3街駅7番または8番出口から地上へ出ます。', '从乙支路3街站 7 或 8 号出口出站。'),L('짐이 많거나 유모차가 있다면 10번 출구 방향 엘리베이터를 이용하세요.', 'With heavy luggage or a stroller, use the elevator near Exit 10.', '大きな荷物やベビーカーがある場合は10番出口方面のエレベーターをご利用ください。', '携带大件行李或婴儿车时，请使用 10 号出口方向的电梯。'),L('1층 록갈비 간판을 찾은 뒤 옆 골목의 유리문으로 들어오세요.', 'Find the Rokgalbi sign on the ground floor and enter the glass door in the adjacent alley.', '1階のロクカルビの看板を見つけ、横の路地のガラス扉から入ります。', '找到 1 层 Rokgalbi 招牌后，从旁边小巷的玻璃门进入。')] },
        { type:'actions' },
        { type:'photo', image:'station-elevator-exit10.webp', title:L('10번 출구 방향 엘리베이터', 'Elevator near Exit 10', '10番出口方面エレベーター', '10 号出口方向电梯') },
        { type:'card', icon:'local_parking', title:L('주차 안내', 'Parking', '駐車場', '停车'), text:L('건물 내 주차는 불가합니다. 돈화문로 노상 공영주차장 또는 투루파킹 을지로3가점을 이용해 주세요. 투루파킹은 모두의주차장 앱에서 사전 예약이 필요합니다.', 'There is no on-site parking. Use Donhwamun-ro public street parking or TruParking Euljiro 3-ga. TruParking requires advance booking through the Modu Parking app.', '建物内駐車場はありません。敦化門路の公営路上駐車場またはトゥルーパーキング乙支路3街店をご利用ください。', '楼内不可停车。请使用敦化门路路边公共停车场或 TruParking 乙支路3街店；后者需通过 Modu Parking 应用提前预约。') }
      ],
      rules: [
        { type:'rules', items:[['smoke_free',L('실내 절대 금연', 'Strictly no smoking', '室内完全禁煙', '室内严禁吸烟'),L('전자담배를 포함해 실내 흡연은 금지됩니다.', 'No indoor smoking, including e-cigarettes.', '電子タバコを含め室内は禁煙です。', '包括电子烟在内，室内严禁吸烟。')],['notifications_off',L('매너타임 22:00–08:00', 'Quiet hours 22:00–08:00', '静粛時間 22:00–08:00', '安静时间 22:00–08:00'),L('주거 지역의 이웃을 위해 소음을 줄여 주세요.', 'Please keep noise low for our neighbors.', '近隣のため騒音をお控えください。', '请为邻居保持安静。')],['pets',L('반려동물 동반 불가', 'No pets', 'ペット不可', '不可携带宠物'),L('모든 게스트의 쾌적함을 위한 규칙입니다.', 'This keeps the space comfortable for all guests.', 'すべてのゲストの快適さのためです。', '为了所有住客的舒适。')],['celebration',L('파티·상업 촬영 불가', 'No parties or commercial shoots', 'パーティー・商業撮影不可', '禁止派对与商业拍摄'),L('예약 인원만 숙소를 이용해 주세요.', 'Only registered guests may use the stay.', '予約人数のみご利用ください。', '仅限已登记住客使用。')],['skillet',L('냄새가 적은 간단 조리', 'Light cooking only', 'においの少ない簡単な調理のみ', '仅可进行气味较小的简单烹饪'),L('삼겹살, 생선구이, 카레, 마라탕 등 냄새가 강한 음식은 조리할 수 없습니다.', 'Do not cook strong-smelling food such as grilled pork, fish, curry, or mala soup.', '焼肉、焼き魚、カレー、麻辣湯など匂いの強い料理はできません。', '不可烹饪烤五花肉、烤鱼、咖喱、麻辣烫等气味浓烈的食物。')],['local_fire_department',L('화기 사용 주의', 'Fire safety', '火気注意', '用火安全'),L('촛불과 향은 사용하지 말고, 조리 후 전원을 확인해 주세요.', 'Do not use candles or incense; switch cooking appliances off after use.', 'キャンドルやお香は使用せず、調理後は電源を確認してください。', '请勿使用蜡烛或香薰，烹饪后确认设备已关闭。')]] }
      ],
      contact: [
        { type:'card', icon:'chat_bubble', title:L('예약 플랫폼 메시지', 'Booking platform message', '予約サイトのメッセージ', '预订平台消息'), text:L('가장 빠르고 정확한 안내를 위해 예약하신 플랫폼의 메시지로 NEMO 호스트에게 연락해 주세요.', 'For the fastest, most accurate help, message host NEMO through the platform you booked with.', '最も早く正確な案内のため、予約したサイトのメッセージからホストNEMOへご連絡ください。', '为获得最快最准确的帮助，请通过预订平台消息联系房东 NEMO。') },
        { type:'notice', title:L('긴급 상황', 'Emergency', '緊急時', '紧急情况'), text:L('화재·응급 상황은 먼저 119, 범죄·안전 위협은 112에 연락한 뒤 호스트에게 알려 주세요.', 'For fire or medical emergencies, call 119 first. For crime or immediate safety threats, call 112, then notify the host.', '火災・救急はまず119、犯罪・安全上の脅威は112へ連絡し、その後ホストへお知らせください。', '火灾或急救请先拨 119；犯罪或安全威胁请拨 112，之后通知房东。') }
      ]
    },
    appliances: [
      { image:'ac-panel-01.webp', icon:'mode_fan', title:L('시스템 에어컨', 'System air conditioner', 'システムエアコン', '中央空调'), meta:L('공용부 · 침실 1 · 침실 2', 'Living area · Bedroom 1 · Bedroom 2', '共用部・寝室1・寝室2', '公共区 · 卧室1 · 卧室2'), steps:L(['벽면 조절기의 전원 버튼을 눌러 주세요.','외출하거나 퇴실할 때는 입구의 일괄소등 스위치를 꺼 주세요.','작동하지 않으면 호스트에게 메시지를 보내 주세요.'],['Press the power button on the wall controller.','Turn off the master light switch by the entrance when leaving.','Message the host if it does not operate.'],['壁面コントローラーの電源ボタンを押します。','外出・退室時は入口の一括消灯スイッチを切ります。','作動しない場合はホストへご連絡ください。'],['按下墙面控制器的电源键。','外出或退房时关闭入口处总灯开关。','无法操作时请联系房东。']) },
      { image:'tv-remote-02.webp', icon:'tv', title:L('삼성 스마트 TV', 'Samsung Smart TV', 'SamsungスマートTV', '三星智能电视'), meta:'KU43F6050FFXKR · 43”', steps:L(['리모컨으로 TV를 켜고 원하는 OTT 앱을 선택하세요.','개인 계정으로 로그인해 이용해 주세요.','체크아웃 전 반드시 모든 계정에서 로그아웃해 주세요.'],['Turn on the TV and choose your preferred streaming app.','Sign in with your personal account.','Log out of every account before check-out.'],['TVをつけ、希望の配信アプリを選びます。','個人アカウントでログインします。','チェックアウト前に必ずログアウトしてください。'],['打开电视并选择所需流媒体应用。','使用个人账号登录。','退房前务必退出所有账号。']) },
      { image:'appliance-laundry.webp', icon:'local_laundry_service', title:L('LG 트롬 드럼세탁기', 'LG TROMM washer', 'LG TROMMドラム式洗濯機', 'LG TROMM 滚筒洗衣机'), meta:'FY9WTB · 9kg', steps:L(['세탁물을 넣고 문을 완전히 닫아 주세요.','세제와 이용 시간은 현장 안내를 확인하거나 호스트에게 문의해 주세요.','세탁이 끝나면 내부에 세탁물을 남기지 마세요.'],['Load laundry and close the door fully.','Check the on-site note or ask the host about detergent and available hours.','Remove all laundry when the cycle ends.'],['洗濯物を入れ、扉を完全に閉めます。','洗剤と利用時間は現地案内を確認するかホストへお問い合わせください。','終了後は洗濯物を残さないでください。'],['放入衣物并完全关好机门。','洗涤剂与可用时间请查看现场说明或咨询房东。','洗涤完成后请及时取出衣物。']) },
      { image:'appliance-cooktop.webp', icon:'skillet', title:L('하츠 인덕션', 'Haatz induction cooktop', 'Haatz IHクッキングヒーター', 'Haatz 电磁炉'), meta:L('간단한 조리만 가능', 'Light cooking only', '簡単な調理のみ', '仅限简单烹饪'), steps:L(['인덕션 전용 용기를 사용해 주세요.','사용 후 전원을 끄고 상판이 식을 때까지 손대지 마세요.','냄새가 강한 음식은 조리할 수 없습니다.'],['Use induction-compatible cookware.','Switch off after use and do not touch until the surface cools.','Do not cook strong-smelling food.'],['IH対応の調理器具を使用します。','使用後は電源を切り、天板が冷めるまで触れないでください。','匂いの強い料理はできません。'],['请使用电磁炉适用锅具。','使用后关闭电源，台面冷却前请勿触摸。','不可烹饪气味浓烈的食物。']) },
      { image:'appliance-microwave.webp', icon:'microwave', title:L('쿠잉 전자레인지', 'Cooing microwave', 'Cooing電子レンジ', 'Cooing 微波炉'), meta:L('주방 하부장', 'Kitchen lower cabinet', 'キッチン下部', '厨房下柜'), steps:L(['금속, 알루미늄 포일, 밀폐 용기는 넣지 마세요.','음식 전용 용기를 사용하고 짧게 나누어 데워 주세요.','사용 후 내부를 깨끗하게 정리해 주세요.'],['Never place metal, foil, or sealed containers inside.','Use microwave-safe containers and heat in short intervals.','Wipe the interior after use.'],['金属・アルミホイル・密閉容器は入れないでください。','電子レンジ対応容器を使い、短時間ずつ温めます。','使用後は庫内をきれいにしてください。'],['请勿放入金属、铝箔或密封容器。','使用微波炉专用容器，分段短时加热。','使用后请清洁内部。']) }
    ]
  };
})();
