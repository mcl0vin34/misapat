// src/types/User.ts

export interface UpgradeInfo {
  upgrade_id: number;
  level: number;
}

export interface AppUser {
  id: number;
  username: string;
  first_name: string;
  last_name?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
  full_name: string;
  level: number;
  created_at: string;
  energy_left: number;
  energy_updated_at: string;
  boosts_left: number;
  boosts_updated_at: string;
  is_subscribed: boolean;
  morse_last_completed_at: string | null;
  coins: number;
  upgrades: UpgradeInfo[]; // Добавлено поле для прокачки бустеров
}
