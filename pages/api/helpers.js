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

export { inputValidation, languageValidation, urlValidation, keyValidation }
