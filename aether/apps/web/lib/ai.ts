import { GenerateAssetRequest, GenerateAssetResponse, Asset, OpenAIResponse } from '../../../packages/shared/types'

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY

/**
 * Call OpenAI to generate asset properties from a text prompt
 */
async function generateAssetProperties(prompt: string): Promise<OpenAIResponse> {
  if (!OPENAI_API_KEY) {
    // Mock response for development
    return {
      type: 'box',
      scale: { x: 2, y: 2, z: 2 },
      color: '#ff6b6b',
      description: `A ${prompt}`,
    }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a 3D asset generator. Given a prompt, return JSON with:
- type: "box", "sphere", or "cylinder"
- scale: {x, y, z} in meters (reasonable sizes 0.5-5)
- color: hex color code
- description: brief description

Example: {"type": "box", "scale": {"x": 2, "y": 2, "z": 2}, "color": "#ff6b6b", "description": "A red cube"}`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })

    const data = await response.json()
    const content = data.choices[0]?.message?.content || '{}'
    return JSON.parse(content) as OpenAIResponse
  } catch (error) {
    console.error('OpenAI API error:', error)
    // Fallback to mock
    return {
      type: 'box',
      scale: { x: 2, y: 2, z: 2 },
      color: '#ff6b6b',
      description: `A ${prompt}`,
    }
  }
}

/**
 * Call ElevenLabs to generate audio for asset spawn
 */
async function generateSpawnAudio(description: string): Promise<string | undefined> {
  if (!ELEVENLABS_API_KEY) {
    return undefined
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: `${description} has appeared in the world!`,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    })

    if (!response.ok) {
      throw new Error('ElevenLabs API error')
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    return audioUrl
  } catch (error) {
    console.error('ElevenLabs API error:', error)
    return undefined
  }
}

/**
 * Main function to generate an asset from a prompt
 */
export async function generateAsset(
  request: GenerateAssetRequest
): Promise<GenerateAssetResponse> {
  // Step 1: Get asset properties from OpenAI
  const properties = await generateAssetProperties(request.prompt)

  // Step 2: Create asset object
  const asset: Asset = {
    id: `asset_${Date.now()}`,
    type: properties.type,
    position: request.position,
    scale: properties.scale,
    color: properties.color,
    createdAt: Date.now(),
    createdBy: request.userId,
  }

  // Step 3: Generate audio (async, don't wait)
  generateSpawnAudio(properties.description).then((audioUrl) => {
    if (audioUrl) {
      // Play audio
      const audio = new Audio(audioUrl)
      audio.play().catch(console.error)
    }
  })

  return {
    assetId: asset.id,
    asset,
  }
}


