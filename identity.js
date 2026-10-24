/* ASHFALL 0.8.9.64 — presentation only; no persistence or gameplay side effects. */
(function(){'use strict';
const iconNames=new Set(["back", "bag", "check", "chest", "chevron", "clock", "close", "credits", "damage", "danger", "enemies", "extraction", "eye", "health", "home", "info", "lock", "loot", "map", "merchant", "minus", "next", "outpost", "pause", "plus", "power", "rate", "research", "resume", "save", "scan", "search", "sectors", "settings", "shield", "survivor", "upgrade", "weapon", "xp"]);
window.afIcon=function(name){const safe=String(name||'');if(!iconNames.has(safe))return '';return '<svg class="af-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><use href="#af-i-'+safe+'"></use></svg>';};
window.afDecorateStatus=function(message){
 const text=String(message??'');
 const sym=text.match(/^[\s]*([✓⚠⚡✦✚🎒📡🔒✨🛡⚔🏆💡])/u);
 const icons={'✓':'check','⚠':'danger','⚡':'rate','✦':'xp','✚':'health','🎒':'bag','📡':'outpost','🔒':'lock','✨':'loot','🛡':'shield','⚔':'weapon','🏆':'check','💡':'info'};
 const clean=text.replace(/^[\s]*[✓⚠⚡✦✚🎒📡🔒✨🛡⚔🏆💡]\s*/u,'').replace(/[\u{1F300}-\u{1FAFF}\uFE0F]/gu,'').trim();
 return {text:clean,icon: sym ? icons[sym[1]] : null};
};
})();