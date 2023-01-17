import axios from 'axios'

const inputValidation = async (req, res, next) => {
  if (!req.body.input) {
    return res.status(400).json({ error: 'Input is required' })
  }
  next()
}

const languageValidation = async (req, res, next) => {
  const supportedLanguages = ['english', 'spanish', 'french', 'german']
  let language = req.body.language || 'english'
  if (!supportedLanguages.includes(language)) {
    return res.status(400).json({ error: 'Invalid language' })
  }
  next()
}

const urlValidation = async (req, res, next) => {
  const url = process.env.NEXT_PUBLIC_OPENAI_API_URL
  if (!url) {
    return res.status(400).json({ error: 'API URL is required' })
  }
  next()
}

const keyValidation = async (req, res, next) => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  if (!apiKey) {
    return res.status(400).json({ error: 'API Key is required' })
  }
  next()
}

const generateQuote = async (req, res) => {
  // Define variables for the prompt and language
  let prompt = `Write an unique quote, in two sentence, can't use the input word.`
  let language = req.body.language || 'English'

  // Create the prompt for the GPT-3 model
  prompt = `${prompt} Translated to ${language}:"${req.body.input}"`

  // Define variables for the API request
  const url = process.env.NEXT_PUBLIC_OPENAI_API_URL
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

  // Execute the validation functions
  inputValidation(req, res, () => {
    languageValidation(req, res, () => {
      urlValidation(req, res, () => {
        keyValidation(req, res, async () => {
          // Make a request to the OpenAI API to generate a quote
          try {
            const response = await axios({
              method: 'post',
              url,
              data: {
                model: 'text-davinci-003',
                prompt,
                max_tokens: 50,
                temperature: 0.5,
                n: 1,
                stop: ['.'],
              },
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
            })
            // Validate the response from the API
            if (!response.data || !response.data.choices) {
              return res.status(500).json({ error: 'Error generating quote' })
            }

            // Send the generated quote as the response
            res.status(200).json({
              quote: response.data.choices[0].text
                .trim()
                .substring(1)
                .replace('"', ''),
            })
          } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Error generating quote' })
          }
        })
      })
    })
  })
}

export default generateQuote
