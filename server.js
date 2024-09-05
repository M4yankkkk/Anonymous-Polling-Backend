const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors()); 

mongoose.connect('mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const VoteSchema = new mongoose.Schema({
  code: String,
  vote: String
});
const Vote = mongoose.model('Vote', VoteSchema);

const allowedCodes = [
  "241CV221", "241CV222", "241CV223", "241CV224", "241CV225",
  "241CV226", "241CV227", "241CV228", "241CV229", "241CV230",
  "241CV231", "241CV232", "241CV233", "241CV234", "241CV235",
  "241CV236", "241CV237", "241CV238", "241CV239", "241CV240",
  "241CV241", "241CV242", "241CV243", "241CV244", "241CV245",
  "241CV246", "241CV247", "241CV248", "241CV249", "241CV250",
  "241CV251", "241CV252", "241CV253", "241CV254", "241CV255",
  "241CV256", "241CV257", "241CV258", "241CV259", "241CV260",
  "241MT001", "241MT002", "241MT003", "241MT004", "241MT005",
  "241MT006", "241MT007", "241MT008", "241MT009", "241MT010",
  "241MT011", "241MT012", "241MT013", "241MT014", "241MT015",
  "241MT016", "241MT017", "241MT018", "241MT019", "241MT020",
  "241MT021", "241MT022", "241MT023", "241MT024", "241MT025",
  "241MT026", "241MT027", "241MT028", "241MT029", "241MT030",
  "241MT031", "241MT032", "241MT033", "241MT034", "241MT035",
  "241MT036", "241MT037", "241MT038", "241MT039", "241MT040"
];

app.post('/vote', async (req, res) => {
  const { code, vote } = req.body;

  if (!allowedCodes.includes(code)) {
    return res.status(400).json({ message: 'Invalid code.' });
  }

  const existingVote = await Vote.findOne({ code });
  if (existingVote) {
    return res.status(400).json({ message: 'Code has already been used.' });
  }

  const newVote = new Vote({ code, vote });
  await newVote.save();
  res.json({ message: 'Vote submitted successfully.' });
});

app.get('/results', async (req, res) => {
  const votes = await Vote.find();
  const result = { optionA: 0, optionB: 0 };

  votes.forEach(vote => {
    if (vote.vote === 'A') result.Adil++;
    if (vote.vote === 'B') result.Anaswara++;
    if (vote.vote === 'C') result.Prithviraj++;
  });

  res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
