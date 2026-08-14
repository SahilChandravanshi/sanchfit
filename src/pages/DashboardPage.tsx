import {
  Activity,
  Dumbbell,
  Flame,
  Target,
} from 'lucide-react'

function DashboardPage() {
  return (
    <div className="dashboard">
      <section className="welcome">
        <p className="eyebrow">YOUR FITNESS COMPANION</p>

        <h1>Ready to move?</h1>

        <p className="subtitle">
          Build consistency. Track progress. Get stronger.
        </p>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon mint-icon">
            <Flame size={18} strokeWidth={1.9} />
          </div>

          <div>
            <span>Current streak</span>
            <strong>0 days</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon peach-icon">
            <Dumbbell size={18} strokeWidth={1.9} />
          </div>

          <div>
            <span>Workouts</span>
            <strong>0</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon mint-icon">
            <Activity size={18} strokeWidth={1.9} />
          </div>

          <div>
            <span>This week</span>
            <strong>0 hrs</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon peach-icon">
            <Target size={18} strokeWidth={1.9} />
          </div>

          <div>
            <span>Goals</span>
            <strong>0 / 0</strong>
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel featured-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">TODAY</p>
              <h2>Today's workout</h2>
            </div>
          </div>

          <div className="empty-state">
            <div className="empty-icon mint-icon">
              <Dumbbell size={28} strokeWidth={1.6} />
            </div>

            <h3>No workout planned</h3>

            <p>
              Create your first workout and start tracking your progress.
            </p>

            <button className="primary-button">
              Create workout
            </button>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">PROGRESS</p>
              <h2>Your journey</h2>
            </div>
          </div>

          <div className="empty-state">
            <div className="empty-icon peach-icon">
              <Activity size={28} strokeWidth={1.6} />
            </div>

            <h3>Your progress starts here</h3>

            <p>
              Complete workouts and track measurements to see your journey.
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}

export default DashboardPage