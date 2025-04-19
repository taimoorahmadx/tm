import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateTranscript = async (audioText: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional transcription service. Please transcribe the following audio text, maintaining proper punctuation, grammar, and formatting. Include speaker identification if multiple speakers are present."
        },
        {
          role: "user",
          content: audioText
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating transcript:', error);
    throw new Error('Failed to generate transcript');
  }
};

export const summarizeTranscript = async (transcript: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional content summarizer. Please provide a concise summary of the following transcript, highlighting the key points and main ideas."
        },
        {
          role: "user",
          content: transcript
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error summarizing transcript:', error);
    throw new Error('Failed to summarize transcript');
  }
}; 