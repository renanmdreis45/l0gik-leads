import { promises as fs } from 'fs';
import { join } from 'path';
import type { DatabaseSchema, Lead, User } from '~/types/database';

const DB_PATH = join(process.cwd(), 'data', 'database.json');

const defaultDb: DatabaseSchema = {
  leads: [],
  users: []
};

export class Database {
  private static async ensureDbFile(): Promise<void> {
    try {
      await fs.access(DB_PATH);
    } catch {
      // File doesn't exist, create it
      await fs.mkdir(join(process.cwd(), 'data'), { recursive: true });
      await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2));
    }
  }

  private static async readDb(): Promise<DatabaseSchema> {
    await this.ensureDbFile();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  }

  private static async writeDb(data: DatabaseSchema): Promise<void> {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  }

  // Lead operations
  static async getLeads(): Promise<Lead[]> {
    const db = await this.readDb();
    return db.leads;
  }

  static async getLeadById(id: string): Promise<Lead | null> {
    const db = await this.readDb();
    return db.leads.find(lead => lead.id === id) || null;
  }

  static async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const db = await this.readDb();
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now
    };
    
    db.leads.push(newLead);
    await this.writeDb(db);
    return newLead;
  }

  static async updateLead(id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt'>>): Promise<Lead | null> {
    const db = await this.readDb();
    const leadIndex = db.leads.findIndex(lead => lead.id === id);
    
    if (leadIndex === -1) return null;
    
    db.leads[leadIndex] = {
      ...db.leads[leadIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await this.writeDb(db);
    return db.leads[leadIndex];
  }

  static async deleteLead(id: string): Promise<boolean> {
    const db = await this.readDb();
    const initialLength = db.leads.length;
    db.leads = db.leads.filter(lead => lead.id !== id);
    
    if (db.leads.length < initialLength) {
      await this.writeDb(db);
      return true;
    }
    return false;
  }

  static async searchLeads(query: string): Promise<Lead[]> {
    const db = await this.readDb();
    const searchTerm = query.toLowerCase();
    
    return db.leads.filter(lead => 
      lead.nome.toLowerCase().includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm) ||
      lead.telefone.includes(searchTerm) ||
      lead.cargo.toLowerCase().includes(searchTerm)
    );
  }

  // User operations
  static async getUserByUsername(username: string): Promise<User | null> {
    const db = await this.readDb();
    return db.users.find(user => user.username === username) || null;
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const db = await this.readDb();
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    await this.writeDb(db);
    return newUser;
  }
}