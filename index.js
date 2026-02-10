require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

const MY_EMAIL = "bhavnoor1637.be23@chitkara.edu.in"; // <--- DOUBLE CHECK THIS
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Math Helpers ---
const getFibonacci = (n) => {
    let res = [0, 1];
    for (let i = 2; i < n; i++) res.push(res[i-1] + res[i-2]);
    return res.slice(0, n);
};

const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) if (num % i === 0) return false;
    return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

// --- Endpoints ---

// GET /health
app.get('/health', (req, res) => {
    res.json({ is_success: true, official_email: MY_EMAIL });
});

// POST /bfhl
app.post('/bfhl', async (req, res) => {
    try {
        const body = req.body;
        let responseData;

        if (body.fibonacci !== undefined) {
            responseData = getFibonacci(parseInt(body.fibonacci));
        } 
        else if (body.prime) {
            responseData = body.prime.filter(n => isPrime(n));
        } 
        else if (body.hcf) {
            responseData = body.hcf.reduce((a, b) => gcd(a, b));
        } 
        else if (body.lcm) {
            responseData = body.lcm.reduce((a, b) => lcm(a, b));
        } 
        else if (body.AI) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(`Answer the following question in exactly one word: ${body.AI}`);
            const response = await result.response;
            responseData = response.text().trim().replace(/[^\w\s]/gi, ''); 
        } 
        else {
            return res.status(400).json({ is_success: false, message: "Invalid Input" });
        }

        res.status(200).json({
            is_success: true,
            official_email: MY_EMAIL,
            data: responseData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ is_success: false, error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));