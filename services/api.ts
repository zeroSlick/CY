
import { User, UserRole, Threat, Incident, AuditLog, SystemSettings, Severity } from '../types';
import { supabase } from '../supabaseClient';

class ApiService {
  // --- THREATS & INCIDENTS ---
  async getThreats(): Promise<Threat[]> {
    const { data, error } = await supabase
      .from('threat_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) return [];
    return data as Threat[];
  }

  async getIncidents(): Promise<Incident[]> {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) return [];
    return data as Incident[];
  }

  async updateIncident(id: string, updates: Partial<Incident>): Promise<Incident | null> {
    const { data, error } = await supabase
      .from('incidents')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return null;
    return data as Incident;
  }

  async reassignIncident(id: string, analystName: string): Promise<boolean> {
    const { error } = await supabase
      .from('incidents')
      .update({ assignedAnalyst: analystName, updatedAt: new Date().toISOString() })
      .eq('id', id);
    
    if (!error) {
      await this.logAdminAction('INCIDENT_REASSIGN', `Incident ${id} reassigned to ${analystName}`, id, 'OPERATIONS');
    }
    return !error;
  }

  async approveIncidentClosure(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('incidents')
      .update({ status: 'CLOSED_BY_ADMIN', updatedAt: new Date().toISOString() })
      .eq('id', id);
    
    if (!error) {
      await this.logAdminAction('INCIDENT_CLOSURE_APPROVED', `Admin approved closure for ${id}`, id, 'OPERATIONS');
    }
    return !error;
  }

  // --- IDENTITY HUB (USER MANAGEMENT) ---
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('username', { ascending: true });

    if (error) return [];
    return data as User[];
  }

  async toggleUserStatus(id: string, isActive: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ isActive })
      .eq('id', id);
    
    if (!error) {
      await this.logAdminAction(isActive ? 'USER_ENABLED' : 'USER_DISABLED', `User status changed for ${id}`, id, 'SECURITY');
    }
    return !error;
  }

  async updateUserRole(id: string, role: UserRole): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id);
    
    if (!error) {
      await this.logAdminAction('ROLE_MODIFICATION', `User ${id} role updated to ${role}`, id, 'SECURITY');
    }
    return !error;
  }

  // --- AUDIT TRAIL ---
  async getAuditLogs(): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) return [];
    return data as AuditLog[];
  }

  async logAdminAction(action: string, details: string, resourceId: string, category: AuditLog['category']): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('audit_logs').insert([{
      timestamp: new Date().toISOString(),
      userId: user.id,
      username: user.user_metadata?.username || user.email,
      action,
      resource: resourceId,
      details,
      category,
      ip: 'INTERNAL_PROXY' // In a real app, this would be fetched from headers/API
    }]);
  }

  // --- SYSTEM SETTINGS ---
  async getSystemSettings(): Promise<SystemSettings | null> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .single();
    
    if (error) return null;
    return data as SystemSettings;
  }

  async updateSystemSettings(updates: Partial<SystemSettings>): Promise<boolean> {
    const { error } = await supabase
      .from('system_settings')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', 'global_config'); // Assuming a single row config
    
    if (!error) {
      await this.logAdminAction('SETTINGS_UPDATE', 'System security policy modified', 'global_config', 'SYSTEM');
    }
    return !error;
  }
}

export const api = new ApiService();
