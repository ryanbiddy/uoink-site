export const slots: { name: string; shapes: string[]; audio: boolean }[];
export function renderSlot(slot: typeof slots[number], directory?: string): string;
