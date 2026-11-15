export interface Company {
  slug: string;
  name: string;
  aliases: readonly string[];
  sector: string;
  description: string;
  website: string;
  logo: string;
  logoBackground?: string;
  color: string;
  accent: string;
  featured?: boolean;
}
