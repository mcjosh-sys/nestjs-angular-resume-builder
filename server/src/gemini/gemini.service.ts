import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  private readonly _ai!: GoogleGenAI;
  constructor() {
    this._ai = new GoogleGenAI({});
  }

  get ai() {
    return this._ai;
  }

  get models() {
    return this._ai.models;
  }
}
