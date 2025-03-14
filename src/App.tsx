import { Route, Routes } from "react-router-dom";
// import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams } from "react-router-dom";

function UserPage() {
	// Get userId from URL parameters
	const { userId } = useParams<{ userId: string }>();
	const amount = "100"; // This could also come from props or API call if needed

	const imageUrl = `https://svg-generator.tiendn-works.workers.dev/image?user=${userId}&amount=${amount}`;
	const pageUrl = `/user/${userId}`;

	return (
		<div>
			<head>
				<title>
					User {userId} - ${amount}
				</title>
				<meta property="og:title" content={`User ${userId} Amount: $${amount}`} />
				<meta
					property="og:description"
					content={`This user has an amount of $${amount}.`}
				/>
				<meta property="og:image" content={imageUrl} />
				<meta property="og:url" content={pageUrl} />
				<meta property="og:type" content="profile" />
			</head>
			<h1>User {userId}</h1>
			<p>Amount: ${amount}</p>
			<img src={imageUrl} alt={`User ${userId} amount`} />
		</div>
	);
}

function App() {
	return (
		// <HelmetProvider>
		<Routes>
			<Route path="/user/:userId" element={<UserPage />} />
			{/* Add more routes or fetch dynamically as needed */}
		</Routes>
		// </HelmetProvider>
	);
}

export default App;
