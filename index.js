const express = require('express');
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

const SUBMISSIONS = [];

// Middleware to parse JSON request bodies
app.use(express.json());

app.post('/signup', function(req, res) {
    const { email, password } = req.body; // Decode the body to get email and password

    const userExists = USERS.some(user => user.email === email);

    if (userExists) {
        return res.status(400).send('User already exists');
    }
    USERS.push({ email, password });
    res.status(200).send('User registered successfully');
});

app.post('/login', function(req, res) {
    const { email, password } = req.body; // Decode the body to get email and password

    const user = USERS.find(user => user.email === email);

    if (!user) {
        return res.status(404).send('User not found');
    }

    if (user.password === password) {
        // Generate a token (in a real app, use JWT or another method for token generation)
        const token = 'some-random-token';
        res.status(200).json({ token });
    } else {
        res.status(401).send('Invalid password');
    }
});

app.get('/questions', function(req, res) {
    // Return all the questions in the QUESTIONS array
    res.status(200).json(QUESTIONS);
});

app.get("/submissions", function(req, res) {
    // Return the user's submissions for this problem
    res.status(200).json(SUBMISSIONS);
});

app.post("/submissions", function(req, res) {
    const { problemTitle, solution } = req.body;

    // Simulate random acceptance or rejection of the solution
    const isAccepted = Math.random() > 0.5;
    const submission = {
        problemTitle,
        solution,
        status: isAccepted ? 'accepted' : 'rejected'
    };

    SUBMISSIONS.push(submission);
    res.status(200).json({ message: `Solution ${submission.status}` });
});

app.post('/problems', function(req, res) {
    const { isAdmin, newProblem } = req.body; // Assume admin status is sent in the body

    if (!isAdmin) {
        return res.status(403).send('Only admins can add new problems');
    }

    QUESTIONS.push(newProblem);
    res.status(200).send('New problem added successfully');
});

app.listen(port, function() {
    console.log(`Example app listening on port ${port}`);
});
