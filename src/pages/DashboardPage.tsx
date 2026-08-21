import { Link } from "react-router-dom";
import {
	Activity,
	ChevronLeft,
	ChevronRight,
	Dumbbell,
	Flame,
	Settings,
	Utensils,
} from "lucide-react";

function DashboardPage() {
	const today = new Date();

	const days = Array.from({ length: 7 }, (_, index) => {
		const date = new Date(today);

		date.setDate(today.getDate() - (6 - index));

		return {
			day: date
				.toLocaleDateString("en-US", {
					weekday: "short",
				})
				.charAt(0),
			date: date.getDate(),
			isToday: date.toDateString() === today.toDateString(),
		};
	});

	return (
		<div className="dashboard dashboard-reference">
			{/* =====================================================
          HEADER
          ===================================================== */}

			<section className="dashboard-top">
				<div>
					<h1>Home</h1>
				</div>

				<button className="dashboard-icon-button" aria-label="Calendar">
					<span>▦</span>
				</button>
			</section>

			{/* =====================================================
          DATE SELECTOR
          ===================================================== */}

			<section className="dashboard-calendar">
				<button className="calendar-arrow" aria-label="Previous week">
					<ChevronLeft size={15} />
				</button>

				<div className="calendar-days">
					{days.map((day) => (
						<div
							className={`calendar-day ${day.isToday ? "active" : ""}`}
							key={`${day.date}-${day.day}`}
						>
							<span>{day.day}</span>

							<strong>{day.date}</strong>
						</div>
					))}
				</div>

				<button className="calendar-arrow" aria-label="Next week">
					<ChevronRight size={15} />
				</button>
			</section>

			{/* =====================================================
          BODYWEIGHT
          ===================================================== */}

			<section className="bodyweight-section">
				<div className="bodyweight-content">
					<p className="dashboard-label">BODYWEIGHT</p>

					<div className="bodyweight-value">
						<strong>0.0</strong>

						<span>kg</span>
					</div>

					<p className="bodyweight-change">
						This week <strong>—</strong>
					</p>
					<Link to="/progress" className="weight-details-link">
						View details
					</Link>
				</div>

				<div className="weight-chart">
					<div className="chart-bars">
						{days.map((day, index) => (
							<span
								key={`bar-${day.date}`}
								className={day.isToday ? "chart-bar current" : "chart-bar"}
								style={{
									height: `${35 + (index % 4) * 13}px`,
								}}
							/>
						))}
					</div>

					<div className="chart-days">
						{days.map((day) => (
							<span key={`chart-${day.date}`}>{day.day}</span>
						))}
					</div>
				</div>
			</section>

			{/* =====================================================
          CALORIES + MACROS
          ===================================================== */}

			<section className="nutrition-grid">
				<article className="nutrition-card calories-card">
					<p className="dashboard-label">CALORIES</p>

					<div className="calorie-content">
						<div className="calorie-ring">
							<div>
								<strong>0%</strong>
							</div>
						</div>

						<p className="calorie-total">
							<strong>0</strong>
							<span>/ 2,800</span>
						</p>

						<span className="calorie-unit">kcal</span>
					</div>
				</article>

				<article className="nutrition-card macro-card">
					<div className="macro-row">
						<div>
							<span>PROTEIN</span>
							<strong>0g / 180g</strong>
						</div>

						<div className="macro-line">
							<span />
						</div>
					</div>

					<div className="macro-row">
						<div>
							<span>CARBS</span>
							<strong>0g / 300g</strong>
						</div>

						<div className="macro-line">
							<span />
						</div>
					</div>

					<div className="macro-row">
						<div>
							<span>FAT</span>
							<strong>0g / 70g</strong>
						</div>

						<div className="macro-line">
							<span />
						</div>
					</div>
				</article>
			</section>

			{/* =====================================================
          QUICK ACTIONS
          ===================================================== */}

			<section className="dashboard-actions">
				<article className="dashboard-action-card">
					<div>
						<h2>Workouts</h2>

						<p>Track and improve</p>
					</div>

					<button className="dashboard-black-button">
						<Dumbbell size={14} />
						Start
					</button>
				</article>

				<article className="dashboard-action-card">
					<div>
						<h2>Meals</h2>

						<p>Log and track nutrition</p>
					</div>

					<button className="dashboard-black-button">
						<Utensils size={14} />
						Log
					</button>
				</article>
			</section>

			{/* =====================================================
          SMALL ACTIVITY SUMMARY
          ===================================================== */}

			<section className="dashboard-mini-summary">
				<div>
					<Flame size={17} />
					<span>Streak</span>
					<strong>0 days</strong>
				</div>

				<div>
					<Activity size={17} />
					<span>This week</span>
					<strong>0 hrs</strong>
				</div>

				<div>
					<Dumbbell size={17} />
					<span>Workouts</span>
					<strong>0</strong>
				</div>

				<button
					className="dashboard-settings-button"
					aria-label="Dashboard settings"
				>
					<Settings size={17} />
				</button>
			</section>
		</div>
	);
}

export default DashboardPage;
