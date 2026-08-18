export interface Profile {
  id: string;
  label: string;
  /** accent color for the picker card + header chip */
  color: string;
}

export const PROFILES: Profile[] = [
  { id: "james-deniz", label: "James & Deniz", color: "#e8b64c" },
  { id: "kate", label: "Kate", color: "#b478e8" },
];

export function profileById(id: string | null | undefined): Profile | undefined {
  return PROFILES.find((p) => p.id === id);
}
