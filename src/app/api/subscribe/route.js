// export default async function handler(req, res) {
//     const response = await fetch('https://your-dotnet-backend/api/subscription/create-session', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             successUrl: 'https://your-frontend/success',
//             cancelUrl: 'https://your-frontend/cancel',
//         }),
//     });

//     const data = await response.json();
//     res.status(200).json(data);
// }
