import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function UserPage({ userId, amount }: { userId: string; amount: string }) {
  const imageUrl = `https://svg-generator.tiendn-works.workers.dev/image?user=${userId}&amount=${amount}`;

  return (
    <div>
      <Helmet>
        <title>User {userId} - ${amount}</title>
        <meta property="og:title" content={`User ${userId} Amount: $${amount}`} />
        <meta property="og:description" content={`This user has an amount of $${amount}.`} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="profile" />
      </Helmet>
      <h1>User {userId}</h1>
      <p>Amount: ${amount}</p>
      <img src={imageUrl} alt={`User ${userId} amount`} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/:userId" element={<UserPage userId="1" amount="100" />} />
        {/* Add more routes or fetch dynamically as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;