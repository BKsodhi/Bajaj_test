import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const EMAIL = "bhavnoor1637.be23@chitkara.edu.in";

const STATE_CAPITALS = {
  india: "Delhi",
  "andhra pradesh": "Amaravati",
  "arunachal pradesh": "Itanagar",
  assam: "Dispur",
  bihar: "Patna",
  chhattisgarh: "Raipur",
  goa: "Panaji",
  gujarat: "Gandhinagar",
  haryana: "Chandigarh",
  "himachal pradesh": "Shimla",
  jharkhand: "Ranchi",
  karnataka: "Bengaluru",
  kerala: "Thiruvananthapuram",
  "madhya pradesh": "Bhopal",
  maharashtra: "Mumbai",
  manipur: "Imphal",
  meghalaya: "Shillong",
  mizoram: "Aizawl",
  nagaland: "Kohima",
  odisha: "Bhubaneswar",
  punjab: "Chandigarh",
  rajasthan: "Jaipur",
  sikkim: "Gangtok",
  "tamil nadu": "Chennai",
  telangana: "Hyderabad",
  tripura: "Agartala",
  "uttar pradesh": "Lucknow",
  uttarakhand: "Dehradun",
  "west bengal": "Kolkata",
  chandigarh: "Chandigarh",
  delhi: "Delhi",
  jammu: "Srinagar",
  ladakh: "Leh",
  lakshadweep: "Kavaratti",
  puducherry: "Puducherry"
};

const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const isPrime = n => {
  if (n <= 1) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

app.post("/bfhl", (req, res) => {
  try {
    const body = req.body;
    let data;

    if (body.fibonacci !== undefined) {
      const n = Number(body.fibonacci);
      if (!Number.isInteger(n) || n < 0) {
        return res.status(400).json({ is_success: false });
      }
      const fib = [];
      let a = 0, b = 1;
      for (let i = 0; i < n; i++) {
        fib.push(a);
        [a, b] = [b, a + b];
      }
      data = fib;
    }

    else if (Array.isArray(body.prime)) {
      data = body.prime.filter(isPrime);
    }

    else if (Array.isArray(body.hcf)) {
      data = body.hcf.reduce((a, b) => gcd(a, b));
    }

    else if (Array.isArray(body.lcm)) {
      data = body.lcm.reduce((a, b) => lcm(a, b));
    }

    else if (typeof body.AI === "string") {
      const q = body.AI.toLowerCase();
      let answer = "Unknown";

      for (const state in STATE_CAPITALS) {
        if (q.includes(state)) {
          answer = STATE_CAPITALS[state];
          break;
        }
      }

      data = answer;
    }

    else {
      return res.status(400).json({ is_success: false });
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data
    });

  } catch {
    res.status(500).json({ is_success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
