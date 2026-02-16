import {describe,it,expect} from 'vitest';
import {parseSaintHtml} from './saintParser';

describe('saint parser',()=>{
 it('parse basic html',()=>{
  const html='<html><h1>San José</h1><p>Padre adoptivo de Jesús</p><img src="img.jpg"/></html>';
  const p=parseSaintHtml(html,'https://x');
  expect(p?.name).toBe('San José');
 })
})
