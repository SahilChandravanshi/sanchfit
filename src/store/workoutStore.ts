import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WeightUnit = "kg" | "lb";

export type SetType = "working" | "warmup" | "drop" | "failure";

export type WorkoutSet = {
	id: string;
	type: SetType;
	weight: number;
	reps: number;
	rpe?: number;
	rir?: number;
	completed: boolean;
};

export type WorkoutExercise = {
	id: string;
	name: string;
	muscleGroup: string;
	notes?: string;
	sets: WorkoutSet[];
};

export type Workout = {
	id: string;
	name: string;
	date: string;
	startedAt: string;
	completedAt?: string;
	durationMinutes?: number;
	notes?: string;
	unit: WeightUnit;
	exercises: WorkoutExercise[];
};

export const exerciseLibrary = [
	["Barbell Squat", "Quads"],
	["Bench Press", "Chest"],
	["Deadlift", "Back"],
	["Overhead Press", "Shoulders"],
	["Barbell Row", "Back"],
	["Pull-Up", "Back"],
	["Lat Pulldown", "Back"],
	["Leg Press", "Quads"],
	["Romanian Deadlift", "Hamstrings"],
	["Dumbbell Curl", "Biceps"],
	["Triceps Pushdown", "Triceps"],
	["Lateral Raise", "Shoulders"],
	["Leg Curl", "Hamstrings"],
	["Calf Raise", "Calves"],
	["Cable Fly", "Chest"],
	["Dumbbell Row", "Back"],
] as const;

const makeId = () => crypto.randomUUID();

const makeSet = (type: SetType = "working"): WorkoutSet => ({
	id: makeId(),
	type,
	weight: 0,
	reps: 0,
	completed: false,
});

const makeExercise = (name: string, muscleGroup: string): WorkoutExercise => ({
	id: makeId(),
	name,
	muscleGroup,
	sets: [makeSet()],
});

type WorkoutState = {
	workouts: Workout[];
	activeWorkout: Workout | null;

	startWorkout: (name?: string) => void;

	updateActiveWorkout: (updates: Partial<Workout>) => void;

	addExercise: (name: string, muscleGroup: string) => void;

	updateExercise: (
		exerciseId: string,
		updates: Partial<WorkoutExercise>,
	) => void;

	removeExercise: (exerciseId: string) => void;

	addSet: (exerciseId: string, type?: SetType) => void;

	updateSet: (
		exerciseId: string,
		setId: string,
		updates: Partial<WorkoutSet>,
	) => void;

	removeSet: (exerciseId: string, setId: string) => void;

	finishWorkout: () => void;
	cancelWorkout: () => void;

	deleteWorkout: (workoutId: string) => void;
};

export const useWorkoutStore = create<WorkoutState>()(
	persist(
		(set) => ({
			workouts: [],

			activeWorkout: null,

			startWorkout: (name = "New Workout") =>
				set({
					activeWorkout: {
						id: makeId(),

						name,

						date: new Date().toISOString().slice(0, 10),

						startedAt: new Date().toISOString(),

						unit: "kg",

						exercises: [],
					},
				}),

			updateActiveWorkout: (updates) =>
				set((state) =>
					state.activeWorkout
						? {
								activeWorkout: {
									...state.activeWorkout,
									...updates,
								},
							}
						: state,
				),

			addExercise: (name, muscleGroup) =>
				set((state) =>
					state.activeWorkout
						? {
								activeWorkout: {
									...state.activeWorkout,

									exercises: [
										...state.activeWorkout.exercises,

										makeExercise(name, muscleGroup),
									],
								},
							}
						: state,
				),

			updateExercise: (exerciseId, updates) =>
				set((state) =>
					state.activeWorkout
						? {
								activeWorkout: {
									...state.activeWorkout,

									exercises: state.activeWorkout.exercises.map((exercise) =>
										exercise.id === exerciseId
											? {
													...exercise,
													...updates,
												}
											: exercise,
									),
								},
							}
						: state,
				),

			removeExercise: (exerciseId) =>
				set((state) =>
					state.activeWorkout
						? {
								activeWorkout: {
									...state.activeWorkout,

									exercises: state.activeWorkout.exercises.filter(
										(exercise) => exercise.id !== exerciseId,
									),
								},
							}
						: state,
				),

			addSet: (exerciseId, type = "working") =>
				set((state) =>
					state.activeWorkout
						? {
								activeWorkout: {
									...state.activeWorkout,

									exercises: state.activeWorkout.exercises.map((exercise) =>
										exercise.id === exerciseId
											? {
													...exercise,

													sets: [...exercise.sets, makeSet(type)],
												}
											: exercise,
									),
								},
							}
						: state,
				),

			updateSet: (exerciseId, setId, updates) =>
				set((state) =>
					state.activeWorkout
						? {
								activeWorkout: {
									...state.activeWorkout,

									exercises: state.activeWorkout.exercises.map((exercise) =>
										exercise.id === exerciseId
											? {
													...exercise,

													sets: exercise.sets.map((workoutSet) =>
														workoutSet.id === setId
															? {
																	...workoutSet,
																	...updates,
																}
															: workoutSet,
													),
												}
											: exercise,
									),
								},
							}
						: state,
				),

			removeSet: (exerciseId, setId) =>
				set((state) =>
					state.activeWorkout
						? {
								activeWorkout: {
									...state.activeWorkout,

									exercises: state.activeWorkout.exercises.map((exercise) =>
										exercise.id === exerciseId
											? {
													...exercise,

													sets: exercise.sets.filter(
														(workoutSet) => workoutSet.id !== setId,
													),
												}
											: exercise,
									),
								},
							}
						: state,
				),

			finishWorkout: () =>
				set((state) => {
					if (!state.activeWorkout) {
						return state;
					}

					const completedAt = new Date().toISOString();

					const durationMinutes = Math.max(
						1,

						Math.round(
							(Date.parse(completedAt) -
								Date.parse(state.activeWorkout.startedAt)) /
								60000,
						),
					);

					return {
						workouts: [
							{
								...state.activeWorkout,

								completedAt,

								durationMinutes,
							},

							...state.workouts,
						],

						activeWorkout: null,
					};
				}),

			cancelWorkout: () =>
				set({
					activeWorkout: null,
				}),

			deleteWorkout: (workoutId) =>
				set((state) => ({
					workouts: state.workouts.filter(
						(workout) => workout.id !== workoutId,
					),
				})),
		}),

		{
			name: "sanchfit-workouts-v1",

			version: 1,
		},
	),
);

export const getWorkoutVolume = (workout: Workout) =>
	workout.exercises.reduce(
		(total, exercise) =>
			total +
			exercise.sets.reduce(
				(sum, set) => sum + (set.completed ? set.weight * set.reps : 0),

				0,
			),

		0,
	);

export const getEstimatedOneRepMax = (weight: number, reps: number) =>
	weight > 0 && reps > 0 ? Math.round(weight * (1 + reps / 30)) : 0;

export const getWorkoutSetCount = (workout: Workout) =>
	workout.exercises.reduce(
		(total, exercise) => total + exercise.sets.length,

		0,
	);

export const getCompletedSetCount = (workout: Workout) =>
	workout.exercises.reduce(
		(total, exercise) =>
			total + exercise.sets.filter((set) => set.completed).length,

		0,
	);
