const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  campaigns: {
    generate: async (goal: string) => {
      const res = await fetch(`${API_BASE_URL}/campaigns/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    
    list: async () => {
      const res = await fetch(`${API_BASE_URL}/campaigns`);
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      return res.json();
    },
    
    get: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/campaigns/${id}`);
      if (!res.ok) throw new Error('Campaign not found');
      return res.json();
    },
    
    launch: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/campaigns/${id}/launch`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to launch campaign');
      return res.json();
    },
    
    analytics: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/campaigns/${id}/analytics`);
      if (!res.ok) throw new Error('Analytics not found');
      return res.json();
    },
  },
  
  customers: {
    list: async () => {
      const res = await fetch(`${API_BASE_URL}/customers`);
      if (!res.ok) throw new Error('Failed to fetch customers');
      return res.json();
    },
  },
  
  orders: {
    list: async () => {
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },
  },
  
  data: {
    seed: async () => {
      const res = await fetch(`${API_BASE_URL}/data/seed`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to seed data');
      return res.json();
    },
  },
};
