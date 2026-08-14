import { BarChart3, Dumbbell, Home, UserRound } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const navigation = [
	{
		label: "Home",
		to: "/",
		icon: Home,
	},
	{
		label: "Workouts",
		to: "/workouts",
		icon: Dumbbell,
	},
	{
		label: "Progress",
		to: "/progress",
		icon: BarChart3,
	},
	{
		label: "Profile",
		to: "/profile",
		icon: UserRound,
	},
];

export default function AppShell() {
	return (
		<div className="app-shell">
			{/* ==================================================
          DESKTOP SIDEBAR
      ================================================== */}

			<aside className="desktop-sidebar">
				<div className="sidebar-brand">
					<div className="brand-mark">S</div>
					<span>SanchFit</span>
				</div>

				<nav className="sidebar-nav">
					{navigation.map(({ label, to, icon: Icon }) => (
						<NavLink
							key={to}
							to={to}
							end={to === "/"}
							className={({ isActive }) =>
								`nav-item ${isActive ? "active" : ""}`
							}
						>
							{({ isActive }) => (
								<>
									{isActive && (
										<motion.div
											layoutId="sanchfit-desktop-active-pill"
											className="desktop-nav-pill"
											transition={{
												type: "spring",
												stiffness: 420,
												damping: 30,
												mass: 0.8,
											}}
										/>
									)}

									<Icon />
									<span>{label}</span>
								</>
							)}
						</NavLink>
					))}
				</nav>

				<div className="sidebar-profile">
					<div className="avatar">S</div>

					<div className="sidebar-profile-info">
						<strong>SanchFit</strong>
						<small>Your fitness companion</small>
					</div>
				</div>
			</aside>

			{/* ==================================================
          MAIN CONTENT
      ================================================== */}

			<div className="app-content">
				{/* MOBILE HEADER */}

				<header className="mobile-header">
					<div className="brand">
						<div className="brand-mark">S</div>

						<span className="brand-name">SanchFit</span>
					</div>

					<div className="mobile-avatar">S</div>
				</header>

				{/* PAGE CONTENT */}

				<main className="page-content">
					<Outlet />
				</main>

				{/* ==================================================
            MOBILE NAVIGATION
        ================================================== */}

				<nav className="mobile-nav">
					{navigation.map(({ label, to, icon: Icon }) => (
						<NavLink
							key={to}
							to={to}
							end={to === "/"}
							className={({ isActive }) =>
								`mobile-nav-item ${isActive ? "active" : ""}`
							}
						>
							{({ isActive }) => (
								<>
									{isActive && (
										<motion.div
											layoutId="sanchfit-active-nav-pill"
											className="mobile-nav-pill"
											transition={{
												type: "spring",
												stiffness: 420,
												damping: 30,
												mass: 0.8,
											}}
										/>
									)}

									<Icon />

									<motion.span
										initial={false}
										animate={{
											maxWidth: isActive ? 75 : 0,
											opacity: isActive ? 1 : 0,
											x: isActive ? 0 : -5,
										}}
										transition={{
											duration: 0.22,
											ease: [0.22, 1, 0.36, 1],
										}}
									>
										{label}
									</motion.span>
								</>
							)}
						</NavLink>
					))}
				</nav>
			</div>
		</div>
	);
}
