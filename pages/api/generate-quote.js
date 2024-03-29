import axios from 'axios'
import {
  inputValidation,
  keyValidation,
  languageValidation,
  urlValidation,
} from './helpers'

const generateQuote = async (req, res) => {
  // Define variables for the prompt and language
  let prompt = `"Craft a one-sentence original quote that exudes warmth and optimism, avoiding using the input word and ensuring it is not plagiarized or a repeat of any previously generated quotes."`

  let language = req.body.language || 'English'

  // Create the prompt for the GPT-3 model
  prompt = `${prompt} Translated to ${language} and create the quote from this input: "${req.body.input}"`

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
              quote: response.data.choices[0].text.trim().replace('"', ''),
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
