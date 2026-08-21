import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WeightEntry = {
	id: string;
	date: string;
	weight: number;
	unit: "kg" | "lb";
};

type WeightStore = {
	entries: WeightEntry[];
	addEntry: (weight: number, date?: string) => void;
	removeEntry: (id: string) => void;
};

const makeId = () => crypto.randomUUID();

export const useWeightStore = create<WeightStore>()(
	persist(
		(set) => ({
			entries: [],

			addEntry: (weight, date) =>
				set((state) => {
					const entryDate = date ?? new Date().toISOString().slice(0, 10);

					const existingIndex = state.entries.findIndex(
						(entry) => entry.date === entryDate,
					);

					const entry: WeightEntry = {
						id: existingIndex >= 0 ? state.entries[existingIndex].id : makeId(),
						date: entryDate,
						weight,
						unit: "kg",
					};

					if (existingIndex >= 0) {
						const entries = [...state.entries];
						entries[existingIndex] = entry;

						return {
							entries: entries.sort((a, b) => b.date.localeCompare(a.date)),
						};
					}

					return {
						entries: [...state.entries, entry].sort((a, b) =>
							b.date.localeCompare(a.date),
						),
					};
				}),

			removeEntry: (id) =>
				set((state) => ({
					entries: state.entries.filter((entry) => entry.id !== id),
				})),
		}),
		{
			name: "sanchfit-weight-storage",
		},
	),
);
