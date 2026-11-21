import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {musicTracks} from '../src/data/music.ts';

test('GitHub Pages 仓库子目录下的图片与音乐均使用随包文件', () => {
  const artwork = JSON.parse(readFileSync(new URL('../src/data/assets.json', import.meta.url), 'utf8'));
  const paths = [...Object.values(artwork), ...Object.values(musicTracks).map(track => track.src)] as string[];
  for (const path of paths) {
    const nested = new URL(path, 'https://example.test/sunday-train/');
    assert.ok(nested.pathname.startsWith('/sunday-train/'), path);
    assert.ok(existsSync(new URL('../public/' + path, import.meta.url)), path);
  }
});
