import express from 'express';
import { 
  BedrockRuntimeClient, 
  InvokeModelCommand 
} from "@aws-sdk/client-bedrock-runtime";

const router = express.Router();

// Bedrockクライアントの初期化
const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

// 実況風ログを生成するAPIエンドポイント
router.post('/generate-log', async (req, res) => {
  const { userName, eventType } = req.body; // 'kill' or 'death'

  if (!userName || !eventType) {
    return res.status(400).json({ error: 'userNameとeventTypeが必要です' });
  }

  // Claude 3 Sonnetモデルへのプロンプトを作成
  const prompt = `あなたは蚊退治ゲームの熱狂的な実況アナウンサーです。プレイヤー「${userName}」が蚊に対して行った行為（${eventType === 'kill' ? '蚊を倒した' : '蚊に刺された'}）について、ユニークで面白い実況コメントを1つだけ生成してください。`;

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 100,
    messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
  };

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0", // Claude 3 SonnetのモデルID
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  try {
    const apiResponse = await client.send(command);
    const decodedBody = new TextDecoder().decode(apiResponse.body);
    const jsonBody = JSON.parse(decodedBody);

    const logMessage = jsonBody.content[0].text;

    res.json({ log: logMessage });
  } catch (error) {
    console.error('Bedrock API error:', error);
    res.status(500).json({ error: '実況ログの生成に失敗しました' });
  }
});

export default router;