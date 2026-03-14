// api/gamesData.js - نسخة محسنة نهائية
export default async function handler(req, res) {
  // إعداد CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { ids } = req.query || {};
  if (!ids) {
    return res.status(400).json({
      ok: false,
      error: 'No ids query param provided'
    });
  }

  // تنظيف المدخلات
  const inputIds = ids
    .split(',')
    .map(x => String(x || '').trim())
    .filter(Boolean);

  if (inputIds.length === 0) {
    return res.status(400).json({
      ok: false,
      error: 'No valid place IDs provided'
    });
  }

  // دالة تحويل placeId إلى universeId
  async function placeToUniverseId(placeId) {
    try {
      const r = await fetch(
        `https://apis.roblox.com/universes/v1/places/${placeId}/universe`
      );
      if (!r.ok) return null;
      const j = await r.json();
      return j?.universeId ? String(j.universeId) : null;
    } catch (e) {
      return null;
    }
  }

  // الحصول على universeIds مع الاحتفاظ بالترتيب
  const rows = [];
  for (const pid of inputIds) {
    let uni = await placeToUniverseId(pid);
    if (!uni) uni = pid; // افتراض أن الرقم هو universeId إذا فشل
    rows.push({ inputId: pid, universeId: uni });
  }

  // إزالة التكرار
  const uniqueUniverseIds = [...new Set(rows.map(r => r.universeId))];

  // جلب بيانات الألعاب والأيقونات
  const infoUrl = `https://games.roblox.com/v1/games?universeIds=${uniqueUniverseIds.join(',')}`;
  const iconUrl = `https://thumbnails.roblox.com/v1/games/icons?universeIds=${uniqueUniverseIds.join(',')}&size=420x420&format=Png&isCircular=false`;

  let infoData = [];
  let iconData = [];

  try {
    const [infoRes, iconRes] = await Promise.all([
      fetch(infoUrl),
      fetch(iconUrl)
    ]);

    if (infoRes.ok) {
      const infoJson = await infoRes.json();
      infoData = infoJson.data || [];
    }
    if (iconRes.ok) {
      const iconJson = await iconRes.json();
      iconData = iconJson.data || [];
    }
  } catch (err) {
    console.error('Roblox API error:', err);
  }

  // بناء خريطة بالبيانات
  const gameMap = {};
  infoData.forEach(g => {
    gameMap[String(g.id)] = {
      name: g.name || 'Unknown Game',
      visits: g.visits || 0
    };
  });

  iconData.forEach(ic => {
    const uid = String(ic.targetId);
    if (!gameMap[uid]) gameMap[uid] = {};
    gameMap[uid].icon = ic.imageUrl || null;
  });

  // ترتيب النتائج حسب الإدخال الأصلي
  const outData = rows.map(row => ({
    inputId: row.inputId,
    universeId: row.universeId,
    name: gameMap[row.universeId]?.name || null,
    visits: gameMap[row.universeId]?.visits || null,
    icon: gameMap[row.universeId]?.icon || null
  }));

  // حساب إجمالي الزيارات
  let totalVisits = 0n;
  outData.forEach(item => {
    if (item.visits != null) {
      try {
        totalVisits += BigInt(item.visits);
      } catch (e) { }
    }
  });

  // تخزين مؤقت
  res.setHeader('Cache-Control', 'public, max-age=20, s-maxage=20');

  res.status(200).json({
    ok: true,
    data: outData,
    totalVisits: totalVisits.toString()
  });
}