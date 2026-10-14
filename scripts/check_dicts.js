'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const locales = ['dicts', 'dicts_tw'];
const files = fs.readdirSync(path.join(root, locales[0])).filter(f => f.endsWith('.json')).sort();
const normalize = s => s.replace(/\s+/g, ' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, '...').trim().toLowerCase();
let errors = [], notes = [], totals = {};
for (const locale of locales) {
    const names = fs.readdirSync(path.join(root, locale)).filter(f => f.endsWith('.json')).sort();
    if (names.join('|') !== files.join('|')) errors.push(locale + ': 文件集合与简体词典不一致');
    let total = 0, normalized = new Map(), conflicts = new Set();
    for (const file of names) {
        let entries;
        try { entries = JSON.parse(fs.readFileSync(path.join(root, locale, file), 'utf8')); }
        catch (e) { errors.push(locale + '/' + file + ': JSON 解析失败: ' + e.message); continue; }
        if (!entries || typeof entries !== 'object' || Array.isArray(entries)) {
            errors.push(locale + '/' + file + ': JSON 根节点必须是对象'); continue;
        }
        total += Object.keys(entries).length;
        for (const [key, value] of Object.entries(entries)) {
            if (!key.trim() || typeof value !== 'string') errors.push(locale + '/' + file + ': 无效词条 ' + JSON.stringify(key));
            if (value === '' && key !== 'to be installed') errors.push(locale + '/' + file + ': 空译文 ' + key);
            const normalizedKey = normalize(key);
            if (normalized.has(normalizedKey) && normalized.get(normalizedKey).value !== value) conflicts.add(normalizedKey);
            normalized.set(normalizedKey, {file, value});
        }
    }
    totals[locale] = total;
    notes.push(locale + ': ' + total + ' 条词条，规范化后冲突 ' + conflicts.size + ' 组（含历史大小写/标点变体；仅提示）');
}
for (const file of files) {
    const [cn, tw] = locales.map(locale => JSON.parse(fs.readFileSync(path.join(root, locale, file), 'utf8')));
    for (const key of Object.keys(cn)) if (!(key in tw)) errors.push('繁体缺少: ' + file + ': ' + key);
    for (const key of Object.keys(tw)) if (!(key in cn)) errors.push('简体缺少: ' + file + ': ' + key);
}
for (const [file, keys] of Object.entries({
    'common.json': ['Run Now', 'Create with Prompt', 'Attach Folder', 'Export as PDF'],
    'menu_nav.json': ['Automations', 'Advanced Search', 'UI Extensions'],
    'page_settings.json': ['Use Global Settings', 'Plan Review Policy', 'Permissions Preset']
})) {
    for (const locale of locales) {
        const entries = JSON.parse(fs.readFileSync(path.join(root, locale, file), 'utf8'));
        for (const key of keys) if (!entries[key]) errors.push(locale + '/' + file + ': 新版词条缺失 ' + key);
    }
}
for (const line of notes) console.log(line);
if (errors.length) {
    console.error('词典校验失败 (' + errors.length + '):\n' + errors.join('\n'));
    process.exitCode = 1;
} else {
    console.log('校验通过：简繁词条键一致，JSON 格式正确，新版关键词条存在。');
    console.log('All dictionaries are perfectly aligned!');
}