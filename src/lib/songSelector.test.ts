import {describe,it,expect} from 'vitest';
import {guessSongbookByDate} from './songSelector';
describe('songbook selector',()=>{
 it('domingo 11',()=>{expect(guessSongbookByDate(new Date('2026-02-15T11:00:00'))).toBe('domingo-11')})
 it('domingo 20',()=>{expect(guessSongbookByDate(new Date('2026-02-15T20:10:00'))).toBe('domingo-20')})
})
