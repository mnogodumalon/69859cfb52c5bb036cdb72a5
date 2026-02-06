// AUTOMATICALLY GENERATED SERVICE
import { APP_IDS } from '@/types/app';
import type { Busse, Wartungstypen, Wartungsplanung, Wartungsdurchfuehrung } from '@/types/app';

// Base Configuration
const API_BASE_URL = 'https://my.living-apps.de/rest';

// --- HELPER FUNCTIONS ---
export function extractRecordId(url: string | null | undefined): string | null {
  if (!url) return null;
  // Extrahiere die letzten 24 Hex-Zeichen mit Regex
  const match = url.match(/([a-f0-9]{24})$/i);
  return match ? match[1] : null;
}

export function createRecordUrl(appId: string, recordId: string): string {
  return `https://my.living-apps.de/rest/apps/${appId}/records/${recordId}`;
}

async function callApi(method: string, endpoint: string, data?: any) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // Nutze Session Cookies für Auth
    body: data ? JSON.stringify(data) : undefined
  });
  if (!response.ok) throw new Error(await response.text());
  // DELETE returns often empty body or simple status
  if (method === 'DELETE') return true;
  return response.json();
}

export class LivingAppsService {
  // --- BUSSE ---
  static async getBusse(): Promise<Busse[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.BUSSE}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getBusseEntry(id: string): Promise<Busse | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.BUSSE}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createBusseEntry(fields: Busse['fields']) {
    return callApi('POST', `/apps/${APP_IDS.BUSSE}/records`, { fields });
  }
  static async updateBusseEntry(id: string, fields: Partial<Busse['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.BUSSE}/records/${id}`, { fields });
  }
  static async deleteBusseEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.BUSSE}/records/${id}`);
  }

  // --- WARTUNGSTYPEN ---
  static async getWartungstypen(): Promise<Wartungstypen[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.WARTUNGSTYPEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getWartungstypenEntry(id: string): Promise<Wartungstypen | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.WARTUNGSTYPEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createWartungstypenEntry(fields: Wartungstypen['fields']) {
    return callApi('POST', `/apps/${APP_IDS.WARTUNGSTYPEN}/records`, { fields });
  }
  static async updateWartungstypenEntry(id: string, fields: Partial<Wartungstypen['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.WARTUNGSTYPEN}/records/${id}`, { fields });
  }
  static async deleteWartungstypenEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.WARTUNGSTYPEN}/records/${id}`);
  }

  // --- WARTUNGSPLANUNG ---
  static async getWartungsplanung(): Promise<Wartungsplanung[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.WARTUNGSPLANUNG}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getWartungsplanungEntry(id: string): Promise<Wartungsplanung | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.WARTUNGSPLANUNG}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createWartungsplanungEntry(fields: Wartungsplanung['fields']) {
    return callApi('POST', `/apps/${APP_IDS.WARTUNGSPLANUNG}/records`, { fields });
  }
  static async updateWartungsplanungEntry(id: string, fields: Partial<Wartungsplanung['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.WARTUNGSPLANUNG}/records/${id}`, { fields });
  }
  static async deleteWartungsplanungEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.WARTUNGSPLANUNG}/records/${id}`);
  }

  // --- WARTUNGSDURCHFUEHRUNG ---
  static async getWartungsdurchfuehrung(): Promise<Wartungsdurchfuehrung[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.WARTUNGSDURCHFUEHRUNG}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getWartungsdurchfuehrungEntry(id: string): Promise<Wartungsdurchfuehrung | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.WARTUNGSDURCHFUEHRUNG}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createWartungsdurchfuehrungEntry(fields: Wartungsdurchfuehrung['fields']) {
    return callApi('POST', `/apps/${APP_IDS.WARTUNGSDURCHFUEHRUNG}/records`, { fields });
  }
  static async updateWartungsdurchfuehrungEntry(id: string, fields: Partial<Wartungsdurchfuehrung['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.WARTUNGSDURCHFUEHRUNG}/records/${id}`, { fields });
  }
  static async deleteWartungsdurchfuehrungEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.WARTUNGSDURCHFUEHRUNG}/records/${id}`);
  }

}