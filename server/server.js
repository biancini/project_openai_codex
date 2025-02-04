import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const callParams = {
  model: "text-davinci-003",
  temperature: 0, // Higher values means the model will take more risks.
  max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
  top_p: 1, // alternative to sampling with temperature, called nucleus sampling
  frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
  presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
};

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
});

app.post('/chat', async (req, res) => {
  try {
    var params = {...callParams};
    params['prompt'] = req.body.prompt;

    const response = await openai.createCompletion(params);

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

app.post('/cv_summary', async (req, res) => {
  try {
    var params = {...callParams};
    params['prompt'] = `Dammi un feedback sul summary del mio CV quid i seguito : ${req.body.text}`;

    const response = await openai.createCompletion(params);

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

let port = process.env.SERVER_PORT;
app.listen(port, () => console.log(`AI server started on http://localhost:${port}`))