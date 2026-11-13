#!/usr/bin/env node
// Public-distribution guard. No dependency on the private development repository.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPOSITORY = 'Nujabes-arch/risu-plugin-releases';
export const RAW_BASE = 'https://raw.githubusercontent.com/' + REPOSITORY + '/main/';
const DEFAULT_ROOT = fileURLToPath(new URL('../', import.meta.url));
const REQUIRED_DIRECTIVES = ['name', 'display-name', 'version', 'api', 'update-url'];
const SENSITIVE_PATH = /(^|\/)(?:\.env(?:\..*)?|secrets?|private)(?:\/|$)|\.(?:risum|risup|pem|p12|pfx|key)$/i;
const SENSITIVE_CONTENT = [
    /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
    /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{25,}\b/,
    /\bgithub_pat_[A-Za-z0-9_]{35,}\b/,
    /\bsk-[A-Za-z0-9_-]{24,}\b/,
];

function enumerateFiles(base, prefix = '') {
    if (!fs.existsSync(base)) return [];
    const found = [];
    for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
        const relative = prefix ? prefix + '/' + entry.name : entry.name;
        if (entry.name === '.git' || entry.name === 'node_modules') continue;
        if (entry.isSymbolicLink()) {
            found.push(relative); // Will be explicitly rejected below.
        } else if (entry.isDirectory()) {
            found.push(...enumerateFiles(path.join(base, entry.name), relative));
        } else if (entry.isFile()) {
            found.push(relative);
        }
    }
    return found;
}

export function validatePluginSource(source, entry) {
    const errors = [];
    if (typeof source !== 'string' || !source.trim()) return ['배포 JS 본문이 비어 있습니다.'];
    const directives = new Map();
    for (const line of source.split(/\r?\n/)) {
        const match = line.match(/^\/\/@([a-z][a-z-]*)[ \t]+(.+?)\s*$/);
        if (!match || !REQUIRED_DIRECTIVES.includes(match[1])) continue;
        if (directives.has(match[1])) errors.push('중복 플러그인 지시문: //@' + match[1]);
        else directives.set(match[1], match[2]);
    }
    for (const directive of REQUIRED_DIRECTIVES) {
        if (!directives.has(directive)) errors.push('누락된 플러그인 지시문: //@' + directive);
    }
    if (directives.get('name') !== entry.pluginName) errors.push('//@name이 catalog의 pluginName과 다릅니다.');
    if (directives.get('api') !== '3.0') errors.push('//@api 3.0이 필요합니다.');
    if (directives.get('version') !== entry.version) errors.push('//@version이 catalog의 version과 다릅니다.');
    if (directives.get('update-url') !== entry.updateUrl) errors.push('//@update-url이 고정된 main Raw 주소와 다릅니다.');
    const versionLine = source.match(/^\/\/@version[ \t]+\S+.*$/m)?.[0];
    if (versionLine) {
        const index = source.indexOf(versionLine);
        if (Buffer.byteLength(source.slice(0, index) + versionLine, 'utf8') > 512) {
            errors.push('//@version은 파일 시작 512바이트 안에 있어야 합니다.');
        }
    }
    if (Buffer.byteLength(source, 'utf8') > 5 * 1024 * 1024) errors.push('배포 JS가 5 MiB 상한을 초과했습니다.');
    for (const pattern of SENSITIVE_CONTENT) {
        if (pattern.test(source)) errors.push('배포 JS에서 비밀정보로 보이는 문자열이 발견됐습니다.');
    }
    return errors;
}

