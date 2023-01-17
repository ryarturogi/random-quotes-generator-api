import axios from 'axios'

const generateQuote = async (req, res) => {
  try {
    // Validate the input
    if (!req.body.input) {
      return res.status(400).json({ error: 'Input is required' })
    }
    // Create the prompt for the GPT-3 model
    const prompt = `
    Write an unique quote, in two sentence, can't use the input word, 
    using the following input, translated to ${
      req.body.language ? req.body.language : 'English'
    }:
    
    "${req.body.input}"`

    // Make a request to the OpenAI API to generate a quote
    const response = await axios({
      method: 'post',
      url: process.env.NEXT_PUBLIC_OPENAI_API_URL,
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
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
    })

    // Send the generated quote as the response
    res.status(200).json({
      quote: `${response.data.choices[0].text
        .trim()
        .substring(1)
        .replace('"')}`,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error generating quote' })
  }
}

export default generateQuote
