const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Replace with your MongoDB connection string
const uri = 'mongodb+srv://rockyxxxyash69:SqdjLFaTnPjHuUFA@ cluster0-shard-00-02.2qeam.mongodb.net:27017/mydatabase?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const voteSchema = new mongoose.Schema({
  code: String,
  vote: String
});
const Vote = mongoose.model('Vote', voteSchema);

app.post('/vote', async (req, res) => {
  const { code, vote } = req.body;

  // Check if code is valid
  const allowedCodes = [ /* List of allowed codes */ ];
  if (!allowedCodes.includes(code)) {
    return res.status(400).json({ message: 'Invalid code' });
  }

  try {
    // Check if code has already been used
    const existingVote = await Vote.findOne({ code });
    if (existingVote) {
      return res.status(400).json({ message: 'Code already used' });
    }

    // Store the vote
    const newVote = new Vote({ code, vote });
    await newVote.save();
    res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error saving vote:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/results', async (req, res) => {
  try {
    const results = await Vote.aggregate([
      { $group: { _id: "$vote", count: { $sum: 1 } } }
    ]);
    const formattedResults = {
      Adil: results.find(r => r._id === 'Adil')?.count || 0,
      Anaswara: results.find(r => r._id === 'Anaswara')?.count || 0,
      Prithviraj: results.find(r => r._id === 'Prithviraj')?.count || 0
    };
    res.json(formattedResults);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