export function validateCatalog(catalog, root = DEFAULT_ROOT) {
    const errors = [];
    if (!catalog || catalog.schemaVersion !== 1 || !Array.isArray(catalog.plugins)) {
        return ['catalog의 schemaVersion은 1이며 plugins 배열이 있어야 합니다.'];
    }
    const usedSlugs = new Set(), usedNames = new Set(), listedFiles = new Set();
    for (const entry of catalog.plugins) {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
            errors.push('catalog.plugins에 잘못된 항목이 있습니다.');
            continue;
        }
        const slug = entry.slug;
        if (typeof slug !== 'string' || !/^[a-z][a-z0-9-]{1,48}$/.test(slug)) {
            errors.push('유효하지 않은 plugin slug: ' + String(slug));
            continue;
        }
        if (usedSlugs.has(slug)) errors.push(slug + ': 중복 slug');
        usedSlugs.add(slug);
        if (typeof entry.pluginName !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]{1,80}$/.test(entry.pluginName)) {
            errors.push(slug + ': 잘못된 pluginName');
        }
        if (usedNames.has(entry.pluginName)) errors.push(slug + ': 중복 pluginName');
        usedNames.add(entry.pluginName);
        if (typeof entry.file !== 'string' ||
            !new RegExp('^plugins/' + slug + '/[A-Za-z][A-Za-z0-9_.-]*\\.js$').test(entry.file)) {
            errors.push(slug + ': file은 plugins/<slug>/<filename>.js 이어야 합니다.');
            continue;
        }
        if (listedFiles.has(entry.file)) errors.push(slug + ': 중복된 배포 파일 경로');
        listedFiles.add(entry.file);
        if (entry.updateUrl !== RAW_BASE + entry.file) errors.push(slug + ': 고정 main Raw URL이 일치하지 않습니다.');
        if (typeof entry.thirdPartyRightsConfirmed !== 'boolean' || typeof entry.risuRuntimeVerified !== 'boolean') {
            errors.push(slug + ': 권한/런타임 검증값은 boolean이어야 합니다.');
        }
        const target = path.join(root, ...entry.file.split('/'));
        const exists = fs.existsSync(target);
        if (entry.status === 'planned') {
            if (exists) errors.push(slug + ': planned 상태에서는 배포 JS를 추가할 수 없습니다.');
            if (entry.version !== null) errors.push(slug + ': planned 상태에서는 version이 null이어야 합니다.');
            if (entry.thirdPartyRightsConfirmed || entry.risuRuntimeVerified) {
                errors.push(slug + ': planned 항목의 출시 확인값이 잘못됐습니다.');
            }
        } else if (entry.status === 'published') {
            if (!entry.thirdPartyRightsConfirmed || !entry.risuRuntimeVerified) {
                errors.push(slug + ': 권리 확인 및 RisuAI 실사용 검증이 끝나기 전에는 공개할 수 없습니다.');
            }
            if (typeof entry.version !== 'string' || !/^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(entry.version)) {
                errors.push(slug + ': 배포 version은 x.y.z 형식이어야 합니다.');
            }
            if (!exists) {
                errors.push(slug + ': published 상태인데 JS 파일이 없습니다.');
            } else {
                errors.push(...validatePluginSource(fs.readFileSync(target, 'utf8'), entry).map(e => slug + ': ' + e));
            }
        } else {
            errors.push(slug + ': 알 수 없는 status (planned 또는 published만 허용)');
        }
    }
    const pluginRoot = path.join(root, 'plugins');
    for (const file of enumerateFiles(pluginRoot, 'plugins')) {
        if (file.endsWith('.js') && !listedFiles.has(file)) {
            errors.push('catalog에 등록되지 않은 플러그인 JS: ' + file);
        }
    }
    return errors;
}

export function validateRepository(root = DEFAULT_ROOT) {
    const errors = [];
    let catalog;
    try {
        catalog = JSON.parse(fs.readFileSync(path.join(root, 'plugins', 'catalog.json'), 'utf8'));
    } catch (error) {
        return ['catalog 읽기 실패: ' + error.message];
    }
    errors.push(...validateCatalog(catalog, root));
    for (const rel of enumerateFiles(root)) {
        if (SENSITIVE_PATH.test(rel)) errors.push('배포 저장소에서 금지된 파일 경로: ' + rel);
        if (fs.lstatSync(path.join(root, ...rel.split('/'))).isSymbolicLink()) errors.push('심볼릭 링크를 허용하지 않습니다: ' + rel);
    }
    for (const required of ['README.md', 'THIRD_PARTY_NOTICES.md', 'SECURITY.md']) {
        if (!fs.existsSync(path.join(root, required))) errors.push('필수 안내 파일 누락: ' + required);
    }
    return { errors, catalog };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const { errors, catalog } = validateRepository();
    if (errors.length) {
        for (const error of errors) console.error('FAIL: ' + error);
        process.exitCode = 1;
    } else {
        const published = catalog.plugins.filter(p => p.status === 'published').length;
        const planned = catalog.plugins.filter(p => p.status === 'planned').length;
        console.log('Release repository validation passed. Published:', published, 'Planned:', planned);
    }
}
