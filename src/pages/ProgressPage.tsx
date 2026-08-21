import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Plus,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  useWeightStore,
  type WeightEntry,
} from '../store/weightStore'

type Range = 'daily' | 'weekly' | 'monthly' | 'yearly'

const ranges: {
  value: Range
  label: string
}[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

function getRangeStart(range: Range) {
  const date = new Date()

  if (range === 'daily') {
    date.setDate(date.getDate() - 6)
  }

  if (range === 'weekly') {
    date.setDate(date.getDate() - 42)
  }

  if (range === 'monthly') {
    date.setMonth(date.getMonth() - 6)
  }

  if (range === 'yearly') {
    date.setFullYear(date.getFullYear() - 1)
  }

  return date
}

function getChartEntries(
  entries: WeightEntry[],
  range: Range,
) {
  const start = getRangeStart(range)

  return entries
    .filter(
      (entry) =>
        new Date(entry.date) >= start,
    )
    .sort((a, b) =>
      a.date.localeCompare(b.date),
    )
}

function WeightChart({
  entries,
}: {
  entries: WeightEntry[]
}) {
  if (entries.length === 0) {
    return (
      <div className="weight-detail-empty">
        <p>No weight data yet.</p>
        <span>
          Add your first measurement to start
          tracking your progress.
        </span>
      </div>
    )
  }

  const width = 760
  const height = 260
  const paddingX = 32
  const paddingY = 30

  const values = entries.map(
    (entry) => entry.weight,
  )

  const min = Math.min(...values)
  const max = Math.max(...values)

  const range = Math.max(max - min, 1)

  const points = entries.map(
    (entry, index) => {
      const x =
        entries.length === 1
          ? width / 2
          : paddingX +
            (index /
              (entries.length - 1)) *
              (width - paddingX * 2)

      const y =
        height -
        paddingY -
        ((entry.weight - min) / range) *
          (height - paddingY * 2)

      return {
        x,
        y,
        entry,
      }
    },
  )

  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${
          point.x
        } ${point.y}`,
    )
    .join(' ')

  return (
    <div className="weight-chart-large">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Weight progress chart"
      >
        <line
          x1={paddingX}
          x2={width - paddingX}
          y1={height - paddingY}
          y2={height - paddingY}
          className="weight-chart-axis"
        />

        <path
          d={path}
          className="weight-chart-line"
          fill="none"
        />

        {points.map((point) => (
          <circle
            key={point.entry.id}
            cx={point.x}
            cy={point.y}
            r="4"
            className="weight-chart-point"
          />
        ))}
      </svg>

      <div className="weight-chart-labels">
        {points.map((point) => (
          <span key={point.entry.id}>
            {new Date(
              point.entry.date,
            ).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        ))}
      </div>
    </div>
  )
}

function ProgressPage() {
  const {
    entries,
    addEntry,
    removeEntry,
  } = useWeightStore()

  const [range, setRange] =
    useState<Range>('monthly')

  const [weight, setWeight] =
    useState('')

  const [date, setDate] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 10),
    )

  const chartEntries = useMemo(
    () =>
      getChartEntries(
        entries,
        range,
      ),
    [entries, range],
  )

  const latestWeight =
    entries.length > 0
      ? entries[0].weight
      : null

  const previousWeight =
    entries.length > 1
      ? entries[1].weight
      : null

  const change =
    latestWeight !== null &&
    previousWeight !== null
      ? latestWeight - previousWeight
      : null

  const submitWeight = () => {
    const value = Number(weight)

    if (!value || value <= 0) return

    addEntry(value, date)
    setWeight('')
  }

  return (
    <section className="weight-page">
      <header className="weight-page-header">
        <div>
          <Link
            to="/"
            className="weight-back-button"
          >
            <ArrowLeft size={16} />
            Home
          </Link>

          <p className="eyebrow">
            BODYWEIGHT
          </p>

          <h1>Weight tracking</h1>

          <p>
            Track your bodyweight and see how
            it changes over time.
          </p>
        </div>
      </header>

      <section className="weight-summary-grid">
        <article className="weight-summary-card">
          <span>Current weight</span>

          <strong>
            {latestWeight !== null
              ? `${latestWeight.toFixed(1)} kg`
              : '0.0 kg'}
          </strong>
        </article>

        <article className="weight-summary-card">
          <span>Change</span>

          <strong>
            {change !== null
              ? `${change > 0 ? '+' : ''}${change.toFixed(1)} kg`
              : '—'}
          </strong>
        </article>

        <article className="weight-summary-card">
          <span>Measurements</span>

          <strong>
            {entries.length}
          </strong>
        </article>
      </section>

      <section className="weight-chart-card">
        <div className="weight-chart-header">
          <div>
            <p className="dashboard-label">
              PROGRESS
            </p>

            <h2>Weight over time</h2>
          </div>

          <div className="weight-range-selector">
            {ranges.map((item) => (
              <button
                key={item.value}
                className={
                  range === item.value
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setRange(item.value)
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <WeightChart
          entries={chartEntries}
        />
      </section>

      <section className="weight-entry-card">
        <div>
          <p className="dashboard-label">
            ADD MEASUREMENT
          </p>

          <h2>Log your weight</h2>
        </div>

        <div className="weight-entry-form">
          <label>
            Weight
            <input
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              placeholder="0.0"
              value={weight}
              onChange={(event) =>
                setWeight(
                  event.target.value,
                )
              }
            />
          </label>

          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
            />
          </label>

          <button
            className="dashboard-black-button"
            onClick={submitWeight}
          >
            <Plus size={15} />
            Add
          </button>
        </div>
      </section>

      {entries.length > 0 && (
        <section className="weight-history-card">
          <div className="weight-history-header">
            <div>
              <p className="dashboard-label">
                HISTORY
              </p>

              <h2>Measurements</h2>
            </div>
          </div>

          <div className="weight-history-list">
            {entries.map((entry) => (
              <div
                className="weight-history-row"
                key={entry.id}
              >
                <span>
                  {new Date(
                    entry.date,
                  ).toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    },
                  )}
                </span>

                <strong>
                  {entry.weight.toFixed(1)} kg
                </strong>

                <button
                  className="weight-delete-button"
                  onClick={() =>
                    removeEntry(entry.id)
                  }
                  aria-label="Delete measurement"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}

export default ProgressPage