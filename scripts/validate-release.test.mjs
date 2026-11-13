import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateCatalog, validatePluginSource, validateRepository, RAW_BASE } from './validate-release.mjs';

const FILE = 'plugins/loreqa-bg/LoreQA-BG.js';
const basicEntry = () => ({
    slug: 'loreqa-bg',
    pluginName: 'LoreQA-BG-Experimental',
    displayName: '원작견 BG',
    status: 'planned',
    version: null,
    file: FILE,
    updateUrl: RAW_BASE + FILE,
    thirdPartyRightsConfirmed: false,
    risuRuntimeVerified: false,
});
const js = version => [
    '//@name LoreQA-BG-Experimental',
    '//@display-name LoreQA BG',
    '//@version ' + version,
    '//@api 3.0',
    '//@update-url ' + RAW_BASE + FILE,
    'console.log("ready");',
].join('\n');
function fixture(t) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'risu-release-test-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    fs.mkdirSync(path.join(root, 'plugins', 'loreqa-bg'), { recursive: true });
    for (const f of ['LICENSE', 'README.md', 'THIRD_PARTY_NOTICES.md', 'SECURITY.md']) {
        fs.writeFileSync(path.join(root, f), f + '\n');
    }
    const entry = basicEntry();
    const catalog = { schemaVersion: 1, plugins: [entry] };
    const save = () => fs.writeFileSync(path.join(root, 'plugins', 'catalog.json'), JSON.stringify(catalog));
    save();
    return { root, entry, catalog, save };
}

test('planned entries pass without publishing an executable JS', t => {
    const { root } = fixture(t);
    assert.deepEqual(validateRepository(root).errors, []);
});
test('unapproved source cannot be added under a planned entry', t => {
    const { root, entry } = fixture(t);
    fs.writeFileSync(path.join(root, entry.file), js('0.2.0'));
    assert.match(validateRepository(root).errors.join(' '), /planned 상태/);
});
test('publishing requires both human-recorded rights and runtime validation', t => {
    const { root, entry, save } = fixture(t);
    entry.status = 'published';
    entry.version = '0.2.0';
    fs.writeFileSync(path.join(root, entry.file), js('0.2.0'));
    save();
    assert.match(validateRepository(root).errors.join(' '), /권리 확인/);
    entry.thirdPartyRightsConfirmed = true;
    entry.risuRuntimeVerified = true;
    save();
    assert.deepEqual(validateRepository(root).errors, []);
});
test('mismatched name, version, or update URL fails validation', () => {
    const entry = { ...basicEntry(), status: 'published', version: '0.2.0' };
    const mutated = js('0.2.1').replace('//@name LoreQA-BG-Experimental', '//@name WrongPlugin')
        .replace(RAW_BASE + FILE, 'https://example.com/untrusted.js');
    assert.equal(validatePluginSource(mutated, entry).filter(e => /다릅니다/.test(e)).length, 3);
});
test('version must appear within the first 512 UTF-8 bytes', () => {
    const entry = { ...basicEntry(), status: 'published', version: '0.2.0' };
    const longHeader = '// ' + '가'.repeat(180) + '\n' + js('0.2.0');
    assert.match(validatePluginSource(longHeader, entry).join(' '), /512바이트/);
});
test('private keys and token-like strings in release JS are blocked', () => {
    const entry = { ...basicEntry(), status: 'published', version: '0.2.0' };
    const secret = js('0.2.0') + '\nconst leaked = "sk-' + 'a'.repeat(35) + '";\n';
    assert.match(validatePluginSource(secret, entry).join(' '), /비밀정보/);
});
test('sensitive files and unknown plugin JS are blocked', t => {
    const { root } = fixture(t);
    fs.writeFileSync(path.join(root, '.env'), 'should-not-exist');
    fs.writeFileSync(path.join(root, 'plugins', 'loreqa-bg', 'unknown.js'), 'alert(1)');
    const errors = validateRepository(root).errors.join(' ');
    assert.match(errors, /금지된 파일 경로/);
    assert.match(errors, /등록되지 않은 플러그인 JS/);
});
test('catalog rejects path traversal and duplicate plugin identifiers', t => {
    const { root, entry, catalog } = fixture(t);
    entry.file = 'plugins/loreqa-bg/../../unexpected.js';
    catalog.plugins.push({ ...entry });
    assert.match(validateCatalog(catalog, root).join(' '), /중복 slug/);
    assert.match(validateCatalog(catalog, root).join(' '), /file은 plugins/);
});
