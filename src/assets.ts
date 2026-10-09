// Image paths resolved against Vite's base URL so they work in dev, production
// builds and when deployed under a sub-path (e.g. GitHub Pages).
const base = import.meta.env.BASE_URL;

export const IMG = {
  portechar: `${base}images/portechar.jpg`,
  freight: `${base}images/freight.jpg`,
  cockpit: `${base}images/cockpit.jpg`,
} as const;
