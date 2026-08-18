import { useState } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Dumbbell,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import {
  exerciseLibrary,
  getEstimatedOneRepMax,
  useWorkoutStore,
  type SetType,
} from '../store/workoutStore'

const setTypeLabels: Record<SetType, string> = {
  working: 'Working',
  warmup: 'Warm-up',
  drop: 'Drop',
  failure: 'Failure',
}

export default function WorkoutsPage() {
  const {
    activeWorkout,
    workouts,
    startWorkout,
    updateActiveWorkout,
    addExercise,
    removeExercise,
    addSet,
    updateSet,
    removeSet,
    finishWorkout,
    cancelWorkout,
  } = useWorkoutStore()

  const [showExercisePicker, setShowExercisePicker] =
    useState(false)

  const [expandedExercise, setExpandedExercise] =
    useState<string | null>(null)

  const [customExercise, setCustomExercise] =
    useState('')

  const [showHistory, setShowHistory] =
    useState(false)

  const startNewWorkout = () => {
    startWorkout('Workout')
    setShowHistory(false)
  }

  const addCustomExercise = () => {
    const name = customExercise.trim()

    if (!name) return

    addExercise(name, 'Custom')
    setCustomExercise('')
    setShowExercisePicker(false)
  }

  const selectExercise = (
    name: string,
    muscleGroup: string,
  ) => {
    addExercise(name, muscleGroup)
    setShowExercisePicker(false)
  }

  if (!activeWorkout) {
    return (
      <section className="workouts-page">
        <div className="workouts-header">
          <div>
            <span className="eyebrow">TRAINING</span>

            <h1>Workout Tracker</h1>

            <p>
              Log your training, track your strength,
              and build a history that actually matters.
            </p>
          </div>

          <button
            className="primary-action"
            onClick={startNewWorkout}
          >
            <Plus size={18} />
            Start Workout
          </button>
        </div>

        <div className="workout-overview-grid">
          <div className="workout-stat-card">
            <span>Workouts</span>
            <strong>{workouts.length}</strong>
          </div>

          <div className="workout-stat-card">
            <span>This week</span>
            <strong>
              {
                workouts.filter((workout) => {
                  const date =
                    new Date(workout.date)

                  const now = new Date()

                  const diff =
                    now.getTime() -
                    date.getTime()

                  return (
                    diff <=
                    7 * 24 * 60 * 60 * 1000
                  )
                }).length
              }
            </strong>
          </div>

          <div className="workout-stat-card">
            <span>Last workout</span>
            <strong>
              {workouts[0]
                ? workouts[0].name
                : '—'}
            </strong>
          </div>
        </div>

        <div className="workout-section-heading">
          <div>
            <h2>Recent workouts</h2>

            <p>
              Your latest training sessions.
            </p>
          </div>

          {workouts.length > 0 && (
            <button
              className="text-action"
              onClick={() =>
                setShowHistory(
                  !showHistory,
                )
              }
            >
              {showHistory
                ? 'Hide history'
                : 'View all'}
            </button>
          )}
        </div>

        {workouts.length === 0 ? (
          <div className="empty-workout-card">
            <div className="empty-workout-icon">
              <Dumbbell size={25} />
            </div>

            <h3>No workouts yet</h3>

            <p>
              Start your first workout and
              SanchFit will begin building
              your training history.
            </p>

            <button
              className="primary-action"
              onClick={startNewWorkout}
            >
              <Plus size={18} />
              Start your first workout
            </button>
          </div>
        ) : (
          <div className="workout-history-list">
            {(showHistory
              ? workouts
              : workouts.slice(0, 5)
            ).map((workout) => (
              <div
                className="workout-history-card"
                key={workout.id}
              >
                <div>
                  <strong>
                    {workout.name}
                  </strong>

                  <span>
                    {workout.date}
                  </span>
                </div>

                <div>
                  <span>
                    {workout.exercises.length}{' '}
                    exercises
                  </span>

                  <span>
                    {workout.durationMinutes
                      ? `${workout.durationMinutes} min`
                      : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="workouts-page active-workout-page">
      <header className="active-workout-header">
        <div>
          <span className="eyebrow">
            WORKOUT IN PROGRESS
          </span>

          <input
            className="workout-title-input"
            value={activeWorkout.name}
            onChange={(event) =>
              updateActiveWorkout({
                name: event.target.value,
              })
            }
          />

          <div className="workout-meta">
            <span>
              <Clock3 size={15} />
              {activeWorkout.date}
            </span>

            <select
              value={activeWorkout.unit}
              onChange={(event) =>
                updateActiveWorkout({
                  unit: event.target
                    .value as 'kg' | 'lb',
                })
              }
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>

        <div className="active-workout-actions">
          <button
            className="secondary-action"
            onClick={cancelWorkout}
          >
            <X size={17} />
            Cancel
          </button>

          <button
            className="primary-action"
            onClick={finishWorkout}
          >
            <Check size={17} />
            Finish
          </button>
        </div>
      </header>

      <div className="exercise-list">
        {activeWorkout.exercises.length ===
        0 ? (
          <div className="empty-workout-card compact">
            <div className="empty-workout-icon">
              <Dumbbell size={23} />
            </div>

            <h3>Add your first exercise</h3>

            <p>
              Choose an exercise below to
              start logging your sets.
            </p>
          </div>
        ) : (
          activeWorkout.exercises.map(
            (exercise, exerciseIndex) => {
              const expanded =
                expandedExercise ===
                exercise.id

              return (
                <article
                  className="exercise-card"
                  key={exercise.id}
                >
                  <div className="exercise-card-header">
                    <button
                      className="exercise-heading"
                      onClick={() =>
                        setExpandedExercise(
                          expanded
                            ? null
                            : exercise.id,
                        )
                      }
                    >
                      <span className="exercise-number">
                        {String(
                          exerciseIndex + 1,
                        ).padStart(2, '0')}
                      </span>

                      <span>
                        <strong>
                          {exercise.name}
                        </strong>

                        <small>
                          {exercise.muscleGroup}
                        </small>
                      </span>
                    </button>

                    <div className="exercise-heading-actions">
                      <button
                        className="icon-button"
                        onClick={() =>
                          setExpandedExercise(
                            expanded
                              ? null
                              : exercise.id,
                          )
                        }
                        aria-label="Toggle exercise"
                      >
                        {expanded ? (
                          <ChevronUp
                            size={18}
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                          />
                        )}
                      </button>

                      <button
                        className="icon-button danger"
                        onClick={() =>
                          removeExercise(
                            exercise.id,
                          )
                        }
                        aria-label="Remove exercise"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="exercise-content">
                      <div className="set-table-header">
                        <span>SET</span>
                        <span>TYPE</span>
                        <span>WEIGHT</span>
                        <span>REPS</span>
                        <span>RPE</span>
                        <span />
                      </div>

                      {exercise.sets.map(
                        (
                          workoutSet,
                          setIndex,
                        ) => (
                          <div
                            className={`set-row ${
                              workoutSet.completed
                                ? 'completed'
                                : ''
                            }`}
                            key={
                              workoutSet.id
                            }
                          >
                            <span className="set-number">
                              {setIndex + 1}
                            </span>

                            <select
                              value={
                                workoutSet.type
                              }
                              onChange={(
                                event,
                              ) =>
                                updateSet(
                                  exercise.id,
                                  workoutSet.id,
                                  {
                                    type: event
                                      .target
                                      .value as SetType,
                                  },
                                )
                              }
                            >
                              {Object.entries(
                                setTypeLabels,
                              ).map(
                                ([
                                  value,
                                  label,
                                ]) => (
                                  <option
                                    value={
                                      value
                                    }
                                    key={
                                      value
                                    }
                                  >
                                    {label}
                                  </option>
                                ),
                              )}
                            </select>

                            <input
                              type="number"
                              min="0"
                              inputMode="decimal"
                              placeholder="0"
                              value={
                                workoutSet.weight ||
                                ''
                              }
                              onChange={(
                                event,
                              ) =>
                                updateSet(
                                  exercise.id,
                                  workoutSet.id,
                                  {
                                    weight:
                                      Number(
                                        event
                                          .target
                                          .value,
                                      ),
                                  },
                                )
                              }
                            />

                            <input
                              type="number"
                              min="0"
                              inputMode="numeric"
                              placeholder="0"
                              value={
                                workoutSet.reps ||
                                ''
                              }
                              onChange={(
                                event,
                              ) =>
                                updateSet(
                                  exercise.id,
                                  workoutSet.id,
                                  {
                                    reps:
                                      Number(
                                        event
                                          .target
                                          .value,
                                      ),
                                  },
                                )
                              }
                            />

                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              inputMode="decimal"
                              placeholder="—"
                              value={
                                workoutSet.rpe ??
                                ''
                              }
                              onChange={(
                                event,
                              ) =>
                                updateSet(
                                  exercise.id,
                                  workoutSet.id,
                                  {
                                    rpe:
                                      event
                                        .target
                                        .value ===
                                      ''
                                        ? undefined
                                        : Number(
                                            event
                                              .target
                                              .value,
                                          ),
                                  },
                                )
                              }
                            />

                            <div className="set-actions">
                              <button
                                className={`complete-set-button ${
                                  workoutSet.completed
                                    ? 'is-complete'
                                    : ''
                                }`}
                                onClick={() =>
                                  updateSet(
                                    exercise.id,
                                    workoutSet.id,
                                    {
                                      completed:
                                        !workoutSet.completed,
                                    },
                                  )
                                }
                                aria-label="Complete set"
                              >
                                <Check
                                  size={16}
                                />
                              </button>

                              <button
                                className="remove-set-button"
                                onClick={() =>
                                  removeSet(
                                    exercise.id,
                                    workoutSet.id,
                                  )
                                }
                                aria-label="Remove set"
                              >
                                <X size={15} />
                              </button>
                            </div>

                            {workoutSet.weight >
                              0 &&
                              workoutSet.reps >
                                0 && (
                                <span className="estimated-1rm">
                                  e1RM{' '}
                                  {getEstimatedOneRepMax(
                                    workoutSet.weight,
                                    workoutSet.reps,
                                  )}
                                </span>
                              )}
                          </div>
                        ),
                      )}

                      <div className="exercise-footer">
                        <button
                          className="add-set-button"
                          onClick={() =>
                            addSet(
                              exercise.id,
                            )
                          }
                        >
                          <Plus size={16} />
                          Add set
                        </button>

                        <span>
                          {
                            exercise.sets.length
                          }{' '}
                          sets
                        </span>
                      </div>
                    </div>
                  )}
                </article>
              )
            },
          )
        )}
      </div>

      <button
        className="add-exercise-button"
        onClick={() =>
          setShowExercisePicker(true)
        }
      >
        <Plus size={18} />
        Add Exercise
      </button>

      {showExercisePicker && (
        <div
          className="workout-modal-backdrop"
          onMouseDown={() =>
            setShowExercisePicker(false)
          }
        >
          <div
            className="workout-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="workout-modal-header">
              <div>
                <span className="eyebrow">
                  EXERCISES
                </span>

                <h2>Add exercise</h2>
              </div>

              <button
                className="icon-button"
                onClick={() =>
                  setShowExercisePicker(
                    false,
                  )
                }
              >
                <X size={19} />
              </button>
            </div>

            <div className="custom-exercise">
              <input
                placeholder="Create custom exercise..."
                value={customExercise}
                onChange={(event) =>
                  setCustomExercise(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter'
                  ) {
                    addCustomExercise()
                  }
                }}
              />

              <button
                className="secondary-action"
                onClick={
                  addCustomExercise
                }
              >
                Create
              </button>
            </div>

            <div className="exercise-library">
              {exerciseLibrary.map(
                ([name, muscleGroup]) => (
                  <button
                    className="exercise-library-item"
                    key={name}
                    onClick={() =>
                      selectExercise(
                        name,
                        muscleGroup,
                      )
                    }
                  >
                    <span>
                      <strong>
                        {name}
                      </strong>

                      <small>
                        {muscleGroup}
                      </small>
                    </span>

                    <Plus size={17} />
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
