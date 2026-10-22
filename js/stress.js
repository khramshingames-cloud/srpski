// Ударения: «*» стоит сразу после ударной гласной (или слогового r).
// Односложные слова не размечаем — ударение там одно.
// В сербском ударение почти никогда не падает на последний слог.
// Разметка сделана по словарным нормам; слова, где стоит перепроверить у носителя, — в UNSURE.

const MARKED = `
zdra*vo ća*o hva*la mo*lim izvi*nite do*bro
vo*da ka*fa pi*vo vi*no mle*ko še*ćer
o*na o*ni bi*ti i*mati zna*ti razu*meti govo*riti
sr*pski e*ngleski ru*ski
i*me zva*ti ka*ko oda*kle ži*veti Sr*bija Ru*sija
Be*ograd o*vde ta*mo
je*dan če*tiri se*dam o*sam de*vet de*set
nu*la jeda*naest dva*naest pe*tnaest dva*deset tri*deset pede*set hi*ljada po*la
mi*nut vre*me da*nas su*tra ju*če sa*da ju*tro ve*če ko*liko
pone*deljak u*torak sre*da če*tvrtak pe*tak su*bota ne*delja vi*kend
no*vac di*nar e*vro ce*na ra*čun ka*rtica goto*vina sku*po je*ftino pla*titi
je*sti pi*ti hte*ti vo*leti ra*diti i*ći do*ći vi*deti ku*piti da*ti
ja*buka me*so ri*ba pi*letina sala*ta su*pa ja*je vo*će po*vrće
resto*ran ka*fić ko*nobar je*lovnik ča*ša ta*njir do*ručak ru*čak ve*čera u*kusno
ku*ća so*ba ku*hinja kupa*tilo vra*ta pro*zor a*dresa
le*vo de*sno pra*vo
pr*vi dru*gi tre*ći če*tvrti
u*lica ce*ntar sta*nica a*utobus tra*mvaj ta*ksi a*uto ka*rta
čo*vek že*na de*te de*ca pri*jatelj devo*jka de*čko po*rodica ko*mšija
do*bar ve*liki ma*li no*vi sta*ri to*pao hla*dan va*žan
o*vaj
vr*lo ja*ko ma*lo mno*go ne*što ni*šta u*vek ni*kad mo*žda
ka*da za*što ko*ji ku*da či*ji a*li i*li
mo*ći mo*rati tre*bati že*leti mi*sliti pi*tati re*ći če*kati tra*žiti po*moći
po*sao ko*lega sa*stanak ško*la u*čiti je*zik pi*tanje o*dgovor
spa*vati u*stati ku*vati pra*ti či*tati pi*sati gle*dati slu*šati ču*ti odma*rati
proda*vnica pi*jaca apote*ka pe*kara ka*sa ke*sa fla*ša ki*logram li*tar ko*mad
ja*nuar fe*bruar a*pril me*sec go*dina se*dmica da*tum
a*vgust se*ptembar o*ktobar no*vembar de*cembar pro*leće le*to je*sen zi*ma
gla*va ru*ka no*ga o*ko sto*mak le*kar bo*lnica bo*leti
su*nce ki*ša ve*tar o*blak to*plo hla*dno mo*re re*ka pla*nina
bo*ja cr*ven ze*len be*o ma*jica ja*kna ci*pele
sre*ćan tu*žan u*moran gla*dan že*dan bo*lestan za*uzet slo*bodan si*guran
svi*đati
ve*rovati ose*ćati zabo*raviti se*ćati na*dati sme*jati pla*kati bri*nuti mr*zeti sla*gati
a*erodrom a*vion ho*tel pa*soš ko*fer rezerva*cija u*laz i*zlaz turi*sta
po*sle pre*ko izme*đu i*spred i*za po*red pro*tiv ume*sto
u*ći iza*ći vra*titi puto*vati vo*ziti še*tati tr*čati sti*ći kre*nuti o*stati
a*ko o*nda sa*mo ta*kođe o*pet za*to
kre*vet sto*lica o*rmar fri*žider špo*ret ma*šina tele*vizor la*mpa stru*ja ka*uč
te*lefon po*ruka i*nternet lo*zinka aplika*cija sli*ka po*slati kompju*ter pu*njač
kro*mpir pa*radajz pi*rinač teste*nina u*lje pu*ter ko*lač sla*doled
vi*ljuška ka*šika šo*lja lo*nac re*cept sla*dak ki*seo
pla*ta u*govor fi*rma kli*jent pro*jekat i*skustvo o*dmor pe*nzija i*ntervju
mu*zika knji*ga u*takmica i*gra pe*sma i*grati pli*vati ple*sati
ba*nka po*šta poli*cija o*pština cr*kva mu*zej po*zorište bi*oskop bibliote*ka
do*kument pa*pir po*tpis vi*za bo*ravak za*htev ša*lter formu*lar pe*čat
po*nekad če*sto re*tko sva*ki je*dnom o*dmah u*skoro ka*snije ra*no ka*sno
te*žak pra*zan pr*ljav bli*zu da*leko
ma*jka o*tac ma*ma ta*ta će*rka se*stra ba*ba de*da
otvo*riti zatvo*riti u*zeti sta*viti do*neti no*siti pro*dati po*četi zavr*šiti pro*bati
ži*vot lju*bav zdra*vlje sre*ća pro*blem ide*ja i*stina ra*zlog pri*lika
za*jedno br*zo spo*ro gla*sno ti*ho ta*čno o*tprilike sko*ro si*gurno po*sebno
ma*čka pti*ca dr*vo ne*bo ze*mlja je*zero šu*ma se*lo
pra*znik sla*va Bo*žić U*skrs ro*đendan po*klon žu*rka česti*tati sla*viti
`;

// Где словари расходятся или разговорная норма отличается — стоит послушать носителя
export const UNSURE = new Set(['restoran', 'aerodrom', 'televizor', 'kompjuter', 'intervju', 'internet', 'testenina', 'kupatilo', 'formular', 'biblioteka', 'pedeset', 'ponedeljak']);

// слово без разметки -> [до, ударная буква, после]
export const STRESS = {};
for (const m of MARKED.split(/\s+/).filter(Boolean)) {
  const i = m.indexOf('*');
  STRESS[m.replace('*', '')] = [m.slice(0, i - 1), m[i - 1], m.slice(i + 1)];
}

// Разметка для фразы из нескольких слов («zvati se» — ударение в «zvati»)
export function stressParts(sr) {
  return sr.split(' ').map((w) => STRESS[w] || [w, '', '']);
}
