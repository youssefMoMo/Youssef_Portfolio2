// api/gamesData.js
// دي فانكشن السيرفر بتاعت Vercel
// بتاخد ids=<comma separated placeIds>
// وبتطلع لكل لعبة: الاسم الحقيقي + الزيارات + صورة الثمبنيل

export default async function handler(req, res) {
  // CORS علشان الفرونت إند يقدر يكلمها من أي دومين
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { ids } = req.query || {};
  if (!ids) {
    res.status(400).json({
      ok: false,
      error: 'No ids query param provided'
    });
    return;
  }

  // ids من الفرونت = placeIds (الرقم اللي في لينك اللعبة)
  const inputIds = ids
    .split(',')
    .map(x => String(x || '').trim())
    .filter(Boolean);

  // helper: placeId -> universeId
  async function placeToUniverseId(placeId) {
    try {
      const r = await fetch(
        `https://apis.roblox.com/universes/v1/places/${placeId}/universe`
      );
      if (!r.ok) return null;
      const j = await r.json();
      if (j && j.universeId) {
        return String(j.universeId);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // اربط كل id داخل (inputId, universeId) واحتفظ بالترتيب الأصلي
  const rows = [];
  for (const pid of inputIds) {
    let uni = await placeToUniverseId(pid);
    if (!uni) {
      // لو API مرجعش حاجة، يمكن الـid اللي مبعوت أصلاً هو universeId
      uni = pid;
    }
    rows.push({
      inputId: pid,
      universeId: uni
    });
  }

  // شيل التكرار عشان مانضربش Roblox كتير
  const uniqueUniverseIds = [...new Set(rows.map(r => r.universeId))];

  // لنجيب معلومات اللعبة + الأيقونات
  const infoUrl =
    'https://games.roblox.com/v1/games?universeIds=' +
    uniqueUniverseIds.join(',');

  const iconUrl =
    'https://thumbnails.roblox.com/v1/games/icons?universeIds=' +
    uniqueUniverseIds.join(',') +
    '&size=420x420&format=Png&isCircular=false';

  let infoJson = { data: [] };
  let iconJson = { data: [] };

  try {
    const [infoRes, iconRes] = await Promise.all([
      fetch(infoUrl),
      fetch(iconUrl),
    ]);

    if (infoRes.ok) {
      infoJson = await infoRes.json();
    }
    if (iconRes.ok) {
      iconJson = await iconRes.json();
    }
  } catch (err) {
    // لو Roblox وقع، نكمّل بس بالداتا اللي قدرنا نجيبها
  }

  // نبني map بالـuniverseId
  const byUni = {};
  if (Array.isArray(infoJson.data)) {
    infoJson.data.forEach(g => {
      byUni[String(g.id)] = {
        name: g.name,
        visits: g.visits
      };
    });
  }

  if (Array.isArray(iconJson.data)) {
    iconJson.data.forEach(ic => {
      const u = String(ic.targetId);
      if (!byUni[u]) byUni[u] = {};
      byUni[u].icon = ic.imageUrl;
    });
  }

  // رجّع الداتا بنفس ترتيب الـinputIds اللي اتبعتت
  const outData = rows.map(row => ({
    inputId: row.inputId,        // ده الـplaceId اللي انت بعته
    universeId: row.universeId,  // ده اللي Roblox عايزه
    name: byUni[row.universeId]?.name ?? null,
    visits: byUni[row.universeId]?.visits ?? null,
    icon: byUni[row.universeId]?.icon ?? null
  }));

  // احسب الـtotalVisits = مجموع الزيارات كلها
  let totalVisitsBI = 0n;
  for (const item of outData) {
    if (item.visits != null) {
      try {
        totalVisitsBI += BigInt(item.visits);
      } catch (e) {
        // لو visits مش رقم صالح BigInt طنّشه
      }
    }
  }

  // cache خفيفة
  res.setHeader('Cache-Control', 'public, max-age=20, s-maxage=20');

  res.status(200).json({
    ok: true,
    data: outData,
    totalVisits: totalVisitsBI.toString()
  });
}