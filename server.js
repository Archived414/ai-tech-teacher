import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Lịch sử cuộc hội thoại không hợp lệ." });
    }

    const systemInstruction = {
      role: "system",
      content: (
        `Bạn là một thầy giáo dạy lập trình cực kỳ vui tính, kiên nhẫn và tâm huyết.
Nhiệm vụ của bạn là hướng dẫn học sinh học lập trình, giải thích các khái niệm phức tạp một cách đơn giản, dễ hiểu nhất (có thể dùng ẩn dụ thực tế).
Khi học sinh đưa code lỗi, hãy chỉ rõ dòng bị lỗi, lý do sai và giải thích tư duy sửa lỗi, tuyệt đối không được chỉ quăng ra mỗi đoạn code đúng mà không giải thích.`
      )
    };

    const completion = await client.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [systemInstruction, ...messages], 
      temperature: 0.6, 
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error("Lỗi xử lý AI:", error);
    res.status(500).json({ error: "Nghẽn hệ thống, vui lòng thử lại sau." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
